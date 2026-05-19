from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import db
from shared import SEED_AGENTS

# Import routes
from routes import auth, user, marketplace, team, tasks, dossier, performance, standup, notifications, creator, transcription, analytics, audit, bundles, connectors, compliance, orchestrate

app = FastAPI(title="Bottega API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(marketplace.router)
app.include_router(team.router)
app.include_router(tasks.router)
app.include_router(dossier.router)
app.include_router(performance.router)
app.include_router(standup.router)
app.include_router(notifications.router)
app.include_router(creator.router)
app.include_router(transcription.router)
app.include_router(analytics.router)
app.include_router(audit.router)
app.include_router(bundles.router)
app.include_router(connectors.router)
app.include_router(compliance.router)
app.include_router(orchestrate.router)

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

    # Migrate any legacy Gemini 1.5 Pro model references to Gemini 2.5 Flash
    await db.marketplace_agents.update_many(
        {"compliance.underlying_model": "Gemini 1.5 Pro"},
        {"$set": {"compliance.underlying_model": "Gemini 2.5 Flash"}}
    )
    await db.user_agents.update_many(
        {"compliance.underlying_model": "Gemini 1.5 Pro"},
        {"$set": {"compliance.underlying_model": "Gemini 2.5 Flash"}}
    )
