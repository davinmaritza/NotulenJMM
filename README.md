# NotulenJMM

Aplikasi tata naskah dinas, risalah musyawarah, dan dokumentasi sidang untuk Majelis Perwakilan Kelas (MPK) SMK Negeri 13 Bandung.

[![Release](https://img.shields.io/badge/Release-v0.8.0-yellow?style=flat-square&logo=github)](https://github.com/davinmaritza/NotulenJMM/releases/tag/v0.8.0)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Build](https://img.shields.io/badge/Build-Turbopack%2010%2F10-emerald?style=flat-square)](https://nextjs.org/)
[![Production](https://img.shields.io/badge/Production-jmm.davinn.net-sky?style=flat-square)](https://jmm.davinn.net)
[![Platforms](https://img.shields.io/badge/Platforms-Android%20%7C%20Windows%20%7C%20Linux%20%7C%20Web-purple?style=flat-square)](#unduhan-aplikasi-dan-akses-web)

Pencatatan rapat organisasi siswa sering menghadapi masalah teknis sederhana: rekaman audio menumpuk tanpa risalah, format surat dinas harus diketik ulang dari awal, dan tindak lanjut penugasan sering hilang di obrolan grup.

NotulenJMM merapikan alur kerja tersebut ke dalam satu antarmuka: susun agenda sidang, rekam suara rapat, catat nomor keputusan resmi, lalu ekspor naskah ke dokumen cetak, Word, Google Docs, atau bagikan langsung ke WhatsApp.

---

## Unduhan Aplikasi dan Akses Web

| Platform | Format Berkas | Keterangan | Tautan Akses / Unduh |
| :--- | :--- | :--- | :--- |
| Web Resmi | Peramban Cloud | Akses langsung tanpa instalasi di domain produksi. | [Buka jmm.davinn.net](https://jmm.davinn.net) |
| Android | Berkas APK (5.2 MB) | Paket native untuk HP atau tablet Android 8.0 ke atas. | [Unduh APK v0.8.0](https://github.com/davinmaritza/NotulenJMM/releases/download/v0.8.0/NotulenJMM-v0.8.0-Android.apk) |
| Windows | Eksekusi Standalone (6.9 MB) | Program portabel untuk Windows 10 dan 11 (64-bit). Cukup klik dua kali untuk membuka. | [Unduh EXE v0.8.0](https://github.com/davinmaritza/NotulenJMM/releases/download/v0.8.0/NotulenJMM-v0.8.0-Windows-x64.exe) |
| Linux | Biner Portabel (6.8 MB) | Biner mandiri untuk Linux x86_64 (Linux Mint, Ubuntu, Debian). | [Unduh Biner Linux v0.8.0](https://github.com/davinmaritza/NotulenJMM/releases/download/v0.8.0/NotulenJMM-v0.8.0-Linux-x64) |
| Web Lokal | Port 3000 | Server pengujian lokal di laptop pengembang. | `http://localhost:3000` |

Daftar checksum SHA-256 untuk seluruh berkas biner tercantum pada [halaman rilis GitHub v0.8.0](https://github.com/davinmaritza/NotulenJMM/releases/tag/v0.8.0).

---

## Fitur Utama

### 1. Studio Agenda dan Format Musyawarah
- Pilihan format rapat standar dinas: Sidang Pleno AD/ART, Koordinasi Pembina, Sidang Komisi, dan Forum Aspirasi Siswa.
- Dukungan kustomisasi kartu agenda: pengurus dapat menambah agenda baru, menyunting rincian bahasan, atau menghapus kartu yang tidak digunakan.
- Preset susunan acara siap pakai untuk MPK 13 dan Panitia MPLS.
- Pilihan standar tata naskah dinas resmi sekolah.

### 2. Perekaman Suara Sidang
- Perekam audio berbasis browser dengan visualisasi gelombang suara (*waveform*).
- Tombol jeda untuk penundaan sementara (*skorsing sidang*) tanpa memutus sesi rekaman.
- Indikator durasi waktu nyata dan penyimpanan draf audio otomatis.

### 3. Perumusan Risalah dan Keputusan
- Input terstruktur nomor surat keputusan dinas (contoh: `KEP/001/MPK-13/XI/2026`).
- Kolom pertimbangan hukum atau rasional penetapan keputusan sidang.
- Matriks tanggung jawab PIC (*Person in Charge*) lengkap dengan deskripsi tugas dan tenggat waktu pelaksanaan.

### 4. Format Ekspor Berkas
- Microsoft Word (.doc) dengan kop surat resmi MPK SMK Negeri 13 Bandung dan tata letak tabel dinas.
- Microsoft Excel (.xls) untuk tabulasi rekapitulasi keputusan sidang dan pemantauan tugas pengurus.
- Google Docs dengan konversi HTML dinas langsung ke tab peramban baru.
- Cetak / PDF resmi yang disesuaikan untuk kertas ukuran A4 atau F4.
- Teks ringkasan siap kirim untuk grup obrolan WhatsApp pengurus dan pembina.
- Berkas Markdown dan teks polos untuk pengarsipan cepat.

### 5. Otentikasi Fleksibel dan Cadangan Google Drive
- Mode Sesi Lokal: notulis dapat langsung mengetik atau menggunakan nama dan email di browser tanpa perlu login ke akun Google.
- Mode Cadangan Google Drive: menghubungkan akun Google menggunakan Google Identity Services (GIS).
- Cakupan izin dibatasi pada `https://www.googleapis.com/auth/drive.file`. Aplikasi hanya dapat membaca dan menulis berkas cadangan miliknya sendiri (`NotulenJMM_Cloud_Backup.json`), tanpa izin membaca dokumen pribadi lainnya di Google Drive Anda.
- Pencadangan otomatis berjalan setelah notulis selesai menyunting naskah dan diulang setiap lima menit saat aplikasi terbuka.

---

## Konfigurasi Google Cloud Platform

Jika Anda ingin mengaktifkan sinkronisasi Google Drive pada instalasi mandiri, siapkan kredensial di [Google Cloud Console](https://console.cloud.google.com/):

1. Masuk ke **APIs & Services** > **Credentials**.
2. Klik **Create Credentials** lalu pilih **OAuth client ID**.
3. Pilih tipe aplikasi **Web application**.
4. Daftarkan URL pada bagian **Authorized JavaScript origins**:
   - `http://localhost:3000` (untuk pengujian lokal)
   - `https://jmm.davinn.net` (untuk domain produksi)
5. Kosongkan bagian **Authorized redirect URIs** karena aplikasi menggunakan alur popup client-side token.
6. Simpan string Client ID ke dalam berkas `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID="708925391961-nopuatvlfqda6r1u6vpdu5m17vnn2gra.apps.googleusercontent.com"
   ```
7. Tambahkan email penguji di tab **Audience** > **Test users** selama status aplikasi masih dalam tahap pengujian (*Testing*).

---

## Arsitektur Sistem

```
[Android APK / Windows EXE / Linux Desktop / Browser Web]
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
[Penyimpanan Lokal Client]           [Google Identity Services]
• LocalStorage offline-first         • Google Drive API (drive.file)
• Sesi notulis mandiri               • Ekspor Google Docs
• Ekspor Word, PDF, Excel            • Cadangan otomatis background
       │
       ▼ (Opsional jika mengaktifkan pemrosesan AI)
[Backend FastAPI (:8000)]
• Microsoft VibeVoice (ASR dan pemisahan pembicara)
• 9Router LLM Gateway (Peringkasan otomatis)
```

---

## Menjalankan dari Kode Sumber

### Kebutuhan Perangkat Lunak
- Node.js 20+ atau Bun 1.1+
- Go 1.22+ (untuk desktop launcher)
- Python 3.11+ (untuk backend opsional)

### 1. Antarmuka Web (Frontend)
```bash
cd frontend

# Pasang pustaka dependensi
bun install

# Jalankan server pengembangan di http://localhost:3000
bun run dev

# Kompilasi paket produksi web
bun run build

# Bangun paket biner Android APK (membutuhkan JDK 21 dan Android SDK)
export JAVA_HOME=/path/to/jdk-21
bun run build:apk:binary
```

### 2. Desktop Launcher (Go)
```bash
cd desktop

# Jalankan langsung
go run main.go

# Kompilasi biner Windows x64
GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o ../dist/NotulenJMM-v0.8.0-Windows-x64.exe

# Kompilasi biner Linux x64
GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o ../dist/NotulenJMM-v0.8.0-Linux-x64
```

### 3. Layanan Backend (Python FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Jalankan server API di http://localhost:8000
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Jalankan pengujian API
pytest tests/ -v
```

### 4. Menjalankan dengan Docker Compose
```bash
docker compose up -d --build
```

---

## Struktur Direktori

```
NotulenJMM/
├── desktop/               # Desktop launcher Go (menanam aset web statis)
│   ├── main.go            # Entry point biner launcher & pembuka peramban
│   └── go.mod             # Definisi modul Go
├── dist/                  # Berkas rilis siap pakai (APK, EXE, Linux)
├── frontend/              # Next.js 16 (React 19) + Tailwind CSS + Capacitor
│   ├── android/           # Proyek native Android Studio & Gradle
│   ├── app/               # Rute halaman Next.js App Router & 404 handler
│   ├── components/        # Komponen antarmuka (GoogleAuthGate, Sidebar, NotulenEditor)
│   ├── context/           # MeetingContext (State rapat, sinkronisasi, dan sesi notulis)
│   └── lib/               # Klien backup Google Drive, parser tanggal, utilitas ekspor
├── backend/               # Layanan pendukung FastAPI
│   ├── app/               # Endpoint API v1, konfigurasi CORS, dan adapter audio
│   ├── tests/             # Rangkaian uji otomatis pytest
│   └── requirements.txt   # Daftar dependensi Python
├── docker-compose.yml     # Konfigurasi orkestrasi kontainer
├── LICENSE                # Lisensi MIT
└── README.md              # Dokumentasi teknis proyek
```

---

## Lisensi dan Hak Cipta

- **Pengembang**: [Davin Maritza](https://github.com/davinmaritza)
- **Organisasi**: Majelis Perwakilan Kelas (MPK) SMK Negeri 13 Bandung
- **Lisensi**: [MIT License](LICENSE) (c) 2026 Davin Maritza & MPK SMK Negeri 13 Bandung.
