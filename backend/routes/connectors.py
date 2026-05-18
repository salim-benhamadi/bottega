from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
import auth
from database import db

router = APIRouter(prefix="/api")


class ConnectPayload(BaseModel):
    credentials: dict = {}


@router.get("/connectors")
async def get_connectors(current_user: str = Depends(auth.get_current_user)):
    docs = await db.user_connectors.find({"user_email": current_user}).to_list(200)
    return [{k: v for k, v in d.items() if k != "_id"} for d in docs]


@router.post("/connectors/{connector_id}")
async def connect_connector(
    connector_id: str,
    payload: ConnectPayload,
    current_user: str = Depends(auth.get_current_user),
):
    doc = {
        "user_email": current_user,
        "connector_id": connector_id,
        "status": "connected",
        "credentials": payload.credentials,
        "connected_at": datetime.utcnow().isoformat(),
    }
    await db.user_connectors.update_one(
        {"user_email": current_user, "connector_id": connector_id},
        {"$set": doc},
        upsert=True,
    )
    doc.pop("_id", None)
    return doc


@router.delete("/connectors/{connector_id}")
async def disconnect_connector(
    connector_id: str,
    current_user: str = Depends(auth.get_current_user),
):
    await db.user_connectors.delete_one(
        {"user_email": current_user, "connector_id": connector_id}
    )
    return {"status": "disconnected"}
