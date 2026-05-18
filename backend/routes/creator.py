from fastapi import APIRouter, Depends
import auth
from database import db

router = APIRouter(prefix="/api")

@router.get("/creator/stats")
async def get_creator_stats(current_user: str = Depends(auth.get_current_user)):
    agents = await db.marketplace_agents.find({"creator_email": current_user}).to_list(100)
    total_hires = sum(a.get("hire_count", 0) for a in agents)
    total_earnings = sum(int(a.get("price_credits", 0) * 0.15) * a.get("hire_count", 0) for a in agents)
    return {
        "total_hires": total_hires,
        "total_earnings_credits": total_earnings,
        "published_agents": [{k: v for k, v in a.items() if k != "_id"} for a in agents],
    }
