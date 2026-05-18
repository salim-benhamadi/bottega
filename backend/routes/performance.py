from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
import models
import auth
from database import db

router = APIRouter(prefix="/api")

@router.get("/performance/{agent_id}", response_model=models.AgentPerformance)
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
    return models.AgentPerformance(agent_id=agent_id, agent_name=agent.get("name", ""),
                                   hired_at=hired_at, days_active=days_active,
                                   task_count=task_count, specializations=specs)
