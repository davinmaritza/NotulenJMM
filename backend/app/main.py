# Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import sys
import os

# Ensure package root is always in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(backend_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1 import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Backend API for NotulenJMM — Intelligent Meeting Minutes System with "
        "Microsoft VibeVoice joint diarization and 9Router LLM gateway. "
        "Created for MPK SMK Negeri 13 Bandung by Davin Maritza."
    ),
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Configure Cross-Origin Resource Sharing (CORS) for Next.js Web and Capacitor APK
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", summary="Root Index")
async def root():
    return {
        "project": "NotulenJMM",
        "status": "online",
        "version": settings.VERSION,
        "author": "Davin Maritza",
        "organization": "MPK SMK Negeri 13 Bandung",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR,
    }

@app.get("/health", summary="Health Check Alias")
async def health_alias():
    from app.api.v1.health import health_check
    return await health_check()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
