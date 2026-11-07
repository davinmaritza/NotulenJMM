# Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
from fastapi import APIRouter
from app.config import settings
from app.models.schemas import HealthResponse
from app.services.router_service import router_service

router = APIRouter()

@router.get("/health", response_model=HealthResponse, summary="System Health and Status Check")
async def health_check():
    """
    Returns system status, active version, 9Router LLM connectivity, and VibeVoice status.
    """
    router_active = await router_service.check_health()
    
    return HealthResponse(
        status="healthy",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        router_gateway="connected" if router_active else "standby (local fallback ready)",
        vibevoice_engine="ready (joint asr & diarization)",
    )
