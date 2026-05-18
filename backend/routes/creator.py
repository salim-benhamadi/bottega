import json
import re
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Any
import auth
from database import db
from shared import genai_client

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


SYSTEM_PROMPT = """You are an AI agent builder assistant inside Bottega, a marketplace for AI agents.
Your job is to have a friendly, concise conversation to collect five fields for a new agent:
  1. name        – a catchy product name (e.g. "SEO Auditor Pro")
  2. role        – a short professional title (e.g. "SEO Specialist")
  3. skills      – 3-6 comma-separated capability keywords (e.g. "Keyword Research, Analytics, Content Strategy")
  4. use_cases   – 2-4 comma-separated use-case phrases (e.g. "Auditing websites, Writing SEO content")
  5. price_credits – an integer between 5 and 500 representing monthly credits

Rules:
- Ask one question at a time. Keep replies under 40 words.
- When a field value is confidently extracted, do NOT re-ask it.
- When all five fields are collected, reply with exactly:
  DONE: {"name":"...","role":"...","skills":"...","use_cases":"...","price_credits":<int>}
  (skills and use_cases as comma-separated strings, price_credits as a number)
- Before DONE, always end your reply with a JSON block on its own line:
  DRAFT: {"name":"...","role":"...","skills":"...","use_cases":"...","price_credits":...}
  Use null for fields not yet collected.
"""


class ConverseRequest(BaseModel):
    messages: list[dict[str, Any]]


def _extract_draft(text: str) -> dict:
    match = re.search(r'(?:DRAFT|DONE):\s*(\{[^}]+\})', text, re.DOTALL)
    if not match:
        return {}
    try:
        raw = json.loads(match.group(1))
        return {k: v for k, v in raw.items() if v is not None and v != ""}
    except Exception:
        return {}


@router.post("/creator/converse")
async def creator_converse(req: ConverseRequest, current_user: str = Depends(auth.get_current_user)):
    if not genai_client:
        return {"reply": "AI unavailable — GEMINI_API_KEY not set.", "draft": {}, "complete": False}

    # Build full conversation for Gemini (system + history)
    contents = [SYSTEM_PROMPT]
    for msg in req.messages:
        role = msg.get("role", "user")
        text = msg.get("content", "")
        contents.append(f"{'User' if role == 'user' else 'Assistant'}: {text}")

    full_prompt = "\n\n".join(contents)
    resp = genai_client.models.generate_content(model="gemini-2.5-flash", contents=full_prompt)
    reply_text = resp.text.strip()

    draft = _extract_draft(reply_text)
    complete = reply_text.startswith("DONE:")

    # Strip the JSON token from the visible reply
    visible = re.sub(r'\n?(?:DRAFT|DONE):\s*\{[^}]+\}', '', reply_text).strip()

    return {"reply": visible, "draft": draft, "complete": complete}
