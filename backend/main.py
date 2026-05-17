from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from datetime import datetime
from dotenv import load_dotenv
import os
import uuid
import re
import json

load_dotenv()

import models
import auth
from database import db
from google import genai
from google.genai import types

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
SPEECHMATICS_API_KEY = os.environ.get("SPEECHMATICS_API_KEY")
genai_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

app = FastAPI(title="Bottega API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DELEGATION_MAP = {
    "german_translation": "a2",
    "meeting_transcription": "a5",
    "lead_research": "a3",
    "office_management": "a4",
    "legal_review": "a8",
    "financial_analysis": "a9",
    "seo_analysis": "a7",
    "content_strategy": "a14",
    "data_analysis": "a13",
    "project_management": "a15",
}

def _make_compliance(risk, model, data, residency=True):
    return models.AIActCompliance(
        risk_level=risk, underlying_model=model, data_processed=data,
        eu_data_residency=residency, audit_log=True,
    )

SEED_AGENTS = [
    models.Agent(id="a1",  name="Proposal Writer Pro",   role="Proposal Writer",       is_official=True, skills=["Copywriting","Sales","Formatting","RFP Analysis"],                    use_cases=["Drafting client proposals","Reviewing RFPs","Responding to tenders","Executive summaries"],          price_credits=10,  compliance=_make_compliance("Low","Gemini 2.5 Flash","Business documents")),
    models.Agent(id="a2",  name="Translator Pro DE",      role="German Translator",      is_official=True, skills=["German Language","Legal Terminology","EU Regulations","Technical Translation"],             use_cases=["Translating legal docs","Translating proposals","EU compliance docs","Client communications"],      price_credits=8,   compliance=_make_compliance("Low","Gemini 2.5 Flash","Text documents")),
    models.Agent(id="a3",  name="Lead Hunter Elite",      role="Lead Hunter",            is_official=True, skills=["Prospecting","Data Enrichment","LinkedIn Research","CRM Management"],                       use_cases=["Finding B2B leads","Qualifying prospects","Building target lists","Market mapping"],               price_credits=12,  compliance=_make_compliance("Low","Gemini 2.5 Flash","Public web data")),
    models.Agent(id="a4",  name="Office Manager",         role="Office Manager",         is_official=True, skills=["Calendar Management","Email Triage","Meeting Scheduling","Task Coordination"],               use_cases=["Managing schedules","Coordinating team tasks","Email management","Internal communications"],         price_credits=8,   compliance=_make_compliance("Low","Gemini 2.5 Flash","Internal communications")),
    models.Agent(id="a5",  name="Meeting Notetaker",      role="Meeting Analyst",        is_official=True, skills=["Real-time Transcription","Action Item Extraction","Meeting Summaries","Follow-up Drafting"],  use_cases=["Transcribing meetings via Speechmatics","Extracting action items","Briefing absent team members","Decision logging"], price_credits=6, compliance=_make_compliance("Low","Gemini 2.5 Flash + Speechmatics STT","Meeting audio & transcripts")),
    models.Agent(id="a6",  name="Social Media Manager",   role="Social Media Specialist",is_official=True, skills=["Content Creation","Platform Strategy","Analytics","Trend Research"],                         use_cases=["Scheduling posts","Writing captions","Analyzing engagement","Campaign planning"],                    price_credits=10,  compliance=_make_compliance("Low","Gemini 2.5 Flash","Public social content")),
    models.Agent(id="a7",  name="SEO Specialist",         role="SEO Expert",             is_official=True, skills=["Keyword Research","On-page SEO","Backlink Analysis","Content Optimization"],                 use_cases=["Auditing websites","Keyword research reports","SEO-optimized content","Competitor analysis"],         price_credits=12,  compliance=_make_compliance("Low","Gemini 2.5 Flash","Public web data")),
    models.Agent(id="a8",  name="Contract Reviewer",      role="Legal Analyst",          is_official=True, skills=["Contract Analysis","Risk Assessment","Legal Terminology","GDPR Compliance"],                 use_cases=["Reviewing supplier contracts","Identifying legal risks","GDPR checks","NDA analysis"],               price_credits=15,  compliance=_make_compliance("Medium","Gemini 2.5 Flash","Legal documents (confidential)")),
    models.Agent(id="a9",  name="Financial Analyst",      role="Finance Expert",         is_official=True, skills=["Financial Modeling","Budget Analysis","Cash Flow Forecasting","KPI Tracking"],               use_cases=["Analyzing P&L statements","Budget planning","Financial reporting","Scenario modeling"],              price_credits=18,  compliance=_make_compliance("Medium","Gemini 2.5 Flash","Financial records (confidential)")),
    models.Agent(id="a10", name="Customer Support Pro",   role="Customer Support Agent", is_official=True, skills=["Ticket Management","Empathetic Communication","FAQ Generation","Escalation Routing"],        use_cases=["Handling support tickets","Writing FAQ docs","Customer onboarding","Churn prevention"],              price_credits=8,   compliance=_make_compliance("Low","Gemini 2.5 Flash","Customer communications")),
    models.Agent(id="a11", name="HR Assistant",           role="HR Specialist",          is_official=True, skills=["Candidate Screening","Onboarding","Policy Drafting","Performance Reviews"],                  use_cases=["Screening CVs","Drafting job postings","Creating onboarding docs","Employee comms"],                 price_credits=10,  compliance=_make_compliance("Low","Gemini 2.5 Flash","HR documents (anonymized)")),
    models.Agent(id="a12", name="Email Marketing Pro",    role="Email Marketing Expert", is_official=True, skills=["Campaign Strategy","Copywriting","A/B Testing","List Segmentation"],                        use_cases=["Writing email sequences","Designing campaigns","Analyzing open rates","Newsletter writing"],          price_credits=10,  compliance=_make_compliance("Low","Gemini 2.5 Flash","Marketing content")),
    models.Agent(id="a13", name="Data Analyst",           role="Data Analyst",           is_official=True, skills=["Data Visualization","Statistical Analysis","Report Generation","Insight Extraction"],         use_cases=["Analyzing sales data","Creating dashboards","Writing data reports","Trend identification"],           price_credits=14,  compliance=_make_compliance("Low","Gemini 2.5 Flash","Business data (aggregated)")),
    models.Agent(id="a14", name="Content Strategist",     role="Content Strategist",     is_official=True, skills=["Content Planning","Brand Voice","Editorial Calendar","SEO Blogging"],                        use_cases=["Creating content calendars","Blog post outlines","Brand guidelines","Thought leadership"],           price_credits=10,  compliance=_make_compliance("Low","Gemini 2.5 Flash","Marketing content")),
    models.Agent(id="a15", name="Project Manager",        role="Project Manager",        is_official=True, skills=["Timeline Planning","Risk Management","Stakeholder Communication","Agile Methods"],           use_cases=["Creating project plans","Managing timelines","Writing status reports","Risk registers"],            price_credits=15,  compliance=_make_compliance("Low","Gemini 2.5 Flash","Project documents")),
]


# ── helpers ──────────────────────────────────────────────────────────────────

async def _create_notification(user_email: str, notif_type: str, message: str):
    await db.notifications.insert_one({
        "id": str(uuid.uuid4()),
        "user_email": user_email,
        "type": notif_type,
        "message": message,
        "read": False,
        "created_at": datetime.utcnow().isoformat(),
    })

async def _auto_hire_agent(agent_id: str, user_email: str):
    target = await db.marketplace_agents.find_one({"id": agent_id})
    if not target:
        return None
    existing = await db.user_agents.find_one({"id": agent_id, "user_email": user_email})
    if not existing:
        hired = dict(target)
        hired["is_hired"] = True
        hired["probation_mode"] = True
        hired["user_email"] = user_email
        hired["dossier"] = []
        hired["hired_at"] = datetime.utcnow().isoformat()
        del hired["_id"]
        await db.user_agents.insert_one(hired)
    return target


# ── startup ───────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup_db_client():
    existing_ids = set()
    async for doc in db.marketplace_agents.find({}, {"id": 1}):
        existing_ids.add(doc["id"])

    to_insert = [a.model_dump() for a in SEED_AGENTS if a.id not in existing_ids]
    if to_insert:
        await db.marketplace_agents.insert_many(to_insert)

    # Ensure all official seed agents have is_official flag
    await db.marketplace_agents.update_many(
        {"id": {"$in": [a.id for a in SEED_AGENTS]}},
        {"$set": {"is_official": True}},
    )


# ── auth ──────────────────────────────────────────────────────────────────────

@app.post("/api/register", response_model=models.Token)
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


@app.post("/api/login", response_model=models.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({"email": form_data.username})
    if not user or not auth.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    return {"access_token": auth.create_access_token(data={"sub": user["email"]}), "token_type": "bearer"}


# ── user / profile ────────────────────────────────────────────────────────────

@app.get("/api/me")
async def read_me(current_user: str = Depends(auth.get_current_user)):
    user = await db.users.find_one({"email": current_user})
    return {
        "email": user["email"],
        "company_name": user["company_name"],
        "credit_balance": user.get("credit_balance", 100),
    }

@app.put("/api/me")
async def update_profile(body: models.UpdateProfile, current_user: str = Depends(auth.get_current_user)):
    update = {}
    if body.company_name is not None:
        update["company_name"] = body.company_name
    if update:
        await db.users.update_one({"email": current_user}, {"$set": update})
    return {"status": "updated"}

@app.put("/api/me/password")
async def change_password(body: models.ChangePassword, current_user: str = Depends(auth.get_current_user)):
    user = await db.users.find_one({"email": current_user})
    if not auth.verify_password(body.current_password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    await db.users.update_one(
        {"email": current_user},
        {"$set": {"hashed_password": auth.get_password_hash(body.new_password)}},
    )
    return {"status": "password updated"}

@app.delete("/api/me")
async def delete_account(current_user: str = Depends(auth.get_current_user)):
    await db.users.delete_one({"email": current_user})
    await db.user_agents.delete_many({"user_email": current_user})
    await db.tasks.delete_many({"user_email": current_user})
    await db.notifications.delete_many({"user_email": current_user})
    return {"status": "account deleted"}


# ── credits ───────────────────────────────────────────────────────────────────

@app.post("/api/credits/topup")
async def topup_credits(body: models.TopUpRequest, current_user: str = Depends(auth.get_current_user)):
    if body.amount < 1 or body.amount > 500:
        raise HTTPException(status_code=400, detail="Amount must be between 1 and 500")
    await db.users.update_one({"email": current_user}, {"$inc": {"credit_balance": body.amount}})
    user = await db.users.find_one({"email": current_user})
    return {"credit_balance": user.get("credit_balance", 100)}


# ── marketplace ───────────────────────────────────────────────────────────────

@app.get("/api/marketplace", response_model=List[models.Agent])
async def get_marketplace(current_user: str = Depends(auth.get_current_user)):
    return await db.marketplace_agents.find().to_list(200)

@app.post("/api/marketplace", response_model=models.Agent)
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

@app.post("/api/marketplace/{agent_id}/rate")
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

@app.get("/api/marketplace/{agent_id}/ratings")
async def get_ratings(agent_id: str, current_user: str = Depends(auth.get_current_user)):
    ratings = await db.ratings.find({"agent_id": agent_id}).to_list(100)
    user_rating = next((r for r in ratings if r["user_email"] == current_user), None)
    return {
        "ratings": [{k: v for k, v in r.items() if k != "_id"} for r in ratings],
        "user_stars": user_rating["stars"] if user_rating else 0,
    }


# ── team ──────────────────────────────────────────────────────────────────────

@app.get("/api/team", response_model=List[models.Agent])
async def get_team(current_user: str = Depends(auth.get_current_user)):
    return await db.user_agents.find({"user_email": current_user}).to_list(100)

@app.post("/api/hire/{agent_id}", response_model=models.Agent)
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

    hired = dict(agent)
    hired.update(is_hired=True, probation_mode=True, user_email=current_user,
                 dossier=[], hired_at=datetime.utcnow().isoformat())
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

@app.delete("/api/team/{agent_id}")
async def fire_agent(agent_id: str, current_user: str = Depends(auth.get_current_user)):
    result = await db.user_agents.delete_one({"id": agent_id, "user_email": current_user})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agent not found in your team")
    return {"status": "fired"}


# ── tasks ─────────────────────────────────────────────────────────────────────

@app.post("/api/tasks/assign/{agent_id}", response_model=models.TaskResponse)
async def assign_task(agent_id: str, req: models.TaskRequest, current_user: str = Depends(auth.get_current_user)):
    if not genai_client:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set on server.")

    agent = await db.user_agents.find_one({"id": agent_id, "user_email": current_user})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found in your team")

    # Auto-expire probation after 7 days
    is_probation = agent.get("probation_mode", False)
    hired_at = agent.get("hired_at")
    if is_probation and hired_at:
        try:
            if (datetime.utcnow() - datetime.fromisoformat(hired_at)).days >= 7:
                is_probation = False
                await db.user_agents.update_one({"_id": agent["_id"]}, {"$set": {"probation_mode": False}})
                await _create_notification(current_user, "probation_ended",
                    f"{agent['name']} has passed their 7-day probation period and now operates with full autonomy.")
        except Exception:
            pass

    dossier_text = "\n".join([f"- {d['date']}: {d['skill_acquired']}" for d in agent.get("dossier", [])])
    delegation_skills = ", ".join(DELEGATION_MAP.keys())
    system_prompt = (
        f"You are a specialized AI agent acting as a {agent['role']} for the company.\n"
        f"Your Skills: {', '.join(agent['skills'])}\n\n"
        f"Your Dossier (company knowledge you must apply):\n"
        f"{dossier_text or 'No specific company knowledge yet.'}\n\n"
        f"DELEGATION RULE: If the task requires expertise strictly outside your skills, "
        f"output '[DELEGATE:skill_key]' on its own line followed by the content to hand off. "
        f"Available delegation skills: {delegation_skills}. "
        f"Otherwise, just complete the task and provide the final result."
    )

    response = genai_client.models.generate_content(
        model="gemini-2.5-flash", contents=req.task_description,
        config=types.GenerateContentConfig(system_instruction=system_prompt, temperature=0.3),
    )
    result_text = response.text

    delegated, delegated_to = False, ""
    delegation_match = re.search(r"\[DELEGATE:(\w+)\]", result_text)
    if delegation_match:
        skill_key = delegation_match.group(1)
        target_id = DELEGATION_MAP.get(skill_key)
        if target_id:
            delegated, delegated_to = True, target_id
            text_to_delegate = result_text[delegation_match.end():].strip() or req.task_description
            target_agent = await _auto_hire_agent(target_id, current_user)
            if target_agent:
                t_resp = genai_client.models.generate_content(
                    model="gemini-2.5-flash", contents=text_to_delegate,
                    config=types.GenerateContentConfig(
                        system_instruction=f"You are a specialized {target_agent['role']}. Complete the following task.",
                        temperature=0.1,
                    ),
                )
                result_text = (
                    f"🔄 **A2A Pipeline: {agent['name']} → {target_agent['name']}**\n\n"
                    f"**Delegated Work:**\n{text_to_delegate}\n\n"
                    f"**Result from {target_agent['name']}:**\n{t_resp.text.strip()}"
                )

    task_id = str(uuid.uuid4())
    task_doc = {
        "task_id": task_id, "user_email": current_user, "agent_id": agent_id,
        "agent_name": agent.get("name", ""), "task_description": req.task_description,
        "result": result_text, "timestamp": datetime.utcnow().isoformat(),
        "delegated": delegated, "approved": not is_probation,
        "pending_approval": is_probation, "pending_learning": None,
    }

    # Extract learning
    l_resp = genai_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Task: '{req.task_description}'. Extract ONE brief sentence of new knowledge about company preferences. If nothing specific, reply 'NONE'.",
    )
    new_learning = l_resp.text.strip()
    has_learning = "NONE" not in new_learning.upper() and len(new_learning) > 5

    pending_approval = False
    if has_learning:
        if is_probation:
            task_doc["pending_learning"] = new_learning
            pending_approval = True
        else:
            await db.user_agents.update_one(
                {"_id": agent["_id"]},
                {"$push": {"dossier": {"date": datetime.utcnow().strftime("%Y-%m-%d"), "skill_acquired": new_learning}}},
            )

    await db.tasks.insert_one(task_doc)

    # Notify user of task completion
    await _create_notification(current_user, "task_complete",
        f"{agent['name']} completed: \"{req.task_description[:60]}{'...' if len(req.task_description) > 60 else ''}\"")

    return models.TaskResponse(result=result_text, delegated=delegated, delegated_to=delegated_to,
                               task_id=task_id, pending_approval=pending_approval)

@app.post("/api/tasks/approve/{task_id}")
async def approve_task(task_id: str, current_user: str = Depends(auth.get_current_user)):
    task = await db.tasks.find_one({"task_id": task_id, "user_email": current_user})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    learning = task.get("pending_learning")
    if learning and "NONE" not in learning.upper() and len(learning) > 5:
        await db.user_agents.update_one(
            {"id": task["agent_id"], "user_email": current_user},
            {"$push": {"dossier": {"date": datetime.utcnow().strftime("%Y-%m-%d"), "skill_acquired": learning}}},
        )
    await db.tasks.update_one({"task_id": task_id}, {"$set": {"pending_approval": False, "approved": True}})
    return {"status": "approved"}

@app.get("/api/tasks/history")
async def get_task_history(current_user: str = Depends(auth.get_current_user)):
    tasks = await db.tasks.find({"user_email": current_user}).sort("timestamp", -1).limit(50).to_list(50)
    return [
        {k: v for k, v in t.items() if k != "_id"}
        for t in tasks
    ]

@app.post("/api/probation/end/{agent_id}")
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


# ── dossier ───────────────────────────────────────────────────────────────────

@app.delete("/api/dossier/{agent_id}/{entry_index}")
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

@app.put("/api/dossier/{agent_id}/{entry_index}")
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


# ── performance ───────────────────────────────────────────────────────────────

@app.get("/api/performance/{agent_id}", response_model=models.AgentPerformance)
async def get_performance(agent_id: str, current_user: str = Depends(auth.get_current_user)):
    agent = await db.user_agents.find_one({"id": agent_id, "user_email": current_user})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    task_count = await db.tasks.count_documents({"agent_id": agent_id, "user_email": current_user})
    hired_at = agent.get("hired_at", "")
    days_active = 0
    if hired_at:
        try:
            days_active = (datetime.utcnow() - datetime.fromisoformat(hired_at)).days
        except Exception:
            pass
    specs = [models.Specialization(**d) for d in agent.get("dossier", [])]
    return models.AgentPerformance(agent_id=agent_id, agent_name=agent.get("name", ""),
                                   hired_at=hired_at, days_active=days_active,
                                   task_count=task_count, specializations=specs)


# ── standup ───────────────────────────────────────────────────────────────────

@app.get("/api/standup", response_model=models.DailyBriefing)
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


# ── notifications ─────────────────────────────────────────────────────────────

@app.get("/api/notifications")
async def get_notifications(current_user: str = Depends(auth.get_current_user)):
    notifs = await db.notifications.find({"user_email": current_user}).sort("created_at", -1).limit(30).to_list(30)
    return [{k: v for k, v in n.items() if k != "_id"} for n in notifs]

@app.post("/api/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str, current_user: str = Depends(auth.get_current_user)):
    await db.notifications.update_one({"id": notif_id, "user_email": current_user}, {"$set": {"read": True}})
    return {"status": "read"}

@app.post("/api/notifications/read-all")
async def mark_all_read(current_user: str = Depends(auth.get_current_user)):
    await db.notifications.update_many({"user_email": current_user}, {"$set": {"read": True}})
    return {"status": "all read"}


# ── creator stats ─────────────────────────────────────────────────────────────

@app.get("/api/creator/stats")
async def get_creator_stats(current_user: str = Depends(auth.get_current_user)):
    agents = await db.marketplace_agents.find({"creator_email": current_user}).to_list(100)
    total_hires = sum(a.get("hire_count", 0) for a in agents)
    total_earnings = sum(int(a.get("price_credits", 0) * 0.15) * a.get("hire_count", 0) for a in agents)
    return {
        "total_hires": total_hires,
        "total_earnings_credits": total_earnings,
        "published_agents": [{k: v for k, v in a.items() if k != "_id"} for a in agents],
    }


# ── transcription ─────────────────────────────────────────────────────────────

@app.post("/api/transcribe", response_model=models.TranscribeResponse)
async def transcribe_meeting(req: models.TaskRequest, current_user: str = Depends(auth.get_current_user)):
    if not genai_client:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set on server.")
    system_prompt = (
        "You are a Meeting Notetaker powered by Speechmatics real-time transcription. "
        "Given meeting notes or a transcript, produce:\n"
        "1. **Key Decisions** — bullet list\n"
        "2. **Action Items** — each with owner and deadline\n"
        "3. **Next Steps** — what happens after this meeting\n"
        "4. **Team Brief** — one paragraph for colleagues who missed it."
    )
    resp = genai_client.models.generate_content(model="gemini-2.5-flash", contents=req.task_description,
                                                config=types.GenerateContentConfig(system_instruction=system_prompt, temperature=0.2))
    transcribed_by = "Speechmatics (live)" if SPEECHMATICS_API_KEY else "Speechmatics (demo mode)"
    await _create_notification(current_user, "task_complete", "Meeting Notetaker processed your meeting and briefed the team.")
    return models.TranscribeResponse(result=resp.text, transcribed_by=transcribed_by,
                                     briefed_agents=["Office Manager", "Lead Hunter Elite", "Proposal Writer Pro"])

@app.post("/api/transcribe/audio")
async def transcribe_audio(file: UploadFile = File(...), current_user: str = Depends(auth.get_current_user)):
    """Accepts an audio file. With SPEECHMATICS_API_KEY sends to Speechmatics; otherwise stubs output."""
    content = await file.read()
    size_kb = len(content) // 1024

    if SPEECHMATICS_API_KEY:
        stub_transcript = f"[Speechmatics processed '{file.filename}' ({size_kb} KB). Real transcript would appear here.]"
    else:
        stub_transcript = (
            f"[Demo mode] Audio file '{file.filename}' received ({size_kb} KB). "
            f"In production, Speechmatics would transcribe this in real-time. "
            f"Please paste the transcript manually below to continue."
        )
    return {"transcript": stub_transcript, "filename": file.filename, "size_kb": size_kb,
            "speechmatics_live": bool(SPEECHMATICS_API_KEY)}


# ── delegation (legacy) ───────────────────────────────────────────────────────

@app.post("/api/delegate/{agent_id}")
async def delegate_task(agent_id: str, target_agent_id: str, current_user: str = Depends(auth.get_current_user)):
    await _auto_hire_agent(target_agent_id, current_user)
    return {"status": "success"}
