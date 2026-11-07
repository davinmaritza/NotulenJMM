# NotulenJMM

Knowledge-driven meeting minutes, decision tracking, and intelligent transcription system for **NotulenJMM**.

## Overview
NotulenJMM adalah sistem cerdas untuk pencatatan notulen, transkripsi suara rapat, pelacakan keputusan formal, dan penugasan tindak lanjut (*action items*). Aplikasi ini didesain multi-platform (**Android APK & Web Application**) untuk mempermudah notulis serta pimpinan rapat merekam jalannya pertemuan secara akurat dan terstruktur.

## Platform Target & Technology Stack
- **Frontend & Mobile Client**:
  - **Framework**: Next.js 15 (React 19, App Router) + Tailwind CSS + Lucide Icons
  - **Mobile Container**: Capacitor (`@capacitor/core`, `@capacitor/android`) for direct Android APK build
  - **Web**: Responsive Web Dashboard & PWA
- **Backend & Voice Bridge**:
  - **Framework**: Python FastAPI
  - **Speech Engine**: [Microsoft VibeVoice](https://github.com/microsoft/VibeVoice) (ASR, Diarization, Timestamps)
- **AI Gateway**:
  - **Router**: [9router](https://9router.com/) (OpenAI-compatible multi-provider routing)

## 3-Tier Architecture
```
[Android APK / Web Client (Next.js + Capacitor)]
                     │
                     ▼ (REST API / WebSocket)
[Backend Service (FastAPI + VibeVoice Bridge)]
                     │
                     ▼ (OpenAI-compatible)
[9Router Local / Remote AI Gateway]
```

## Core AI & Technical Integrations
- **Speech Engine & Diarization**: [Microsoft VibeVoice](https://github.com/microsoft/VibeVoice)
  - Long-form ASR (Speech-to-Text) hingga 60 menit per pass.
  - Joint speaker diarization & timestamping (mendeteksi *Who spoke, When, and What was said*).
  - High-fidelity conversational TTS dengan tokenisasi 7.5 Hz ultra-low frame rate.
- **LLM Gateway & Inference**: [9router](https://9router.com/)
  - Centralized multi-provider AI router via OpenAI-compatible endpoint.
  - Automatic fallback (multi-tier routing) untuk kestabilan ekstraksi notulen tanpa downtime kuota.
  - Optimasi token & kompresi prompt untuk peringkasan risalah rapat dan ekstraksi keputusan.

## Ownership & License
- **Author / Developer**: Davin Maritza
- **Organization / License**: MPK SMK Negeri 13 Bandung (MIT License, see [LICENSE](file:///home/suzirz/Documents/Project/NotulenJMM/LICENSE))

## Knowledge System Integration
- **Implementation State**: Repository (`main` branch)
- **Project Knowledge Base**: Notion ([`📁 NotulenJMM`](https://app.notion.com/p/40a13039c76781a79b22caef90eefaeb?pvs=204))
- **Agent Enforcement Layer**: [`.claude/CLAUDE.md`](file:///home/suzirz/Documents/Project/NotulenJMM/.claude/CLAUDE.md)

## Standard Workflow
```
Read Context → Inspect Repository → Understand Task → Plan → Implement → Validate → Update Knowledge → Sync Notion → Update Context
```

## Quick Start & Commands

### 1. Backend (FastAPI)
```bash
# Setup virtual environment and dependencies
cd backend
pip install -r requirements.txt

# Run backend API server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Run test suite
pytest tests/ -v
```

### 2. Frontend (Next.js Web & Mobile)
```bash
cd frontend
bun install

# Development server
bun run dev

# Production build
bun run build

# Compile Native Android Debug APK
bun run build:apk:binary
# Output: frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. Docker Compose Stack
```bash
# Start full containerized stack (Frontend + Backend)
docker compose up -d --build
```

## Repository Structure
```
NotulenJMM/
├── .claude/
│   └── CLAUDE.md                   # Knowledge synchronization & agent workflow rules
├── backend/
│   ├── app/
│   │   ├── api/v1/                 # Endpoints: health, audio, notulen
│   │   ├── models/                 # Pydantic schemas
│   │   ├── services/               # VibeVoice bridge & 9Router LLM client
│   │   ├── config.py               # Pydantic-Settings environment loader
│   │   └── main.py                 # FastAPI application entrypoint
│   ├── tests/                      # Pytest unit & integration tests
│   ├── Dockerfile                  # Backend container image
│   └── requirements.txt            # Python dependencies
├── frontend/
│   ├── android/                    # Capacitor native Android container (Gradle)
│   ├── app/                        # Next.js 15 App Router pages & layout
│   ├── components/                 # Audio studio, diarization timeline, notulen editor
│   ├── lib/                        # API client, types, mock data
│   ├── Dockerfile                  # Frontend container image
│   ├── capacitor.config.ts         # Capacitor Android package configuration
│   └── package.json                # Bun/npm scripts & dependencies
├── .env.example                    # Environment variable template
├── docker-compose.yml              # Multi-container orchestration stack
├── LICENSE                         # MIT License (MPK SMK Negeri 13 Bandung, Davin Maritza)
└── README.md                       # Main project documentation
```
