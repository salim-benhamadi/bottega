from datetime import datetime
from fastapi import APIRouter, Depends
import auth
from database import db

router = APIRouter(prefix="/api")

EU_AI_ACT_HIGH_RISK_KEYWORDS = [
    "legal", "contract", "law", "lawyer", "attorney",
    "recruit", "hiring", "screening", "hr", "background check",
    "credit", "loan", "mortgage", "financial advisor", "investment",
    "medical", "diagnosis", "health", "clinical",
    "biometric", "surveillance", "safety",
]

EU_AI_ACT_LIMITED_RISK_KEYWORDS = [
    "customer", "support", "chat", "chatbot", "helpdesk",
    "advisor", "consultant", "analyst", "review",
    "recommendation", "personalization",
]


def _classify_risk(agent: dict) -> tuple[str, str]:
    role = (agent.get("role") or "").lower()
    skills = " ".join(agent.get("skills") or []).lower()
    use_cases = " ".join(agent.get("use_cases") or []).lower()
    combined = f"{role} {skills} {use_cases}"

    if any(k in combined for k in EU_AI_ACT_HIGH_RISK_KEYWORDS):
        return (
            "High Risk",
            "EU AI Act Annex III — system used in employment, legal, or financial decision-making affecting individuals. "
            "Requires conformity assessment, human oversight, and registration in the EU database.",
        )
    if any(k in combined for k in EU_AI_ACT_LIMITED_RISK_KEYWORDS):
        return (
            "Limited Risk",
            "EU AI Act Article 52 — transparency obligations apply. "
            "Users must be clearly informed they are interacting with an AI system.",
        )
    return (
        "Minimal Risk",
        "EU AI Act — no specific obligations under current regulation. "
        "General good-practice and ethical guidelines apply.",
    )


def _compliance_val(agent: dict, key: str, default):
    c = agent.get("compliance")
    if isinstance(c, dict):
        return c.get(key, default)
    return default


@router.get("/compliance/report")
async def get_compliance_report(current_user: str = Depends(auth.get_current_user)):
    agents = await db.user_agents.find({"user_email": current_user}).to_list(200)
    tasks = await db.tasks.find({"user_email": current_user}).sort("timestamp", -1).to_list(1000)
    user = await db.users.find_one({"email": current_user})

    company = (user or {}).get("company_name") or current_user.split("@")[0].title()

    # ── Build inventory ──────────────────────────────────────────────────────
    inventory = []
    for agent in agents:
        agent_tasks = [t for t in tasks if t.get("agent_id") == agent["id"]]
        risk_level, risk_rationale = _classify_risk(agent)
        inventory.append({
            "id": agent["id"],
            "name": agent["name"],
            "role": agent.get("role", ""),
            "skills": agent.get("skills") or [],
            "use_cases": agent.get("use_cases") or [],
            "autonomy_mode": "Supervised (Probation)" if agent.get("probation_mode") else "Autonomous",
            "underlying_model": _compliance_val(agent, "underlying_model", "Gemini 2.5 Flash"),
            "risk_level": risk_level,
            "risk_rationale": risk_rationale,
            "data_processed": _compliance_val(agent, "data_processed", "User-defined task input"),
            "eu_data_residency": _compliance_val(agent, "eu_data_residency", True),
            "audit_log_enabled": _compliance_val(agent, "audit_log", True),
            "hired_at": agent.get("hired_at", ""),
            "is_official": agent.get("is_official", False),
            "task_count": len(agent_tasks),
            "approval_count": sum(1 for t in agent_tasks if t.get("approved")),
            "escalation_count": sum(1 for t in agent_tasks if t.get("escalation")),
            "a2a_count": sum(1 for t in agent_tasks if t.get("delegated")),
            "allowed_tools": agent.get("allowed_tools") or [],
        })

    # ── Data usage summary ───────────────────────────────────────────────────
    approved_tasks = [t for t in tasks if t.get("approved")]
    pending_tasks = [t for t in tasks if t.get("pending_approval") and not t.get("approved")]
    escalated_tasks = [t for t in tasks if t.get("escalation")]
    delegated_tasks = [t for t in tasks if t.get("delegated")]

    data_summary = {
        "total_tasks_executed": len(tasks),
        "total_agents_deployed": len(agents),
        "tasks_approved": len(approved_tasks),
        "tasks_pending_approval": len(pending_tasks),
        "tasks_escalated": len(escalated_tasks),
        "a2a_delegations": len(delegated_tasks),
        "agents_in_probation": sum(1 for a in agents if a.get("probation_mode")),
        "agents_autonomous": sum(1 for a in agents if not a.get("probation_mode")),
        "high_risk_agents": sum(1 for a in inventory if a["risk_level"] == "High Risk"),
        "limited_risk_agents": sum(1 for a in inventory if a["risk_level"] == "Limited Risk"),
        "minimal_risk_agents": sum(1 for a in inventory if a["risk_level"] == "Minimal Risk"),
    }

    # ── Approval records ─────────────────────────────────────────────────────
    approval_records = [
        {
            "task_id": t.get("task_id", ""),
            "agent_name": t.get("agent_name", ""),
            "agent_id": t.get("agent_id", ""),
            "task_description": (t.get("task_description") or "")[:300],
            "result_preview": (t.get("result") or "")[:200],
            "timestamp": t.get("timestamp", ""),
            "status": "approved" if t.get("approved") else "pending",
        }
        for t in tasks
        if t.get("approved") or t.get("pending_approval")
    ][:100]

    # ── Audit event log ──────────────────────────────────────────────────────
    audit_events = []
    for a in agents:
        if a.get("hired_at"):
            audit_events.append({
                "event": "agent_deployed",
                "label": f"Agent '{a['name']}' deployed",
                "detail": a.get("role", ""),
                "timestamp": a["hired_at"],
                "severity": "info",
            })
    for t in tasks[:200]:
        if t.get("approved"):
            audit_events.append({
                "event": "task_approved",
                "label": f"Task approved — {t.get('agent_name', '')}",
                "detail": (t.get("task_description") or "")[:120],
                "timestamp": t.get("timestamp", ""),
                "severity": "success",
            })
        if t.get("escalation"):
            esc = t.get("escalation", {})
            audit_events.append({
                "event": "escalation",
                "label": f"Escalation ({esc.get('type', 'unknown')}) — {t.get('agent_name', '')}",
                "detail": (esc.get("reason") or "")[:120],
                "timestamp": t.get("timestamp", ""),
                "severity": "warning" if esc.get("type") in ("risky", "stop") else "info",
            })
        if t.get("delegated"):
            audit_events.append({
                "event": "a2a_delegation",
                "label": f"A2A delegation — {t.get('agent_name', '')} → {t.get('delegated_to', '')}",
                "detail": (t.get("task_description") or "")[:100],
                "timestamp": t.get("timestamp", ""),
                "severity": "info",
            })

    audit_events.sort(key=lambda x: x.get("timestamp", ""), reverse=True)

    return {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "report_version": "1.0",
        "framework": "EU Artificial Intelligence Act — Regulation (EU) 2024/1689",
        "deployer_org": company,
        "deployer_email": current_user,
        "platform": "Bottega AI Workforce Manager",
        "platform_provider": "Bottega",
        "inventory": inventory,
        "data_summary": data_summary,
        "approval_records": approval_records,
        "audit_events": audit_events[:150],
        "responsibility_framework": {
            "provider_obligations": [
                "Bottega maintains technical documentation for all official agents on the platform.",
                "The Gemini 2.5 Flash model (Google DeepMind) processes task instructions; model-level safety guardrails apply.",
                "Platform-level cybersecurity, authentication, and access controls are maintained by Bottega.",
                "EU data residency options are available; all agent operations can be restricted to EU infrastructure.",
                "Bottega provides transparency documentation, usage metrics, and audit-log export for all deployers.",
            ],
            "deployer_obligations": [
                f"{company} is responsible for selecting agents appropriate to each use case and risk profile.",
                "Human oversight must be maintained for any agent classified as High Risk under EU AI Act Annex III.",
                f"Individuals affected by AI-assisted decisions by {company} must be informed of AI involvement.",
                "This compliance report must be retained and updated; records of high-risk deployments must be kept for 10 years.",
                "Risk management measures — including probation mode and escalation review — must remain active.",
                "Any significant incidents involving AI agent outputs must be reported to the relevant national authority.",
            ],
            "human_oversight_measures": [
                "Probation Mode: all newly deployed agents require explicit human approval before outputs are committed to memory.",
                "Escalation Protocol: agents are required to pause and request manager input for risky, ambiguous, or high-stakes tasks.",
                "Approval Workflow: sensitive task outputs are flagged for human review before taking effect.",
                "Autonomy Control: deployers can revoke autonomous mode and revert any agent to supervised operation at any time.",
                "A2A Transparency: all agent-to-agent delegations are logged, attributed, and visible to the deployer.",
            ],
        },
    }
