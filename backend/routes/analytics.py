from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
import auth
from database import db

router = APIRouter(prefix="/api")


@router.get("/analytics")
async def get_analytics(current_user: str = Depends(auth.get_current_user)):
    # All tasks for this user
    tasks = await db.tasks.find({"user_email": current_user}).to_list(10000)

    # User record for credit balance
    user = await db.users.find_one({"email": current_user})
    credit_balance = user.get("credit_balance", 0) if user else 0

    # Active agents (hired)
    agents = await db.user_agents.find({"user_email": current_user}).to_list(1000)
    active_agents = len(agents)

    # Totals
    total_tasks = len(tasks)
    delegation_count = sum(1 for t in tasks if t.get("delegated"))

    # Manager approval rate (tasks that required approval)
    approval_needed = [t for t in tasks if t.get("approved") or t.get("pending_approval")]
    approved_count  = sum(1 for t in approval_needed if t.get("approved"))
    approval_rate   = round((approved_count / len(approval_needed)) * 100) if approval_needed else None

    # Estimated hours saved (15 min avg per task)
    hours_saved = round(total_tasks * 0.25, 1)

    # Cost per completed workflow (credits spent on hires / tasks done)
    credits_spent_on_hires_val = sum(a.get("price_credits", 0) for a in agents)
    cost_per_workflow = round(credits_spent_on_hires_val / total_tasks, 1) if total_tasks > 0 else None

    # Tasks per agent
    agent_counts: dict = {}
    agent_names: dict = {}
    for t in tasks:
        aid = t.get("agent_id", "")
        agent_counts[aid] = agent_counts.get(aid, 0) + 1
        if aid not in agent_names:
            agent_names[aid] = t.get("agent_name", aid)

    tasks_per_agent = [
        {"agent_id": aid, "agent_name": agent_names[aid], "count": cnt}
        for aid, cnt in sorted(agent_counts.items(), key=lambda x: -x[1])
    ]

    # Tasks per week — last 8 weeks
    now = datetime.utcnow()
    tasks_per_week = []
    for w in range(7, -1, -1):
        week_start = now - timedelta(days=(w + 1) * 7)
        week_end   = now - timedelta(days=w * 7)
        count = sum(
            1 for t in tasks
            if _parse_ts(t.get("timestamp", "")) and
               week_start <= _parse_ts(t["timestamp"]) < week_end
        )
        label = week_start.strftime("%m/%d").lstrip("0").replace("/0", "/")
        tasks_per_week.append({"label": label, "count": count})

    return {
        "total_tasks": total_tasks,
        "active_agents": active_agents,
        "delegation_count": delegation_count,
        "credit_balance": credit_balance,
        "credits_spent_on_hires": credits_spent_on_hires_val,
        "tasks_per_week": tasks_per_week,
        "tasks_per_agent": tasks_per_agent,
        "approval_rate": approval_rate,
        "hours_saved": hours_saved,
        "cost_per_workflow": cost_per_workflow,
    }


def _parse_ts(ts: str):
    """Parse ISO timestamp string, return datetime or None."""
    try:
        return datetime.fromisoformat(ts)
    except Exception:
        return None
