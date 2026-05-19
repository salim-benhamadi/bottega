import os
import uuid
import requests
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from google.genai import types
import models
from database import db

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
SPEECHMATICS_KEY= os.environ.get("SPEECHMATICS_KEY")
FEATHERLESS_KEY = os.environ.get("FEATHERLESS_KEY")
FEATHERLESS_BASE = "https://api.featherless.ai/v1"

genai_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


def call_model(model: str, user_prompt: str, system_prompt: str = "", temperature: float = 0.3) -> str:
    """Route a generation call to Gemini or Featherless depending on the model name."""
    model = model or "gemini-2.5-flash"

    # Normalise human-readable display names → valid API model IDs
    # e.g. "Gemini 2.5 Flash" → "gemini-2.5-flash"
    if model.lower().startswith("gemini"):
        # The current API key only has quota and access for gemini-2.5-flash on the free tier.
        # Other models (like pro models or other versions) return 429/404 errors.
        model = "gemini-2.5-flash"

    if model.lower().startswith("gemini"):
        if not genai_client:
            raise RuntimeError("GEMINI_API_KEY not set")
        
        # Try a list of fallback models in case the primary one is rate-limited or experiencing high demand (503/429)
        models_to_try = [model, "gemini-flash-latest", "gemini-flash-lite-latest"]
        last_err = None
        for m in models_to_try:
            try:
                cfg_kwargs = {"temperature": temperature}
                if system_prompt:
                    cfg_kwargs["system_instruction"] = system_prompt
                cfg = types.GenerateContentConfig(**cfg_kwargs)
                resp = genai_client.models.generate_content(model=m, contents=user_prompt, config=cfg)
                text = resp.text
                if text is None:
                    # Fallback: stitch text parts manually (e.g. when thinking tokens are present)
                    try:
                        text = "".join(
                            p.text for p in resp.candidates[0].content.parts
                            if getattr(p, "text", None)
                        )
                    except Exception:
                        text = ""
                return text.strip()
            except Exception as e:
                last_err = e
                continue
        raise last_err
    else:
        if not FEATHERLESS_KEY:
            raise RuntimeError("FEATHERLESS_KEY not set")
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": user_prompt})
        resp = requests.post(
            f"{FEATHERLESS_BASE}/chat/completions",
            headers={"Authorization": f"Bearer {FEATHERLESS_KEY}", "Content-Type": "application/json"},
            json={"model": model, "messages": messages, "temperature": temperature, "max_tokens": 2048},
            timeout=120,
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"].strip()

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

async def _create_notification(user_email: str, notif_type: str, message: str):
    await db.notifications.insert_one({
        "id": str(uuid.uuid4()),
        "user_email": user_email,
        "type": notif_type,
        "message": message,
        "read": False,
        "created_at": datetime.utcnow().isoformat(),
    })

async def _log_credit_tx(user_email: str, amount: int, tx_type: str, description: str):
    await db.credit_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "user_email": user_email,
        "amount": amount,
        "type": tx_type,
        "description": description,
        "created_at": datetime.utcnow().isoformat(),
    })

async def _auto_hire_agent(agent_id: str, user_email: str):
    target = await db.marketplace_agents.find_one({"id": agent_id})
    if not target:
        return None
    existing = await db.user_agents.find_one({"id": agent_id, "user_email": user_email})
    if not existing:
        cost = target.get("price_credits", 0)
        if cost > 0:
            await db.users.update_one({"email": user_email}, {"$inc": {"credit_balance": -cost}})
            await _log_credit_tx(user_email, -cost, "a2a_hire", f"A2A auto-hire: {target['name']} ({cost} cr)")
        hired = dict(target)
        hired["is_hired"] = True
        hired["probation_mode"] = True
        hired["user_email"] = user_email
        hired["dossier"] = []
        hired["hired_at"] = datetime.utcnow().isoformat()
        del hired["_id"]
        await db.user_agents.insert_one(hired)
    return target
