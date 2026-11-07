# Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import uuid
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.models.schemas import TranscribeResponse
from app.services.vibevoice_service import vibevoice_service

router = APIRouter()

@router.post(
    "/transcribe",
    response_model=TranscribeResponse,
    summary="Transcribe and Diarize Audio via Microsoft VibeVoice",
)
async def transcribe_audio(
    audio: UploadFile = File(..., description="Audio recording file (webm, wav, mp3, m4a, ogg)"),
    meeting_id: Optional[str] = Form(None, description="Optional meeting identifier"),
):
    """
    Ingests recorded audio, performs long-form ASR (up to 60 minutes) and
    joint speaker diarization (Who, When, What) using Microsoft VibeVoice pipeline.
    """
    if not audio.filename:
        raise HTTPException(status_code=400, detail="Audio file must have a valid filename.")

    content = await audio.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded audio file is empty.")

    m_id = meeting_id or f"meet-{uuid.uuid4().hex[:8]}"
    saved_path = None

    try:
        saved_path = await vibevoice_service.save_audio_file(audio.filename, content)
        segments, duration = await vibevoice_service.transcribe_and_diarize(saved_path)

        unique_speakers = len(set(s.speaker for s in segments))

        return TranscribeResponse(
            status="success",
            meeting_id=m_id,
            duration_seconds=duration,
            detected_speakers_count=unique_speakers,
            segments=segments,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing audio through VibeVoice: {str(e)}",
        )
    finally:
        if saved_path:
            await vibevoice_service.clean_temp_file(saved_path)
