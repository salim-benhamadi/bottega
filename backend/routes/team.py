from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, Depends
import models
import auth
from database import db
from shared import _create_notification, _log_credit_tx

router = APIRouter(prefix="/api")

@router.get("/team", response_model=List[models.Agent])
async def get_team(current_user: str = Depends(auth.get_current_user)):
    return await db.user_agents.find({"user_email": current_user}).to_list(100)

@router.post("/hire/{agent_id}", response_model=models.Agent)
async def hire_agent(agent_id: str, current_user: str = Depends(auth.get_current_user)):
    agent = await db.marketplace_agents.find_one({"id": agent_id})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    if await db.user_agents.find_one({"id": agent_id, "user_email": current_user}):
        raise HTTPException(status_code=400, detail="Agent already hired")

    # Credit check
    user = await db.users.find_one({"email": current_user})
    balance = user.get("credit_balance", 100)
    if balance < agent["price_credits"]:
        raise HTTPException(status_code=400, detail=f"Insufficient credits. Need {agent['price_credits']}, have {balance}.")

    await db.users.update_one({"email": current_user}, {"$inc": {"credit_balance": -agent["price_credits"]}})
    await _log_credit_tx(current_user, -agent["price_credits"], "hire", f"Hired {agent['name']} ({agent['price_credits']} cr)")

    hired = dict(agent)
    hired.update(is_hired=True, probation_mode=True, user_email=current_user,
                 dossier=[], hired_at=datetime.utcnow().isoformat())
    if "_id" in hired:
        del hired["_id"]
    await db.user_agents.insert_one(hired)

    # Increment hire_count on marketplace agent
    await db.marketplace_agents.update_one({"id": agent_id}, {"$inc": {"hire_count": 1}})

    # Notify creator if community agent
    if agent.get("creator_email") and agent["creator_email"] != current_user:
        await _create_notification(
            agent["creator_email"], "agent_hired",
            f"Your agent '{agent['name']}' was hired! You earned {int(agent['price_credits'] * 0.15)} credits (15% royalty).",
        )
        await db.users.update_one(
            {"email": agent["creator_email"]},
            {"$inc": {"credit_balance": int(agent["price_credits"] * 0.15)}},
        )

    return hired

@router.delete("/team/{agent_id}")
async def fire_agent(agent_id: str, current_user: str = Depends(auth.get_current_user)):
    result = await db.user_agents.delete_one({"id": agent_id, "user_email": current_user})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agent not found in your team")
    return {"status": "fired"}

@router.post("/probation/end/{agent_id}")
async def end_probation(agent_id: str, current_user: str = Depends(auth.get_current_user)):
    result = await db.user_agents.update_one(
        {"id": agent_id, "user_email": current_user}, {"$set": {"probation_mode": False}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agent not found")
    agent = await db.user_agents.find_one({"id": agent_id, "user_email": current_user})
    await _create_notification(current_user, "probation_ended",
        f"{agent.get('name', 'Agent')} probation ended — they now operate with full autonomy.")
    return {"status": "success"}


@router.put("/team/{agent_id}/tools")
async def update_agent_tools(agent_id: str, payload: dict, current_user: str = Depends(auth.get_current_user)):
    allowed_tools = payload.get("allowed_tools", [])
    await db.user_agents.update_one(
        {"id": agent_id, "user_email": current_user},
        {"$set": {"allowed_tools": allowed_tools}},
    )
    return {"status": "updated", "allowed_tools": allowed_tools}


@router.get("/team/structure")
async def get_structure(current_user: str = Depends(auth.get_current_user)):
    doc = await db.team_structure.find_one({"user_email": current_user})
    return doc.get("structure", {}) if doc else {}


@router.put("/team/structure")
async def save_structure(payload: dict, current_user: str = Depends(auth.get_current_user)):
    await db.team_structure.update_one(
        {"user_email": current_user},
        {"$set": {"user_email": current_user, "structure": payload}},
        upsert=True,
    )
    return {"status": "saved"}
