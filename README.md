# NotulenJMM

Aplikasi tata naskah dinas, risalah musyawarah, dan dokumentasi sidang untuk Majelis Perwakilan Kelas (MPK) SMK Negeri 13 Bandung.

[![Release](https://img.shields.io/badge/Release-v0.9.1-yellow?style=flat-square&logo=github)](https://github.com/davinmaritza/NotulenJMM/releases/tag/v0.9.1)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Build](https://img.shields.io/badge/Build-Turbopack%2011%2F11-emerald?style=flat-square)](https://nextjs.org/)
[![Production](https://img.shields.io/badge/Production-notulen--jmm.vercel.app-sky?style=flat-square)](https://notulen-jmm.vercel.app)
[![Domain](https://img.shields.io/badge/Domain-jmm.davinn.net-orange?style=flat-square)](https://jmm.davinn.net)
[![Figma](https://img.shields.io/badge/Design%20System-Figma%20Canvas-f24e1e?style=flat-square&logo=figma)](https://www.figma.com/design/L0S8EZChNZ9ibopivFvt49)
[![Platforms](https://img.shields.io/badge/Platforms-Android%20%7C%20Windows%20%7C%20Linux%20%7C%20Web-purple?style=flat-square)](#unduhan-aplikasi-dan-akses-web)

Pencatatan rapat organisasi siswa sering menghadapi masalah teknis sederhana: rekaman audio menumpuk tanpa risalah, format surat dinas harus diketik ulang dari awal, dan tindak lanjut penugasan sering hilang di obrolan grup.

NotulenJMM merapikan alur kerja tersebut ke dalam satu antarmuka: susun agenda sidang, rekam suara rapat dengan transkripsi suara nyata, catat nomor keputusan resmi, kelola tata kerja 3 komisi majelis berpedoman pada AD/ART MPK Nawadasha Bhakti Amita Paramartha (NBAP), lalu ekspor naskah ke dokumen cetak, Word, Google Docs, atau bagikan langsung ke WhatsApp.

---

## Unduhan Aplikasi dan Akses Web

| Platform | Format Berkas | Keterangan | Tautan Akses / Unduh |
| :--- | :--- | :--- | :--- |
| **Web Produksi** | Peramban Cloud | Akses langsung tanpa instalasi di domain produksi Vercel. | [Buka notulen-jmm.vercel.app](https://notulen-jmm.vercel.app) |
| **Domain Kustom** | Peramban Cloud | Akses resmi via Cloudflare DNS dengan Google OAuth produksi. | [Buka jmm.davinn.net](https://jmm.davinn.net) |
| **Android** | Berkas APK (5.2 MB) | Paket instalasi untuk HP atau tablet Android 8.0 ke atas. | [Unduh APK v0.9.1](https://github.com/davinmaritza/NotulenJMM/releases/download/v0.9.1/NotulenJMM-v0.9.1-Android.apk) |
| **Windows** | Eksekusi Standalone (7.0 MB) | Program portabel untuk Windows 10 dan 11 (64-bit). Cukup klik dua kali untuk membuka. | [Unduh EXE v0.9.1](https://github.com/davinmaritza/NotulenJMM/releases/download/v0.9.1/NotulenJMM-v0.9.1-Windows-x64.exe) |
| **Linux** | Biner Portabel (6.8 MB) | Biner mandiri untuk Linux x86_64 (Linux Mint, Ubuntu, Debian). | [Unduh Biner Linux v0.9.1](https://github.com/davinmaritza/NotulenJMM/releases/download/v0.9.1/NotulenJMM-v0.9.1-Linux-x64) |
| **Figma Canvas** | Desain UI Resmi | Spesifikasi antarmuka, aset logo, dan sistem desain Neo-Brutalism. | [Buka Figma NotulenJMM](https://www.figma.com/design/L0S8EZChNZ9ibopivFvt49) |
| **Web Lokal** | Port 3000 | Server pengujian lokal di laptop pengembang. | `http://localhost:3000` |

Daftar checksum SHA-256 untuk seluruh berkas biner tercantum pada [halaman rilis GitHub v0.9.1](https://github.com/davinmaritza/NotulenJMM/releases/tag/v0.9.1).

---

## Fitur Utama

### 1. Panel Administrator & Tata Kelola Majelis (`/admin`)
- **Presidium Sidang Utama**: Struktur kepemimpinan MPK Nawadasha Bhakti Amita Paramartha (NBAP) Periode 2025/2026:
  - Ketua MPK: **Shafa Na’ila Hasna** (NIS. 102419165)
  - Sekretaris I / Notulis MPK: **Praya Nuri Fairuuz** (NIS. 102419230)
  - Pembina Kesiswaan MPK: **Tessa Eka Yuniar, S.Pd.**
  - Kepala Sekolah / Penanggung Jawab: **Agus Nugroho, S.Pd., M.T.**
  - Pengembang Sistem & JMM: **Davin Maritza** (Jalur Menyurat MPK)
- **Tata Kelola 3 Komisi Kerja (Sesuai AD/ART)**:
  - **Komisi A (Pengawasan OSIS & Kebijakan)**: Koordinator: Zafana Alaiqa Zachwan & Danis Ferdiansyah (16 anggota). Menyelenggarakan Sidang Pleno I/II/III, Sidang GBHK, penerbitan Surat Peringatan (SP), evaluasi pra/pasca acara, dan pengelolaan arsip Jalur Menyurat MPK (JMM).
  - **Komisi B (Tata Kelola Ekstrakurikuler & Lapangan)**: Koordinator: Muhammad Imam Mulhakim & Adinda Syarifa Setiawan (13 anggota). Menyelenggarakan Rapat Delegasi Ekskul, sinkronisasi matriks jadwal lapangan (Planner), monitoring presensi triwulan (Informator), dan fasilitas ekskul.
  - **Komisi C (Aspirasi Siswa, Survei LSM & Media Publikasi)**: Koordinator: Restu Noor Aditia Rae & Nuri Anastasya Oktaviana (18 anggota). Penjaringan aspirasi via Program AKSARA, survei per kelas oleh LSM (Lembaga Survey MPK), analisis aspirasi ke OSIS via JMM, dan publikasi media kreatif (Desainer & CapTeam).
- **Proteksi Akses Khusus Superadmin**: Akses ke `/admin` dikunci secara eksklusif untuk `alfarrezald@gmail.com`. Pengguna lain dicegah baik di menu navigasi sidebar maupun di tingkat rute guard Next.js.
- **Buku Induk Registri Ketetapan TAP & KEP**: Tabel terpusat seluruh nomor surat keputusan dinas, amar putusan, rasional pertimbangan hukum, filter kategori, dan pencarian instan.
- **Audit Trail & Notary Logs**: Pelacakan riwayat aktivitas pencatatan, perubahan data, dan sinkronisasi cloud secara transparan.
- **Diagnostik Sistem & Master Backup**: Pengecekan status FastAPI backend, mesin STT, kuota penyimpanan, serta fitur unduh/unggah master backup JSON mandiri.

### 2. Studio Agenda dan Format Musyawarah
- Pilihan format rapat standar dinas: Sidang Pleno AD/ART, Koordinasi Pembina, Sidang Komisi, dan Forum Aspirasi Siswa.
- Dukungan kustomisasi kartu agenda: pengurus dapat menambah agenda baru, menyunting rincian bahasan, atau menghapus kartu yang tidak digunakan.
- Preset susunan acara siap pakai untuk MPK 13 dan Panitia MPLS.
- Pilihan standar tata naskah dinas resmi sekolah.

### 3. Perekaman Suara Sidang & Real Speech Recognition (STT)
- **Web Speech API**: Transkripsi langsung berbasis peramban secara *real-time* dengan kotak interaktif `[UCAPAN TERDETEKSI]`.
- **Backend STT Engine**: Pemrosesan audio di backend menggunakan `ffmpeg` (transcode ke 16kHz mono WAV) dan Google Speech Recognition (`id-ID` & `en-US`).
- **Truthful Dynamic AI Synthesis**: Seluruh teks tiruan lama (mock LDKS) telah dibersihkan 100%. Peringkasan Gemini 3.8 Flash diinstruksikan hanya memproses kata-kata yang benar-benar diucapkan saat sidang.
- Perekam audio berbasis browser dengan visualisasi gelombang suara (*waveform*).
- Tombol jeda untuk penundaan sementara (*skorsing sidang*) tanpa memutus sesi rekaman.

### 4. Perumusan Risalah dan Keputusan
- Input terstruktur nomor surat keputusan dinas (contoh: `KEP/001/MPK-13/XI/2026`).
- Kolom pertimbangan hukum atau rasional penetapan keputusan sidang.
- Matriks tanggung jawab PIC (*Person in Charge*) lengkap dengan deskripsi tugas dan tenggat waktu pelaksanaan.

### 5. Format Ekspor Berkas Lengkap
- Microsoft Word (.doc) dengan kop surat resmi MPK SMK Negeri 13 Bandung dan tata letak tabel dinas.
- Microsoft Excel (.xls) untuk tabulasi rekapitulasi keputusan sidang dan pemantauan tugas pengurus.
- Google Docs dengan konversi HTML dinas langsung ke tab peramban baru.
- Cetak / PDF resmi yang disesuaikan untuk kertas ukuran A4 atau F4.
- Teks ringkasan siap kirim untuk grup obrolan WhatsApp pengurus dan pembina.
- Berkas Markdown dan teks polos untuk pengarsipan cepat.

### 6. Privacy-First Google Auth & Cadangan Cloud
- **Gerbang Masuk Bersih**: Tampilan login disederhanakan menjadi 1-Klik Google OAuth 2.0 dan Mode Tamu/Offline tanpa form input yang membingungkan.
- **Cadangan Google Drive**: Menghubungkan akun Google menggunakan Google Identity Services (GIS).
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
   - `https://notulen-jmm.vercel.app` (domain produksi Vercel)
   - `https://jmm.davinn.net` (domain kustom Cloudflare)
5. Kosongkan bagian **Authorized redirect URIs** karena aplikasi menggunakan alur popup client-side token.
6. Simpan string Client ID ke dalam berkas `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID="708925391961-nopuatvlfqda6r1u6vpdu5m17vnn2gra.apps.googleusercontent.com"
   ```
7. Pastikan **Google Drive API** telah diaktifkan (*Enable*) di library Google Cloud Console.

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
• Panel Admin & Tata Kelola Komisi   • Cadangan otomatis background
• Ekspor Word, PDF, Excel            • Vercel Edge Cloud Deployment
       │
       ▼ (Opsional untuk pemrosesan AI suara & peringkasan)
[Backend FastAPI (:8000)]
• Real Speech-to-Text (ffmpeg 16kHz WAV + Google STT)
• Gemini 3.8 Flash / 9Router LLM Gateway (Truthful Synthesis)
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
GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o ../dist/NotulenJMM-v0.9.1-Windows-x64.exe

# Kompilasi biner Linux x64
GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o ../dist/NotulenJMM-v0.9.1-Linux-x64
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
├── desktop/               # Desktop launcher Go (menanam aset web statis via //go:embed)
│   ├── main.go            # Entry point biner launcher & pembuka peramban
│   └── go.mod             # Definisi modul Go
├── dist/                  # Berkas rilis siap pakai (APK, EXE, Linux, SHA-256)
├── frontend/              # Next.js 16 (React 19) + Tailwind CSS + Capacitor
│   ├── android/           # Proyek native Android Studio & Gradle
│   ├── app/               # Rute halaman Next.js App Router (/, /admin, /arsip, /notulen, /record, /tasks)
│   ├── components/        # Komponen antarmuka (GoogleAuthGate, Sidebar, NotulenEditor, AudioRecorderStudio)
│   ├── context/           # MeetingContext (State rapat, sinkronisasi, dan sesi notulis)
│   └── lib/               # Klien backup Google Drive, parser tanggal, utilitas ekspor, API client
├── backend/               # Layanan pendukung FastAPI
│   ├── app/               # Endpoint API v1, konfigurasi CORS, dan adapter audio STT
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
