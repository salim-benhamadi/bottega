import re
import uuid
import json
import traceback
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import auth
from database import db
from shared import call_model, _create_notification

router = APIRouter(prefix="/api")


class OrchestrateRequest(BaseModel):
    goal: str


@router.post("/orchestrate")
async def orchestrate(req: OrchestrateRequest, current_user: str = Depends(auth.get_current_user)):
    if not req.goal.strip():
        raise HTTPException(status_code=400, detail="Goal cannot be empty")

    # ── 1. Fetch user's hired agents ─────────────────────────────────────────
    agents = await db.user_agents.find({"user_email": current_user}).to_list(50)
    if not agents:
        raise HTTPException(status_code=400, detail="You have no agents hired yet")

    agent_roster = "\n".join([
        f"- id={a['id']}  name={a['name']}  role={a['role']}  skills={', '.join(a.get('skills', []))}"
        for a in agents
    ])

    # ── 2. Orchestrator: decompose goal into an ordered task plan ─────────────
    plan_prompt = f"""You are an AI workflow orchestrator for a business AI platform.

USER GOAL: {req.goal}

AVAILABLE AGENTS (only use ids listed here):
{agent_roster}

Create an execution plan where agents collaborate, each building on the previous step's output.
Return ONLY valid JSON — no markdown, no commentary:

{{
  "title": "short plan title (max 8 words)",
  "steps": [
    {{
      "agent_id": "a1",
      "agent_name": "Proposal Writer Pro",
      "role": "Proposal Writer",
      "task": "specific task this agent must do (1-2 sentences)",
      "depends_on": []
    }},
    {{
      "agent_id": "a3",
      "agent_name": "Lead Hunter Elite",
      "role": "Lead Hunter",
      "task": "specific task using output from previous step",
      "depends_on": [0]
    }}
  ]
}}

Rules:
- Maximum 4 steps
- Only use agent IDs from the list above
- depends_on lists the 0-based indices of steps whose OUTPUT this step needs
- Make each task highly specific and reference dependent outputs explicitly
- If the goal only needs 1 agent, use 1 step"""

    try:
        raw_plan = call_model("gemini-2.5-flash", plan_prompt, temperature=0.1)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Orchestration planning failed: {e}")

    # Strip markdown code fences if present
    raw_plan = re.sub(r"```(?:json)?", "", raw_plan).strip().strip("`")

    try:
        plan = json.loads(raw_plan)
    except json.JSONDecodeError:
        # Try extracting JSON from inside the text
        match = re.search(r"\{[\s\S]+\}", raw_plan)
        if match:
            try:
                plan = json.loads(match.group())
            except Exception:
                raise HTTPException(status_code=500, detail="Could not parse orchestration plan")
        else:
            raise HTTPException(status_code=500, detail="Could not parse orchestration plan")

    steps = plan.get("steps", [])
    if not steps:
        raise HTTPException(status_code=400, detail="No steps generated for this goal")

    # ── 3. Execute each step sequentially, passing prior outputs as context ───
    await _create_notification(
        current_user, "task_complete",
        f"🚀 Orchestration started: \"{req.goal[:60]}\" — {len(steps)} agents assigned"
    )

    results = []
    agent_map = {a["id"]: a for a in agents}

    for i, step in enumerate(steps):
        agent = agent_map.get(step.get("agent_id"))
        if not agent:
            results.append({
                "step": i + 1,
                "agent_id": step.get("agent_id", "unknown"),
                "agent_name": step.get("agent_name", "Unknown"),
                "role": step.get("role", ""),
                "task": step.get("task", ""),
                "result": "(agent not found in your team)",
                "skipped": True,
            })
            continue

        # Build context from dependent steps
        dep_context = ""
        for dep_idx in step.get("depends_on", []):
            if dep_idx < len(results) and not results[dep_idx].get("skipped"):
                dep_result = results[dep_idx]
                dep_context += (
                    f"\n\n---\nOutput from {dep_result['agent_name']} "
                    f"({dep_result['role']}):\n{dep_result['result']}"
                )

        full_task = step["task"]
        if dep_context:
            full_task += f"\n\nUse the following context from previous agents:{dep_context}"

        # Dossier
        dossier_text = "\n".join([
            f"- {d['date']}: {d['skill_acquired']}"
            for d in agent.get("dossier", [])
        ])

        system_prompt = (
            f"You are {agent['name']}, a specialized {agent['role']} working as part of a multi-agent team.\n"
            f"Your Skills: {', '.join(agent.get('skills', []))}\n"
            f"Company knowledge (Dossier):\n{dossier_text or 'None yet.'}\n\n"
            f"You are completing one step of a larger collaborative workflow. "
            f"Be thorough and specific. Your output will be used by the next agent in the pipeline."
        )

        agent_model = (
            agent.get("underlying_model")
            or agent.get("compliance", {}).get("underlying_model")
            or "gemini-2.5-flash"
        )

        try:
            result_text = call_model(agent_model, full_task, system_prompt, temperature=0.3)
        except Exception as e:
            traceback.print_exc()
            result_text = f"(Error: {e})"

        results.append({
            "step": i + 1,
            "agent_id": agent["id"],
            "agent_name": agent["name"],
            "role": agent.get("role", ""),
            "task": step["task"],
            "result": result_text,
            "skipped": False,
        })

        await _create_notification(
            current_user, "task_complete",
            f"✅ Step {i+1}/{len(steps)}: {agent['name']} completed their part"
        )

    # ── 4. Compile all outputs into one final report ──────────────────────────
    steps_text = "\n\n".join([
        f"## Step {r['step']}: {r['agent_name']} ({r['role']})\nTask: {r['task']}\n\nOutput:\n{r['result']}"
        for r in results if not r.get("skipped")
    ])

    compile_prompt = (
        f"You are a professional report compiler.\n\n"
        f"Original goal: \"{req.goal}\"\n\n"
        f"The following agents have each completed their part of the work:\n\n"
        f"{steps_text}\n\n"
        f"Compile all of the above into a single, complete, well-structured professional document. "
        f"Use clear section headers. Merge, deduplicate, and synthesise — do not simply concatenate. "
        f"The final document should be immediately usable by the manager."
    )

    try:
        final_report = call_model("gemini-2.5-flash", compile_prompt, temperature=0.2)
    except Exception as e:
        traceback.print_exc()
        final_report = steps_text  # fallback: raw concatenation

    # ── 5. Store as a task record ─────────────────────────────────────────────
    task_doc = {
        "task_id": str(uuid.uuid4()),
        "user_email": current_user,
        "agent_id": "orchestrator",
        "agent_name": "Multi-Agent Orchestrator",
        "task_description": req.goal,
        "result": final_report,
        "timestamp": datetime.utcnow().isoformat(),
        "delegated": True,
        "approved": True,
        "pending_approval": False,
        "orchestration": True,
        "steps": results,
    }
    await db.tasks.insert_one(task_doc)

    await _create_notification(
        current_user, "task_complete",
        f"🎯 Orchestration complete: \"{req.goal[:50]}\" — report ready"
    )

    return {
        "title": plan.get("title", req.goal[:40]),
        "goal": req.goal,
        "steps": results,
        "final_report": final_report,
    }
