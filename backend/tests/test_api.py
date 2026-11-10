# Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import sys
import os
import io
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is in python path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

client = TestClient(app)

def test_root_endpoint():
    """Verify root index status and metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "NotulenJMM"
    assert data["status"] == "online"
    assert "MPK SMK Negeri 13 Bandung" in data["organization"]
    assert "Davin Maritza" in data["author"]

def test_health_check_endpoint():
    """Verify health endpoint reports engine and gateway status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "router_gateway" in data
    assert "vibevoice_engine" in data

def test_audio_transcribe_empty_file():
    """Verify uploading empty file returns 400 Bad Request."""
    files = {"audio": ("test.webm", io.BytesIO(b""), "audio/webm")}
    response = client.post("/api/v1/audio/transcribe", files=files)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()

def test_audio_transcribe_valid_file():
    """Verify audio upload processes through VibeVoice bridge."""
    fake_audio_bytes = b"RIFF....WAVEfmt ....data...."
    files = {"audio": ("recording_session.webm", io.BytesIO(fake_audio_bytes), "audio/webm")}
    data_form = {"meeting_id": "test-meet-123"}
    response = client.post("/api/v1/audio/transcribe", files=files, data=data_form)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["meeting_id"] == "test-meet-123"
    assert data["detected_speakers_count"] > 0
    assert len(data["segments"]) > 0
    assert "text" in data["segments"][0]
    assert "speaker" in data["segments"][0]

def test_audio_transcribe_mp4_file():
    """Verify mp4 video/audio container from smartphone recordings is accepted and processed."""
    fake_mp4_bytes = b"\x00\x00\x00\x20ftypisom\x00\x00\x02\x00isomiso2mp41"
    files = {"audio": ("rekaman_sidang_hp.mp4", io.BytesIO(fake_mp4_bytes), "video/mp4")}
    data_form = {"meeting_id": "meet-hp-mp4"}
    response = client.post("/api/v1/audio/transcribe", files=files, data=data_form)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["meeting_id"] == "meet-hp-mp4"
    assert len(data["segments"]) > 0

def test_notulen_synthesize_empty_transcript():
    """Verify empty transcript payload returns 400 Bad Request."""
    payload = {
        "meeting_title": "Rapat Tanpa Transkrip",
        "organizer": "MPK SMK Negeri 13 Bandung",
        "transcript": [],
    }
    response = client.post("/api/v1/notulen/synthesize", json=payload)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()

def test_notulen_synthesize_success():
    """Verify 9Router synthesis processes transcript and returns structured minutes."""
    payload = {
        "meeting_id": "meet-test-456",
        "meeting_title": "Sidang Pleno Evaluasi Program Kerja MPK",
        "organizer": "MPK SMK Negeri 13 Bandung",
        "transcript": [
            {
                "id": "seg-1",
                "speaker": "Davin Maritza",
                "start_time": "00:00:00",
                "end_time": "00:00:30",
                "text": "Rapat pleno kita mulai dengan evaluasi program kerja komisi dan persiapan kaderisasi LDKS.",
            },
            {
                "id": "seg-2",
                "speaker": "Sekretaris",
                "start_time": "00:00:35",
                "end_time": "00:01:10",
                "text": "Semua dokumen evaluasi telah terkumpul dan disetujui untuk dipublikasikan.",
            },
        ],
    }
    response = client.post("/api/v1/notulen/synthesize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["meeting_title"] == "Sidang Pleno Evaluasi Program Kerja MPK"
    assert len(data["executive_summary"]) > 0
    assert len(data["agendas"]) > 0
    assert len(data["decisions"]) > 0
    assert len(data["action_items"]) > 0

def test_notulen_export_markdown():
    """Verify export markdown endpoint formats official MPK documentation."""
    payload = {
        "status": "success",
        "meeting_title": "Rapat Evaluasi MPK 13",
        "executive_summary": "Rapat berjalan kuorum dan mengesahkan seluruh program.",
        "agendas": [
            {
                "title": "Evaluasi Tengah Semester",
                "discussion_points": ["Kinerja komisi A baik", "Laporan bendahara berimbang"],
            }
        ],
        "decisions": [
            {
                "id": "dec-1",
                "number": "KEP/001/MPK-13/XI/2026",
                "decision_text": "Pengesahan anggaran LDKS 2026",
                "rationale": "Sesuai RKAS MPK SMK Negeri 13",
                "category": "Keuangan",
                "status": "DISAHKAN",
                "date": "2026-11-07",
            }
        ],
        "action_items": [
            {
                "id": "act-1",
                "description": "Koordinasi dengan Wakasek Kesiswaan",
                "assignee": "Davin Maritza",
                "due_date": "2026-11-15",
                "status": "PENDING",
            }
        ],
    }
    response = client.post("/api/v1/notulen/export-markdown", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "RISALAH RESMI" in data["markdown"]
    assert "SMK NEGERI 13 BANDUNG" in data["markdown"]
    assert "MPK SMK Negeri 13 Bandung" in data["markdown"]
    assert "KEP/001/MPK-13/XI/2026" in data["markdown"]
    assert "Davin Maritza" in data["markdown"]
