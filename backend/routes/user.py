from fastapi import APIRouter, HTTPException, Depends
import models
import auth
from database import db
from shared import _log_credit_tx

router = APIRouter(prefix="/api")

@router.get("/me")
async def read_me(current_user: str = Depends(auth.get_current_user)):
    user = await db.users.find_one({"email": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "email": user["email"],
        "company_name": user["company_name"],
        "credit_balance": user.get("credit_balance", 100),
    }

@router.put("/me")
async def update_profile(body: models.UpdateProfile, current_user: str = Depends(auth.get_current_user)):
    update = {}
    if body.company_name is not None:
        update["company_name"] = body.company_name
    if update:
        await db.users.update_one({"email": current_user}, {"$set": update})
    return {"status": "updated"}

@router.put("/me/password")
async def change_password(body: models.ChangePassword, current_user: str = Depends(auth.get_current_user)):
    user = await db.users.find_one({"email": current_user})
    if not user:
         raise HTTPException(status_code=404, detail="User not found")
    if not auth.verify_password(body.current_password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    await db.users.update_one(
        {"email": current_user},
        {"$set": {"hashed_password": auth.get_password_hash(body.new_password)}},
    )
    return {"status": "password updated"}

@router.delete("/me")
async def delete_account(current_user: str = Depends(auth.get_current_user)):
    await db.users.delete_one({"email": current_user})
    await db.user_agents.delete_many({"user_email": current_user})
    await db.tasks.delete_many({"user_email": current_user})
    await db.notifications.delete_many({"user_email": current_user})
    return {"status": "account deleted"}

@router.post("/credits/topup")
async def topup_credits(body: models.TopUpRequest, current_user: str = Depends(auth.get_current_user)):
    if body.amount < 1 or body.amount > 500:
        raise HTTPException(status_code=400, detail="Amount must be between 1 and 500")
    await db.users.update_one({"email": current_user}, {"$inc": {"credit_balance": body.amount}})
    await _log_credit_tx(current_user, body.amount, "topup", f"Credit top-up +{body.amount} cr")
    user = await db.users.find_one({"email": current_user})
    return {"credit_balance": user.get("credit_balance", 100)}

@router.get("/credits/history")
async def credit_history(current_user: str = Depends(auth.get_current_user)):
    txs = await db.credit_transactions.find(
        {"user_email": current_user}
    ).sort("created_at", -1).to_list(50)
    return [{"amount": t["amount"], "type": t["type"], "description": t["description"], "created_at": t["created_at"]} for t in txs]
