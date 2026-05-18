from fastapi import APIRouter, HTTPException, Depends
import models
import auth
from database import db

router = APIRouter(prefix="/api")

@router.delete("/dossier/{agent_id}/{entry_index}")
async def delete_dossier_entry(agent_id: str, entry_index: int, current_user: str = Depends(auth.get_current_user)):
    agent = await db.user_agents.find_one({"id": agent_id, "user_email": current_user})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    dossier = agent.get("dossier", [])
    if entry_index < 0 or entry_index >= len(dossier):
        raise HTTPException(status_code=400, detail="Invalid entry index")
    dossier.pop(entry_index)
    await db.user_agents.update_one({"_id": agent["_id"]}, {"$set": {"dossier": dossier}})
    return {"status": "deleted"}

@router.put("/dossier/{agent_id}/{entry_index}")
async def edit_dossier_entry(agent_id: str, entry_index: int, body: models.DossierEdit,
                              current_user: str = Depends(auth.get_current_user)):
    agent = await db.user_agents.find_one({"id": agent_id, "user_email": current_user})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    dossier = agent.get("dossier", [])
    if entry_index < 0 or entry_index >= len(dossier):
        raise HTTPException(status_code=400, detail="Invalid entry index")
    dossier[entry_index]["skill_acquired"] = body.skill_acquired
    await db.user_agents.update_one({"_id": agent["_id"]}, {"$set": {"dossier": dossier}})
    return {"status": "updated"}
