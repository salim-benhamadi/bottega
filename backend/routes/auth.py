from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
import models
import auth
from database import db

router = APIRouter(prefix="/api")

@router.post("/register", response_model=models.Token)
async def register(user: models.UserCreate):
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    user_in_db = models.UserInDB(
        email=user.email,
        hashed_password=auth.get_password_hash(user.password),
        company_name=user.company_name,
        credit_balance=100,
    )
    await db.users.insert_one(user_in_db.model_dump())
    return {"access_token": auth.create_access_token(data={"sub": user.email}), "token_type": "bearer"}

@router.post("/login", response_model=models.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({"email": form_data.username})
    if not user or not auth.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    return {"access_token": auth.create_access_token(data={"sub": user["email"]}), "token_type": "bearer"}
