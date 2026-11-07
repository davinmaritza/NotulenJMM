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

## Structure
```
NotulenJMM/
├── .claude/
│   └── CLAUDE.md
├── LICENSE
└── README.md
```
