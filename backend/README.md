# NotulenJMM Backend API

Layanan backend pendukung berbasis FastAPI untuk pemrosesan transkripsi suara persidangan (Microsoft VibeVoice) dan ringkasan otomatis (9Router LLM Gateway).

## Layanan Utama

- `POST /api/v1/audio/transcribe`: Menerima rekaman audio rapat (WAV/MP3/M4A/WebM) dan menghasilkan segmen transkrip beserta pemisahan pembicara (*speaker diarization*).
- `POST /api/v1/notulen/synthesize`: Menyusun ringkasan eksekutif, agenda pembahasan, dan draf ketetapan sidang dari transkrip yang diberikan.
- `GET /api/v1/health`: Pengecekan status layanan dan ketersediaan gateway AI.

## Menjalankan Layanan

```bash
# Membuat virtual environment
python3 -m venv venv
source venv/bin/activate

# Memasang dependensi
pip install -r requirements.txt

# Menjalankan server pengembangan (port 8000)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Menjalankan rangkaian uji otomatis
pytest tests/ -v
```

## Variabel Lingkungan (.env)

Contoh isian tersedia di `.env.example`:

```env
PROJECT_NAME="NotulenJMM Backend API"
VERSION="0.3.0"
API_V1_STR="/api/v1"

# 9Router AI Gateway
LLM_BASE_URL="https://routernines.bytenodes.icu/v1"
LLM_API_KEY="your-api-key"
LLM_MODEL="ag/gemini-3.8-flash"

# Microsoft VibeVoice Endpoint
VIBEVOICE_ENDPOINT="http://localhost:8001/asr"
```
