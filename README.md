# NotulenJMM • MPK SMK Negeri 13 Bandung

[![Release](https://img.shields.io/badge/Release-v0.8.0-yellow?style=for-the-badge&logo=github)](https://github.com/davinmaritza/NotulenJMM/releases/tag/v0.8.0)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Build: Turbopack](https://img.shields.io/badge/Build-Turbopack%2010%2F10-emerald?style=for-the-badge)](https://nextjs.org/)
[![Security: OWASP & STRIDE](https://img.shields.io/badge/Security-25%20Invariants%20Pass-green?style=for-the-badge)](https://owasp.org/)
[![Platform](https://img.shields.io/badge/Platforms-Web%20%7C%20Android%20APK%20%7C%20Windows%20EXE-purple?style=for-the-badge)](#unduhan-rilis-resmi-v080)

> **Sistem Manajemen Risalah Sidang, Transkripsi Audio Cerdas, Tata Naskah Dinas Digital, dan Pencadangan Cloud Mandiri.**  
> Dikembangkan secara khusus untuk **Majelis Perwakilan Kelas (MPK) SMK Negeri 13 Bandung** oleh **Davin Maritza**.

---

## 📌 Ringkasan Eksekutif & Fitur Unggulan

NotulenJMM adalah platform tata naskah dinas digital modern yang dirancang untuk mendukung seluruh siklus persidangan organisasi kesiswaan — mulai dari penyusunan agenda sidang, perekaman suara interaktif, transkripsi cerdas berbasis AI (*diarization*), penyusunan keputusan formal dan tindak lanjut (PIC), hingga pencadangan otomatis ke cloud Google Drive dan ekspor langsung ke Google Docs resmi.

### 🌟 Fitur Utama v0.8.0:
1. **Gerbang Otentikasi Google & Sesi Permanen ("Tanpa Login Berulang")**:
   - Memastikan akun pengguna terhubung di awal untuk pencadangan cloud otomatis dan ekspor Google Docs.
   - Sesi tersimpan secara persisten pada penyimpanan lokal peramban (`localStorage`). Kunjungan ulang, refresh, atau tab baru langsung membuka ruang kerja tanpa perlu repot login ulang.
   - Dilengkapi fallback **Mode Tamu / Offline** bagi notulis yang bekerja dalam kondisi darurat tanpa koneksi internet.
2. **Pencadangan Otomatis Google Drive (Background Auto-Backup)**:
   - Setiap pembaruan naskah, keputusan sidang, dan penugasan PIC otomatis dicadangkan ke Google Drive dengan sistem *debounce* 4 detik dan interval *heartbeat* 5 menit.
   - Status visual langsung terpantau (*Auto-Backup Aktif*, *Menyinkronkan...*, dan *Cloud Auto-Saved*).
   - Privasi penuh terjamin melalui scope minimal `https://www.googleapis.com/auth/drive.file` (hanya mengakses berkas yang dibuat oleh NotulenJMM).
3. **Ekspor 1-Klik Langsung ke Google Docs Resmi**:
   - Naskah risalah lengkap (Kop Surat Resmi, info presidium & notulis, pokok bahasan agenda, tabel keputusan, tabel tindak lanjut PIC, serta blok tanda tangan pengesahan) dikonversi menjadi berkas Google Docs asli (`application/vnd.google-apps.document`).
   - Dokumen otomatis terbuka di tab baru (`docs.google.com/document/d/...`) untuk kolaborasi *real-time* atau pembagian dokumen ke pihak sekolah/OSIS.
4. **Paket Ekspor Dokumen Lengkap**:
   - 📄 **Google Docs**: Format cloud resmi Google Drive.
   - 📝 **Microsoft Word (.doc)**: Dokumen formal lengkap dengan kop dan tabel keputusan dinas.
   - 📊 **Microsoft Excel (.xls)**: Rekapitulasi tabel ketetapan dan matriks tugas PIC.
   - 🖨️ **Cetak / PDF**: Siap cetak langsung dengan tata letak lembar dinas resmi sekolah.
   - 💬 **Kirim WhatsApp Langsung**: Format teks markdown WhatsApp dengan satu klik.
   - 📄 **Plain Text (.txt) & Markdown**: Teks terstruktur untuk arsip cepat.
5. **Studio Agenda & Mufakat Multi-Engine**:
   - Ruang perencanaan sidang interaktif dengan template agenda dinamis, kartu kustom, dan estimasi waktu sidang.
6. **Studio Perekaman Suara & Diarization**:
   - Visualisasi gelombang audio mikrofon *live*, penanda stempel waktu per segmen, dan segmentasi pembicara otomatis (*Who, When, What*).
7. **Arsip Institusional & Jejak Audit (Audit Trail)**:
   - Penomoran registrasi arsip resmi otomatis (`REG-MPK13/ARSIP/YYYY/MM/SEQ`).
   - Jejak audit komprehensif mencatat setiap aksi `CREATE`, `EDIT`, `ARCHIVE`, `DELETE`, dan `RESTORE`.

---

## 📦 Unduhan Rilis Resmi (v0.8.0)

Aplikasi NotulenJMM tersedia dalam berbagai format biner mandiri siap pakai:

| Platform | Format Berkas | Keterangan | Tautan Unduhan |
| :--- | :---: | :--- | :---: |
| **Android** | `.apk` (5.2 MB) | Paket Native APK untuk smartphone & tablet Android (Android 8.0+) | [Unduh NotulenJMM-v0.8.0-Android.apk](https://github.com/davinmaritza/NotulenJMM/releases/download/v0.8.0/NotulenJMM-v0.8.0-Android.apk) |
| **Windows** | `.exe` (6.9 MB) | Biner mandiri portabel untuk Windows 10 & 11 (64-bit). *Tanpa instalasi run-time!* | [Unduh NotulenJMM-v0.8.0-Windows-x64.exe](https://github.com/davinmaritza/NotulenJMM/releases/download/v0.8.0/NotulenJMM-v0.8.0-Windows-x64.exe) |
| **Linux** | Biner (6.8 MB) | Biner desktop Linux x86_64 mandiri (Linux Mint, Ubuntu, Debian, Fedora) | [Unduh NotulenJMM-v0.8.0-Linux-x64](https://github.com/davinmaritza/NotulenJMM/releases/download/v0.8.0/NotulenJMM-v0.8.0-Linux-x64) |
| **Web Portal** | Browser | Akses langsung melalui peramban web modern | [Buka Aplikasi Web](http://localhost:3000) |

---

## 🏛️ Arsitektur Sistem

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ANTARMUKA PENGGUNA                              │
│   Android APK (Capacitor) • Windows EXE • Linux Desktop • Web Portal   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌───────────────────────┐                         ┌──────────────────────┐
│  PENYIMPANAN LOKAL    │                         │    CLOUD & GOOGLE    │
│  (100% Client-Side)   │                         │     INTEGRATION      │
├───────────────────────┤                         ├──────────────────────┤
│ • LocalStorage Engine │                         │ • Google Drive API   │
│ • Offline JSON Backup │                         │ • Google Docs Native │
│ • Sesi OAuth Permanen │                         │ • Auto-Sync Heartbeat│
└───────────────────────┘                         └──────────────────────┘
           ▲
           │ (Opsional untuk AI On-Device)
           ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES (FastAPI)                        │
├────────────────────────────────────────────────────────────────────────┤
│ • Microsoft VibeVoice Bridge (Long-form ASR & Speaker Diarization)     │
│ • 9Router Centralized LLM Gateway (Sintesis Risalah & Decision Log)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Jaminan Kualitas & Keamanan (QA & Security Audit)

Aplikasi telah melalui proses audit menyeluruh menggunakan pedoman **Application Security Engineer (AppSec)**, **OWASP Top 10**, dan **25 Invarian Keamanan**:

- **Analisis Statis (`scan_patterns.py`)**: `✓ No security violations detected` pada seluruh kode sumber aplikasi.
- **Model Ancaman STRIDE**:
  - *Spoofing*: Terproteksi via Google OAuth 2.0 PKCE.
  - *Tampering*: Validasi skema ketat `parseAndValidateBackup()` pada berkas cadangan.
  - *Repudiation*: Audit Trail `HistoryLog` mencatat stempel waktu ISO pada setiap mutasi data.
  - *Information Disclosure*: Scope Google dibatasi strictly pada `drive.file` (data pribadi pengguna di Drive terisolasi 100%).
  - *Denial of Service*: Batas berkas audio 150MB di backend, debounce auto-sync 4 detik, dan kuota riwayat log 100 entri.
- **Integritas XSS**: Seluruh variabel data dinamis disanitasi ketat menggunakan utilitas entitas HTML `escape()`.
- **Pengujian Otomatis**:
  - Backend API: `7/7 passed` (`pytest -v`).
  - Frontend Linting: `0 errors, 0 warnings` (`bun run lint`).
  - Next.js Turbopack Build: `10/10 static routes` sukses terkompilasi.

---

## 🚀 Panduan Menjalankan dari Kode Sumber

### 1. Menjalankan Desktop Launcher (Go)
```bash
# Menjalankan versi desktop secara langsung
cd desktop
go run main.go

# Mengompilasi biner executable Windows dan Linux
GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o ../dist/NotulenJMM-v0.8.0-Windows-x64.exe
GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o ../dist/NotulenJMM-v0.8.0-Linux-x64
```

### 2. Menjalankan Frontend (Next.js & Capacitor)
```bash
cd frontend
bun install

# Development server (Port 3000)
bun run dev

# Kompilasi Web Production
bun run build

# Kompilasi Native Android APK
export JAVA_HOME=/path/to/jdk-21
bun run build:apk:binary
# Output: frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. Menjalankan Backend API (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Menjalankan server backend (Port 8000)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Menjalankan rangkaian uji otomatis
pytest tests/ -v
```

### 4. Menjalankan dengan Docker Compose
```bash
docker compose up -d --build
```

---

## 📁 Struktur Direktori Repositori

```
NotulenJMM/
├── desktop/                        # Standalone Desktop Launcher (Go embedded server)
│   ├── main.go                     # Desktop binary entrypoint & auto-browser opener
│   └── go.mod                      # Go module definition
├── dist/                           # Biner rilis resmi (APK, Windows EXE, Linux binary)
│   ├── NotulenJMM-v0.8.0-Android.apk
│   ├── NotulenJMM-v0.8.0-Windows-x64.exe
│   └── NotulenJMM-v0.8.0-Linux-x64
├── frontend/                       # Next.js 16 (React 19) + Tailwind CSS + Capacitor
│   ├── android/                    # Proyek Android Native (Gradle & Android SDK)
│   ├── app/                        # Rute aplikasi: /, /arsip, /notulen, /record, /tasks
│   ├── components/                 # Komponen UI: GoogleAuthGate, Sidebar, NotulenEditor, dll.
│   ├── context/                    # MeetingContext: Auto-sync engine & session manager
│   ├── lib/                        # Google Drive backup, tipe TypeScript, API client
│   └── package.json                # Skrip Bun & dependensi frontend
├── backend/                        # FastAPI AI Service
│   ├── app/                        # API v1, konfigurasi, model Pydantic, service bridge
│   ├── tests/                      # Pytest unit & integration test suite
│   └── requirements.txt            # Dependensi Python
├── .claude/                        # Pengetahuan sistem & pedoman agentik
├── docker-compose.yml              # Orkestrasi kontainer Docker
├── LICENSE                         # Lisensi Open-Source MIT
└── README.md                       # Dokumentasi utama proyek
```

---

## 📜 Kepemilikan & Lisensi

- **Pencipta & Pengembang**: [Davin Maritza](https://github.com/davinmaritza)
- **Organisasi Pembina**: **Majelis Perwakilan Kelas (MPK) SMK Negeri 13 Bandung**
- **Lisensi**: [MIT License](file:///home/suzirz/Documents/Project/NotulenJMM/LICENSE) &copy; 2026 Davin Maritza & MPK SMK Negeri 13 Bandung.
