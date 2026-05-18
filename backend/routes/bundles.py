from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
import auth
from database import db
from shared import _create_notification, _log_credit_tx

router = APIRouter(prefix="/api")

BUNDLES = [
    {
        "id": "bundle_sales_growth",
        "name": "Sales & Growth",
        "agent_ids": ["a1", "a3", "a12"],
        "discount": 0.20,
        "color": "green",
        "description": "Full outbound pipeline from prospect to signed proposal",
    },
    {
        "id": "bundle_legal_finance",
        "name": "Legal & Finance",
        "agent_ids": ["a8", "a9", "a2"],
        "discount": 0.25,
        "color": "indigo",
        "description": "Contract review, financial modeling and EU translation coverage",
    },
    {
        "id": "bundle_content_digital",
        "name": "Content & Digital",
        "agent_ids": ["a6", "a7", "a14"],
        "discount": 0.20,
        "color": "purple",
        "description": "Social media, SEO and editorial strategy in one package",
    },
    {
        "id": "bundle_operations_hub",
        "name": "Operations Hub",
        "agent_ids": ["a4", "a5", "a15"],
        "discount": 0.25,
        "color": "teal",
        "description": "Office management, meeting notes and project coordination",
    },
    {
        "id": "bundle_people_support",
        "name": "People & Support",
        "agent_ids": ["a10", "a11", "a13"],
        "discount": 0.20,
        "color": "amber",
        "description": "Customer support, HR screening and data insights",
    },
]


async def _resolve_bundle_agents(agent_ids, current_user):
    agents = []
    individual_total = 0
    all_hired = True
    for agent_id in agent_ids:
        agent = await db.marketplace_agents.find_one({"id": agent_id})
        if agent:
            is_hired = bool(await db.user_agents.find_one({"id": agent_id, "user_email": current_user}))
            if not is_hired:
                all_hired = False
            agents.append({
                "id": agent["id"],
                "name": agent["name"],
                "role": agent["role"],
                "price_credits": agent["price_credits"],
                "is_hired": is_hired,
            })
            individual_total += agent["price_credits"]
    return agents, individual_total, all_hired


@router.get("/bundles")
async def get_bundles(current_user: str = Depends(auth.get_current_user)):
    result = []
    for bundle in BUNDLES:
        agents, individual_total, all_hired = await _resolve_bundle_agents(bundle["agent_ids"], current_user)
        bundle_price = round(individual_total * (1 - bundle["discount"]))
        result.append({
            "id": bundle["id"],
            "name": bundle["name"],
            "description": bundle["description"],
            "color": bundle["color"],
            "discount_pct": int(bundle["discount"] * 100),
            "agents": agents,
            "individual_total": individual_total,
            "bundle_price": bundle_price,
            "is_all_hired": all_hired,
        })
    # Include user-created bundles
    user_bundles = await db.user_bundles.find({}).to_list(100)
    for ub in user_bundles:
        agents, individual_total, all_hired = await _resolve_bundle_agents(ub["agent_ids"], current_user)
        result.append({
            "id": ub["id"],
            "name": ub["name"],
            "description": ub.get("description", ""),
            "color": ub.get("color", "emerald"),
            "discount_pct": ub.get("discount_pct", 10),
            "agents": agents,
            "individual_total": individual_total,
            "bundle_price": ub.get("bundle_price", individual_total),
            "is_all_hired": all_hired,
            "is_user_bundle": True,
            "creator_email": ub.get("creator_email"),
        })
    return result


@router.post("/bundles/hire/{bundle_id}")
async def hire_bundle(bundle_id: str, current_user: str = Depends(auth.get_current_user)):
    # Check user bundles first
    if bundle_id.startswith("ub_"):
        ub = await db.user_bundles.find_one({"id": bundle_id})
        if not ub:
            raise HTTPException(status_code=404, detail="Bundle not found")
        bundle_def = {
            "id": ub["id"],
            "name": ub["name"],
            "agent_ids": ub["agent_ids"],
            "discount": ub.get("discount_pct", 10) / 100,
        }
    else:
        bundle_def = next((b for b in BUNDLES if b["id"] == bundle_id), None)
    if not bundle_def:
        raise HTTPException(status_code=404, detail="Bundle not found")

    # Gather agents not yet hired
    to_hire = []
    individual_total = 0
    for agent_id in bundle_def["agent_ids"]:
        agent = await db.marketplace_agents.find_one({"id": agent_id})
        if not agent:
            continue
        individual_total += agent["price_credits"]
        already = await db.user_agents.find_one({"id": agent_id, "user_email": current_user})
        if not already:
            to_hire.append(agent)

    if not to_hire:
        return {"status": "already_hired", "agents_hired": []}

    bundle_price = round(individual_total * (1 - bundle_def["discount"]))

    # Credit check against bundle price
    user = await db.users.find_one({"email": current_user})
    balance = user.get("credit_balance", 100)
    if balance < bundle_price:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient credits. Need {bundle_price}, have {balance}."
        )

    # Deduct bundle price (once, not per agent)
    await db.users.update_one({"email": current_user}, {"$inc": {"credit_balance": -bundle_price}})
    await _log_credit_tx(
        current_user, -bundle_price, "bundle_hire",
        f"Hired bundle '{bundle_def['name']}' ({bundle_price} cr)"
    )

    hired_names = []
    for agent in to_hire:
        hired = dict(agent)
        hired.update(
            is_hired=True,
            probation_mode=True,
            user_email=current_user,
            dossier=[],
            hired_at=datetime.utcnow().isoformat(),
        )
        if "_id" in hired:
            del hired["_id"]
        await db.user_agents.insert_one(hired)
        await db.marketplace_agents.update_one({"id": agent["id"]}, {"$inc": {"hire_count": 1}})
        hired_names.append(agent["name"])

    await _create_notification(
        current_user, "bundle_hired",
        f"Bundle '{bundle_def['name']}' hired! Agents: {', '.join(hired_names)} — {bundle_price} cr deducted."
    )

    return {"status": "hired", "agents_hired": hired_names}
