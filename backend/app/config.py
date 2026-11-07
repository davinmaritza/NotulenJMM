# Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )
    PROJECT_NAME: str = "NotulenJMM Backend API"
    VERSION: str = "0.2.0"
    API_V1_STR: str = "/api/v1"
    
    # 9Router AI Gateway Configuration
    LLM_BASE_URL: str = "https://routernines.bytenodes.icu/v1"
    LLM_API_KEY: str = "9router-default-key"
    LLM_MODEL: str = "ag/gemini-3.8-flash"
    
    # Microsoft VibeVoice Service Configuration
    VIBEVOICE_ENDPOINT: str = os.getenv("VIBEVOICE_ENDPOINT", "http://localhost:8001/asr")
    VIBEVOICE_FRAME_RATE_HZ: float = 7.5
    
    # Storage & Temporary Files
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "/tmp/notulenjmm_audio")
    
    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://localhost",
        "capacitor://localhost",
        "http://localhost",
    ]

settings = Settings()
