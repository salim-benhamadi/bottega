from fastapi import APIRouter, Depends
import auth
from database import db

router = APIRouter(prefix="/api")

@router.get("/notifications")
async def get_notifications(current_user: str = Depends(auth.get_current_user)):
    notifs = await db.notifications.find({"user_email": current_user}).sort("created_at", -1).limit(30).to_list(30)
    return [{k: v for k, v in n.items() if k != "_id"} for n in notifs]

@router.post("/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str, current_user: str = Depends(auth.get_current_user)):
    await db.notifications.update_one({"id": notif_id, "user_email": current_user}, {"$set": {"read": True}})
    return {"status": "read"}

@router.post("/notifications/read-all")
async def mark_all_read(current_user: str = Depends(auth.get_current_user)):
    await db.notifications.update_many({"user_email": current_user}, {"$set": {"read": True}})
    return {"status": "all read"}
