import re
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from google.genai import types
import models
import auth
from database import db
from shared import genai_client, DELEGATION_MAP, _create_notification, _auto_hire_agent

router = APIRouter(prefix="/api")

@router.post("/tasks/assign/{agent_id}", response_model=models.TaskResponse)
async def assign_task(agent_id: str, req: models.TaskRequest, current_user: str = Depends(auth.get_current_user)):
    if not genai_client:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set on server.")

    agent = await db.user_agents.find_one({"id": agent_id, "user_email": current_user})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found in your team")

    # Auto-expire probation after 7 days
    is_probation = agent.get("probation_mode", False)
    hired_at = agent.get("hired_at")
    if is_probation and hired_at:
        try:
            if (datetime.utcnow() - datetime.fromisoformat(hired_at)).days >= 7:
                is_probation = False
                await db.user_agents.update_one({"_id": agent["_id"]}, {"$set": {"probation_mode": False}})
                await _create_notification(current_user, "probation_ended",
                    f"{agent['name']} has passed their 7-day probation period and now operates with full autonomy.")
        except Exception:
            pass

    dossier_text = "\n".join([f"- {d['date']}: {d['skill_acquired']}" for d in agent.get("dossier", [])])
    delegation_skills = ", ".join(DELEGATION_MAP.keys())
    system_prompt = (
        f"You are a specialized AI agent acting as a {agent['role']} for the company.\n"
        f"Your Skills: {', '.join(agent['skills'])}\n\n"
        f"Your Dossier (company knowledge you must apply):\n"
        f"{dossier_text or 'No specific company knowledge yet.'}\n\n"
        f"DELEGATION RULE: When the task explicitly involves any of these skills you don't have, "
        f"you MUST output '[DELEGATE:skill_key]' on the very first line, then the delegated content. "
        f"Delegation map: german_translation=German translation/German language, "
        f"lead_research=lead generation/prospecting/finding prospects, "
        f"legal_review=legal/contract/GDPR/compliance review, "
        f"financial_analysis=financial/budget/P&L analysis, "
        f"seo_analysis=SEO/keyword/search engine work, "
        f"meeting_transcription=transcription/meeting notes, "
        f"content_strategy=content calendar/blog strategy, "
        f"data_analysis=data visualization/statistical analysis, "
        f"project_management=project planning/timeline. "
        f"Available keys: {delegation_skills}. "
        f"If no delegation needed, just complete the task directly."
    )

    response = genai_client.models.generate_content(
        model="gemini-2.5-flash", contents=req.task_description,
        config=types.GenerateContentConfig(system_instruction=system_prompt, temperature=0.3),
    )
    result_text = response.text

    delegated, delegated_to = False, ""
    delegation_match = re.search(r"\[DELEGATE:(\w+)\]", result_text)
    if delegation_match:
        skill_key = delegation_match.group(1)
        target_id = DELEGATION_MAP.get(skill_key)
        if target_id:
            delegated, delegated_to = True, target_id
            text_to_delegate = result_text[delegation_match.end():].strip() or req.task_description
            target_agent = await _auto_hire_agent(target_id, current_user)
            if target_agent:
                # Notify user the moment delegation is triggered — before execution
                skill_label = skill_key.replace("_", " ")
                await _create_notification(
                    current_user, "a2a_delegation",
                    f"⚡ {agent['name']} needs a specialist: hiring {target_agent['name']} for {skill_label}.",
                )

                t_resp = genai_client.models.generate_content(
                    model="gemini-2.5-flash", contents=text_to_delegate,
                    config=types.GenerateContentConfig(
                        system_instruction=f"You are a specialized {target_agent['role']}. Complete the following task.",
                        temperature=0.1,
                    ),
                )
                result_text = (
                    f"🔄 **A2A Pipeline: {agent['name']} → {target_agent['name']}**\n\n"
                    f"**Delegated Work:**\n{text_to_delegate}\n\n"
                    f"**Result from {target_agent['name']}:**\n{t_resp.text.strip()}"
                )

                # Notify user that the pipeline completed
                await _create_notification(
                    current_user, "a2a_complete",
                    f"✅ A2A complete: {target_agent['name']} handed work back to {agent['name']}.",
                )

    task_id = str(uuid.uuid4())
    task_doc = {
        "task_id": task_id, "user_email": current_user, "agent_id": agent_id,
        "agent_name": agent.get("name", ""), "task_description": req.task_description,
        "result": result_text, "timestamp": datetime.utcnow().isoformat(),
        "delegated": delegated, "approved": not is_probation,
        "pending_approval": is_probation, "pending_learning": None,
    }

    # Extract learning
    l_resp = genai_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Task: '{req.task_description}'. Extract ONE brief sentence of new knowledge about company preferences. If nothing specific, reply 'NONE'.",
    )
    new_learning = l_resp.text.strip()
    has_learning = "NONE" not in new_learning.upper() and len(new_learning) > 5

    pending_approval = False
    if has_learning:
        if is_probation:
            task_doc["pending_learning"] = new_learning
            pending_approval = True
        else:
            await db.user_agents.update_one(
                {"_id": agent["_id"]},
                {"$push": {"dossier": {"date": datetime.utcnow().strftime("%Y-%m-%d"), "skill_acquired": new_learning}}},
            )

    await db.tasks.insert_one(task_doc)

    # Notify user of task completion
    await _create_notification(current_user, "task_complete",
        f"{agent['name']} completed: \"{req.task_description[:60]}{'...' if len(req.task_description) > 60 else ''}\"")

    return models.TaskResponse(result=result_text, delegated=delegated, delegated_to=delegated_to,
                               task_id=task_id, pending_approval=pending_approval)

@router.post("/tasks/approve/{task_id}")
async def approve_task(task_id: str, current_user: str = Depends(auth.get_current_user)):
    task = await db.tasks.find_one({"task_id": task_id, "user_email": current_user})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    learning = task.get("pending_learning")
    if learning and "NONE" not in learning.upper() and len(learning) > 5:
        await db.user_agents.update_one(
            {"id": task["agent_id"], "user_email": current_user},
            {"$push": {"dossier": {"date": datetime.utcnow().strftime("%Y-%m-%d"), "skill_acquired": learning}}},
        )
    await db.tasks.update_one({"task_id": task_id}, {"$set": {"pending_approval": False, "approved": True}})
    return {"status": "approved"}

@router.get("/tasks/history")
async def get_task_history(
    current_user: str = Depends(auth.get_current_user),
    agent_id: str = None,
    search: str = None,
    limit: int = 50,
):
    query: dict = {"user_email": current_user}
    if agent_id:
        query["agent_id"] = agent_id
    if search:
        query["task_description"] = {"$regex": search, "$options": "i"}
    tasks = await db.tasks.find(query).sort("timestamp", -1).limit(min(limit, 200)).to_list(min(limit, 200))
    return [{k: v for k, v in t.items() if k != "_id"} for t in tasks]

@router.post("/delegate/{agent_id}")
async def delegate_task(agent_id: str, target_agent_id: str, current_user: str = Depends(auth.get_current_user)):
    await _auto_hire_agent(target_agent_id, current_user)
    return {"status": "success"}
