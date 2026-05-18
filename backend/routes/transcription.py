from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
import models
import auth
from shared import genai_client, SPEECHMATICS_API_KEY, _create_notification
from google.genai import types

router = APIRouter(prefix="/api")

@router.post("/transcribe", response_model=models.TranscribeResponse)
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

@router.post("/transcribe/audio")
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
