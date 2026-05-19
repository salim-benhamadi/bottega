import asyncio
import httpx
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
import models
import auth
from database import db
from shared import genai_client, SPEECHMATICS_KEY, _create_notification, call_model
from google.genai import types

router = APIRouter(prefix="/api")

ANALYSIS_PROMPT = """You are a professional Meeting Notetaker. Given a meeting transcript or notes, produce a structured analysis with EXACTLY these four sections using these exact headers:

## Key Decisions
- [bullet list of concrete decisions made]

## Action Items
- [task description] — Owner: [name/role], Deadline: [timeframe]

## Next Steps
- [what happens after this meeting, in order]

## Team Brief
[One paragraph summary for colleagues who missed the meeting — conversational tone, covers the essentials]

Be specific. Extract real names, dates and numbers from the transcript where present. If something is not mentioned, write "Not discussed" rather than fabricating details."""


async def _call_speechmatics(content: bytes, filename: str) -> str:
    """Submit audio to Speechmatics, poll until done, return plain-text transcript."""
    async with httpx.AsyncClient(timeout=300.0) as client:
        submit = await client.post(
            "https://asr.api.speechmatics.com/v2/jobs/",
            headers={"Authorization": f"Bearer {SPEECHMATICS_KEY}"},
            files={"data_file": (filename, content, "audio/mpeg")},
            data={"config": '{"type":"transcription","transcription_config":{"language":"en","diarization":"speaker"}}'},
        )
        if submit.status_code not in (200, 201):
            raise RuntimeError(f"Speechmatics submit failed ({submit.status_code}): {submit.text[:200]}")

        job_id = submit.json()["id"]

        for _ in range(72):  # poll up to 6 minutes
            await asyncio.sleep(5)
            check = await client.get(
                f"https://asr.api.speechmatics.com/v2/jobs/{job_id}",
                headers={"Authorization": f"Bearer {SPEECHMATICS_KEY}"},
            )
            status = check.json().get("job", {}).get("status", "")
            if status == "done":
                break
            if status in ("rejected", "failed"):
                raise RuntimeError(f"Speechmatics job {status}")

        txt = await client.get(
            f"https://asr.api.speechmatics.com/v2/jobs/{job_id}/transcript?format=txt",
            headers={"Authorization": f"Bearer {SPEECHMATICS_KEY}"},
        )
        return txt.text.strip()


@router.post("/transcribe", response_model=models.TranscribeResponse)
async def transcribe_meeting(req: models.TaskRequest, current_user: str = Depends(auth.get_current_user)):
    if not genai_client:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set on server.")

    try:
        result_text = call_model(
            model="gemini-2.5-flash",
            user_prompt=req.task_description,
            system_prompt=ANALYSIS_PROMPT,
            temperature=0.2
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini error: {e}")

    user_agents = await db.user_agents.find(
        {"user_email": current_user}, {"name": 1}
    ).to_list(20)
    briefed = [a["name"] for a in user_agents[:5]] if user_agents else []

    transcribed_by = "Speechmatics + Gemini 2.5 Flash" if SPEECHMATICS_KEY else "Gemini 2.5 Flash"
    await _create_notification(
        current_user, "task_complete",
        "Meeting Notetaker processed your meeting and auto-briefed your team."
    )
    return models.TranscribeResponse(
        result=result_text,
        transcribed_by=transcribed_by,
        briefed_agents=briefed,
    )


@router.post("/transcribe/audio")
async def transcribe_audio(
    file: UploadFile = File(...),
    current_user: str = Depends(auth.get_current_user),
):
    content = await file.read()
    size_kb = len(content) // 1024

    if SPEECHMATICS_KEY:
        try:
            transcript = await _call_speechmatics(content, file.filename)
            speechmatics_live = True
        except Exception as exc:
            transcript = (
                f"Speechmatics error: {exc}\n\n"
                "You can paste the transcript manually below."
            )
            speechmatics_live = False
    else:
        transcript = (
            f"[Demo mode — no SPEECHMATICS_KEY] '{file.filename}' ({size_kb} KB) received. "
            "Add SPEECHMATICS_KEYto your .env for real transcription. "
            "Paste your transcript text manually to continue."
        )
        speechmatics_live = False

    return {
        "transcript": transcript,
        "filename": file.filename,
        "size_kb": size_kb,
        "speechmatics_live": speechmatics_live,
    }


@router.post("/transcribe/full")
async def transcribe_full(
    file: UploadFile = File(...),
    current_user: str = Depends(auth.get_current_user),
):
    """Upload audio → Speechmatics transcription → Gemini analysis in one shot."""
    if not genai_client:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set on server.")

    content = await file.read()
    size_kb = len(content) // 1024
    speechmatics_live = False
    transcript = ""

    if SPEECHMATICS_KEY:
        try:
            transcript = await _call_speechmatics(content, file.filename)
            speechmatics_live = True
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Speechmatics error: {exc}")
    else:
        transcript = (
            f"[Demo transcript for '{file.filename}' ({size_kb} KB)] "
            "This is a placeholder because no SPEECHMATICS_KEYis configured. "
            "In production, the real speaker-diarized transcript would appear here."
        )

    try:
        result_text = call_model(
            model="gemini-2.5-flash",
            user_prompt=transcript,
            system_prompt=ANALYSIS_PROMPT,
            temperature=0.2
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini error: {e}")

    user_agents = await db.user_agents.find(
        {"user_email": current_user}, {"name": 1}
    ).to_list(20)
    briefed = [a["name"] for a in user_agents[:5]] if user_agents else []

    transcribed_by = "Speechmatics + Gemini 2.5 Flash" if speechmatics_live else "Gemini 2.5 Flash (demo)"
    await _create_notification(
        current_user, "task_complete",
        f"Meeting Notetaker processed '{file.filename}' and auto-briefed your team."
    )

    return {
        "transcript": transcript,
        "result": result_text,
        "transcribed_by": transcribed_by,
        "briefed_agents": briefed,
        "speechmatics_live": speechmatics_live,
        "filename": file.filename,
        "size_kb": size_kb,
    }
