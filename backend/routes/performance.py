from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
import models
import auth
from database import db

router = APIRouter(prefix="/api")

@router.get("/performance/{agent_id}")
async def get_performance(agent_id: str, current_user: str = Depends(auth.get_current_user)):
    agent = await db.user_agents.find_one({"id": agent_id, "user_email": current_user})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    task_count = await db.tasks.count_documents({"agent_id": agent_id, "user_email": current_user})
    hired_at = agent.get("hired_at", "")
    days_active = 0
    if hired_at:
        try:
            days_active = (datetime.utcnow() - datetime.fromisoformat(hired_at)).days
        except Exception:
            pass
    specs = [models.Specialization(**d) for d in agent.get("dossier", [])]

    # Pending approval tasks (tasks awaiting manager review)
    pending_tasks = await db.tasks.count_documents(
        {"agent_id": agent_id, "user_email": current_user, "pending_approval": True}
    )

    # Build compliance block if present
    compliance_raw = agent.get("compliance", {})
    compliance = {
        "risk_level":       compliance_raw.get("risk_level", "limited"),
        "underlying_model": compliance_raw.get("underlying_model", "Gemini 2.5 Flash"),
        "data_processed":   compliance_raw.get("data_processed", "Internal task data"),
        "eu_data_residency":compliance_raw.get("eu_data_residency", False),
        "audit_log":        compliance_raw.get("audit_log", True),
    }

    return {
        "agent_id":           agent_id,
        "agent_name":         agent.get("name", ""),
        "role":               agent.get("role", ""),
        "skills":             agent.get("skills", []),
        "use_cases":          agent.get("use_cases", []),
        "price_credits":      agent.get("price_credits", 0),
        "probation_mode":     agent.get("probation_mode", False),
        "avg_rating":         agent.get("avg_rating", 0.0),
        "rating_count":       agent.get("rating_count", 0),
        "is_official":        agent.get("is_official", False),
        "hired_at":           hired_at,
        "days_active":        days_active,
        "task_count":         task_count,
        "pending_approvals":  pending_tasks,
        "specializations":    [{"date": s.date, "skill_acquired": s.skill_acquired} for s in specs],
        "compliance":         compliance,
    }
