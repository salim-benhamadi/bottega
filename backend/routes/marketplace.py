import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, Depends
import models
import auth
from database import db

router = APIRouter(prefix="/api")

@router.get("/marketplace", response_model=List[models.Agent])
async def get_marketplace(current_user: str = Depends(auth.get_current_user)):
    return await db.marketplace_agents.find().to_list(200)

@router.post("/marketplace", response_model=models.Agent)
async def create_marketplace_agent(agent_in: models.AgentCreate, current_user: str = Depends(auth.get_current_user)):
    new_agent = models.Agent(
        id=f"c_{uuid.uuid4().hex[:8]}",
        name=agent_in.name, role=agent_in.role,
        skills=agent_in.skills, use_cases=agent_in.use_cases,
        price_credits=agent_in.price_credits,
        is_official=False, creator_email=current_user,
        compliance=models.AIActCompliance(
            risk_level="Low", underlying_model="Gemini 2.5 Flash",
            data_processed="User defined input", eu_data_residency=True, audit_log=True,
        ),
    )
    await db.marketplace_agents.insert_one(new_agent.model_dump())
    return new_agent

@router.post("/marketplace/{agent_id}/rate")
async def rate_agent(agent_id: str, body: models.RatingRequest, current_user: str = Depends(auth.get_current_user)):
    if not 1 <= body.stars <= 5:
        raise HTTPException(status_code=400, detail="Stars must be between 1 and 5")
    # Upsert: one rating per user per agent
    existing = await db.ratings.find_one({"agent_id": agent_id, "user_email": current_user})
    if existing:
        await db.ratings.update_one(
            {"agent_id": agent_id, "user_email": current_user},
            {"$set": {"stars": body.stars, "review": body.review, "created_at": datetime.utcnow().isoformat()}},
        )
    else:
        await db.ratings.insert_one({
            "id": str(uuid.uuid4()), "agent_id": agent_id, "user_email": current_user,
            "stars": body.stars, "review": body.review, "created_at": datetime.utcnow().isoformat(),
        })
    # Recompute avg
    all_ratings = await db.ratings.find({"agent_id": agent_id}).to_list(1000)
    avg = sum(r["stars"] for r in all_ratings) / len(all_ratings)
    await db.marketplace_agents.update_one(
        {"id": agent_id},
        {"$set": {"avg_rating": round(avg, 1), "rating_count": len(all_ratings)}},
    )
    return {"avg_rating": round(avg, 1), "rating_count": len(all_ratings)}

@router.get("/marketplace/{agent_id}/ratings")
async def get_ratings(agent_id: str, current_user: str = Depends(auth.get_current_user)):
    ratings = await db.ratings.find({"agent_id": agent_id}).to_list(100)
    user_rating = next((r for r in ratings if r["user_email"] == current_user), None)
    return {
        "ratings": [{k: v for k, v in r.items() if k != "_id"} for r in ratings],
        "user_stars": user_rating["stars"] if user_rating else 0,
    }
