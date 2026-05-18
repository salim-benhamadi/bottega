import json
from fastapi import APIRouter, HTTPException, Depends
import models
import auth
from database import db
from shared import genai_client
from google.genai import types

router = APIRouter(prefix="/api")

@router.get("/standup", response_model=models.DailyBriefing)
async def get_standup(current_user: str = Depends(auth.get_current_user)):
    if not genai_client:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set on server.")
    tasks = await db.tasks.find({"user_email": current_user}).sort("timestamp", -1).limit(10).to_list(10)
    if not tasks:
        return models.DailyBriefing(yesterday="No tasks completed recently.", today="Assign some tasks to get started!", blockers="No blockers — your team is ready.")
    ctx = "\n".join([f"- Agent {t['agent_id']} completed: {t['task_description']}" for t in tasks])
    prompt = (f"You are the manager of an AI agent team. Recent tasks:\n{ctx}\n\n"
              f"Write a morning briefing as strict JSON with: 'yesterday' (2 sentences), 'today' (1 sentence), 'blockers' (1 sentence or 'No blockers identified.').\n"
              f"Return ONLY valid JSON: {{\"yesterday\": \"...\", \"today\": \"...\", \"blockers\": \"...\"}}")
    resp = genai_client.models.generate_content(model="gemini-2.5-flash", contents=prompt,
                                                config=types.GenerateContentConfig(response_mime_type="application/json"))
    try:
        data = json.loads(resp.text)
        return models.DailyBriefing(yesterday=data.get("yesterday", ""), today=data.get("today", ""),
                                    blockers=data.get("blockers", "No blockers identified."))
    except Exception:
        return models.DailyBriefing(yesterday="Error generating summary.", today="", blockers="")
