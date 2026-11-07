# Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.audio import router as audio_router
from app.api.v1.notulen import router as notulen_router

api_router = APIRouter()

api_router.include_router(health_router, tags=["Health"])
api_router.include_router(audio_router, prefix="/audio", tags=["Audio & VibeVoice"])
api_router.include_router(notulen_router, prefix="/notulen", tags=["Notulen & 9Router"])
