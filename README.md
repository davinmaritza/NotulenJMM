# NotulenJMM

Tata naskah dinas, risalah sidang, dan transkripsi rapat untuk Majelis Perwakilan Kelas (MPK) SMK Negeri 13 Bandung.

[![Release](https://img.shields.io/badge/Release-v0.8.0-yellow?style=flat-square&logo=github)](https://github.com/davinmaritza/NotulenJMM/releases/tag/v0.8.0)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Build](https://img.shields.io/badge/Build-Turbopack%2010%2F10-emerald?style=flat-square)](https://nextjs.org/)
[![Security Audit](https://img.shields.io/badge/Security-25%20Invariants%20Pass-green?style=flat-square)](https://owasp.org/)
[![Platforms](https://img.shields.io/badge/Platforms-Android%20%7C%20Windows%20%7C%20Linux%20%7C%20Web-purple?style=flat-square)](#unduhan-aplikasi-v080)

Pencatatan rapat organisasi siswa sering kali memakan waktu: rekaman suara menumpuk tanpa transkrip, format surat dinas harus diketik ulang dari awal, dan tindak lanjut penugasan (PIC) tercecer di obrolan grup.

NotulenJMM menyatukan alur kerja persidangan ke dalam satu aplikasi: susun agenda, rekam dan pilah suara pembicara, tetapkan keputusan resmi, lalu ekspor hasilnya ke Google Docs atau bagikan ke WhatsApp dalam hitungan detik.

---

## Unduhan Aplikasi (v0.8.0)

Semua paket biner di bawah ini siap pakai tanpa instalasi pustaka tambahan:

| Platform | Berkas | Ukuran | Deskripsi | Tautan Unduh |
| :--- | :--- | :---: | :--- | :---: |
| **Android** | `.apk` | 5.2 MB | Aplikasi native untuk HP atau tablet Android (Android 8.0 ke atas). | [Download APK](https://github.com/davinmaritza/NotulenJMM/releases/download/v0.8.0/NotulenJMM-v0.8.0-Android.apk) |
| **Windows** | `.exe` | 6.9 MB | Aplikasi mandiri untuk Windows 10 dan 11 (64-bit). Cukup klik dua kali untuk membuka. | [Download EXE](https://github.com/davinmaritza/NotulenJMM/releases/download/v0.8.0/NotulenJMM-v0.8.0-Windows-x64.exe) |
| **Linux** | Binary | 6.8 MB | Biner portabel untuk Linux x86_64 (Linux Mint, Ubuntu, Debian, Fedora). | [Download Linux](https://github.com/davinmaritza/NotulenJMM/releases/download/v0.8.0/NotulenJMM-v0.8.0-Linux-x64) |
| **Web** | Browser | - | Akses lokal melalui peramban di `http://localhost:3000`. | [Buka Web](http://localhost:3000) |

Verifikasi checksum integritas berkas tersedia di [catatan rilis GitHub v0.8.0](https://github.com/davinmaritza/NotulenJMM/releases/tag/v0.8.0).

---

## Kemampuan Utama

### Login Google sekali, sesi tersimpan permanen
Aplikasi meminta login Google di awal untuk menghubungkan penyimpanan cloud. Data sesi (`email`, token akses) disimpan di LocalStorage peramban, jadi Anda tidak perlu login berulang kali setiap membuka aplikasi. Jika tidak ada koneksi internet, Anda tetap bisa memilih **Mode Tamu** untuk bekerja secara offline.

### Auto-backup ke Google Drive tanpa tombol manual
Setiap kali Anda selesai mengetik perubahan naskah, menambah keputusan, atau memperbarui PIC, aplikasi menunggu 4 detik lalu otomatis mencadangkan berkas ke Google Drive di latar belakang. Pengecekan berkala juga berjalan otomatis setiap 5 menit.

Izin akun dibatasi hanya pada cakupan `https://www.googleapis.com/auth/drive.file`. Artinya, aplikasi hanya dapat membaca dan menulis berkas cadangannya sendiri (`NotulenJMM_Cloud_Backup.json`), tanpa izin mengakses berkas pribadi Anda yang lain di Google Drive.

### Ekspor satu klik ke Google Docs
Tombol **Google Docs** pada bilah ekspor langsung mengonversi naskah risalah lengkap ke format Google Docs asli. Naskah memuat Kop Surat Resmi MPK SMK Negeri 13 Bandung, rincian pimpinan sidang, ringkasan eksekutif, tabel keputusan beserta pertimbangannya, tabel tugas PIC, dan kolom tanda tangan. Dokumen otomatis terbuka di tab baru peramban untuk ditinjau atau dibagikan ke pihak sekolah.

### Pilihan format ekspor dokumen
Selain Google Docs, dokumen dapat diekspor langsung ke berbagai format:
- **Microsoft Word (.doc)**: Dokumen formal dengan tata letak kop surat dan tabel dinas.
- **Microsoft Excel (.xls)**: Rekapitulasi keputusan dan matriks tanggung jawab PIC.
- **Cetak / PDF**: Format cetak naskah dinas rapi.
- **WhatsApp**: Pesan teks siap kirim yang otomatis terisi ke aplikasi atau WhatsApp Web.
- **Plain Text (.txt) dan Markdown**: Salinan teks terstruktur untuk pengarsipan cepat.

### Berjalan mandiri di sisi klien
Seluruh fitur penulisan notulen, studio agenda, studio rekam audio, ekspor dokumen, dan pencadangan berjalan penuh di browser pengguna (*client-side*). Backend FastAPI opsional dan hanya diperlukan jika Anda ingin memproses pemisahan pembicara otomatis via Microsoft VibeVoice atau peringkasan transkrip via 9Router AI.

---

## Arsitektur Sistem

```
[Android APK / Windows EXE / Linux Desktop / Web Browser]
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
[Penyimpanan Lokal Client]           [Integrasi Cloud Google]
• LocalStorage (Offline-first)       • Google Drive Auto-Sync (drive.file)
• Sesi login permanen                • Ekspor dokumen native Google Docs
• Pemulihan file JSON                • Token refresh hening di latar belakang
       │
       ▼ (Opsional saat butuh AI audio)
[Backend FastAPI (:8000)]
• Microsoft VibeVoice (ASR & Speaker Diarization)
• 9Router LLM Gateway (Sintesis ringkasan dan keputusan)
```

---

## Keamanan dan Kualitas Kode

Kode sumber telah diaudit terhadap 25 pola kerentanan aplikasi web:
- **XSS**: Semua data teks dinamis yang masuk ke template ekspor (HTML, Word, Excel, Google Docs) melewati fungsi sanitasi entitas sebelum dirender.
- **Injeksi Perintah**: Tidak menggunakan `eval()`, `exec()`, atau pemanggilan shell tak aman.
- **Deserialisasi**: Tidak menggunakan `pickle` pada alur input data pengguna. Impor berkas cadangan divalidasi skemanya sebelum diterapkan ke state.
- **Ukuran Berkas**: Backend membatasi unggahan audio maksimal 150 MB untuk mencegah kehabisan memori.
- **Pengujian**:
  - Backend API: 7 tes lulus (`pytest -v`).
  - Frontend: 0 error dan 0 warning (`bun run lint`).
  - Build: 10 dari 10 rute statis sukses terkompilasi (`next build`).

---

## Menjalankan dari Kode Sumber

### 1. Menjalankan Desktop Launcher (Go)
```bash
cd desktop
go run main.go

# Mengompilasi biner executable Windows dan Linux
GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o ../dist/NotulenJMM-v0.8.0-Windows-x64.exe
GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o ../dist/NotulenJMM-v0.8.0-Linux-x64
```

### 2. Menjalankan Frontend (Next.js)
```bash
cd frontend
bun install

# Jalankan server pengembangan (port 3000)
bun run dev

# Kompilasi produksi web
bun run build

# Kompilasi paket Android APK
export JAVA_HOME=/path/to/jdk-21
bun run build:apk:binary
```

### 3. Menjalankan Backend (Python FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Jalankan server API (port 8000)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Jalankan rangkaian tes
pytest tests/ -v
```

### 4. Menjalankan via Docker Compose
```bash
docker compose up -d --build
```

---

## Struktur Proyek

```
NotulenJMM/
├── desktop/               # Desktop launcher Go (embed aset frontend statis)
│   ├── main.go            # Entry point biner desktop & pembuka peramban otomatis
│   └── go.mod             # Definisi modul Go
├── dist/                  # Berkas biner rilis resmi (APK, EXE, Linux)
├── frontend/              # Next.js 16 (React 19) + Tailwind CSS + Capacitor
│   ├── android/           # Konfigurasi native Android (Gradle)
│   ├── app/               # Rute halaman Next.js App Router
│   ├── components/        # Komponen UI: GoogleAuthGate, Sidebar, NotulenEditor, dll.
│   ├── context/           # MeetingContext: Auto-sync engine dan pengelola sesi
│   └── lib/               # Klien backup Google Drive, tipe data, dan helper ekspor
├── backend/               # Layanan AI FastAPI
│   ├── app/               # Rute API v1, konfigurasi, dan service bridge
│   ├── tests/             # Rangkaian pengujian integrasi pytest
│   └── requirements.txt   # Dependensi Python
├── docker-compose.yml     # Konfigurasi orkestrasi kontainer
├── LICENSE                # Lisensi MIT
└── README.md              # Dokumentasi teknis proyek
```

---

## Lisensi dan Pengembang

- **Pengembang**: [Davin Maritza](https://github.com/davinmaritza)
- **Organisasi**: Majelis Perwakilan Kelas (MPK) SMK Negeri 13 Bandung
- **Lisensi**: [MIT License](LICENSE) (c) 2026 Davin Maritza & MPK SMK Negeri 13 Bandung.
