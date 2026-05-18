import csv
import io
from datetime import datetime
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
import auth
from database import db

router = APIRouter(prefix="/api")

COLUMNS = [
    "timestamp", "agent_name", "agent_id", "task_description",
    "result_preview", "delegated", "delegated_to", "pending_approval",
    "approved", "task_id",
]


@router.get("/audit-log/export")
async def export_audit_log(current_user: str = Depends(auth.get_current_user)):
    tasks = await db.tasks.find(
        {"user_email": current_user}
    ).sort("timestamp", -1).to_list(10000)

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=COLUMNS, extrasaction="ignore")
    writer.writeheader()

    for t in tasks:
        # Truncate result to 300 chars so the CSV stays readable
        raw_result = t.get("result", "")
        preview = raw_result[:300].replace("\n", " ") + ("…" if len(raw_result) > 300 else "")

        writer.writerow({
            "timestamp":        t.get("timestamp", ""),
            "agent_name":       t.get("agent_name", ""),
            "agent_id":         t.get("agent_id", ""),
            "task_description": t.get("task_description", ""),
            "result_preview":   preview,
            "delegated":        "yes" if t.get("delegated") else "no",
            "delegated_to":     t.get("delegated_to", ""),
            "pending_approval": "yes" if t.get("pending_approval") else "no",
            "approved":         "yes" if t.get("approved") else "no",
            "task_id":          t.get("task_id", ""),
        })

    output.seek(0)
    date_str = datetime.utcnow().strftime("%Y-%m-%d")
    filename = f"bottega_audit_log_{date_str}.csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
