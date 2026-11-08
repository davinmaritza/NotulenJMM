# NotulenJMM Frontend

Modul antarmuka pengguna untuk NotulenJMM, dibangun menggunakan Next.js 16 (App Router), React 19, Tailwind CSS, dan Capacitor untuk distribusi native Android.

## Fitur Teknis Antarmuka

- **Desain Neo-Brutalism**: Menggunakan palet kuning khas MPK SMK Negeri 13 Bandung, garis batas tegas 2px/3px, dan bayangan blokir fisik.
- **Client-Side First**: Seluruh perumusan naskah, perhitungan waktu, dan ekspor dokumen berjalan mandiri di peramban tanpa kewajiban server online.
- **Google Identity Services (GIS)**: Autentikasi OAuth 2.0 popup token client terintegrasi dengan Google Drive API untuk pencadangan berkas JSON.
- **Dukungan Multi-Platform**: Kode sumber yang sama dikompilasi ke web statis (`out/`), aplikasi desktop (embed via launcher Go), dan APK Android native (`android/`).

## Perintah Pengembangan

```bash
# Memasang pustaka
bun install

# Menjalankan server pengembangan (port 3000)
bun run dev

# Kompilasi produksi web
bun run build

# Menjalankan pemeriksaan linter
bun run lint

# Sinkronisasi aset statis ke proyek Android
bun run sync:android

# Membangun file APK biner (memerlukan Android SDK dan JDK 21)
bun run build:apk:binary
```

## Variabel Lingkungan (.env.local)

Contoh isian tersedia di `.env.example`:

```env
# URL API backend (opsional)
NEXT_PUBLIC_API_URL="http://localhost:8000"

# Client ID OAuth 2.0 dari Google Cloud Console
NEXT_PUBLIC_GOOGLE_CLIENT_ID="708925391961-nopuatvlfqda6r1u6vpdu5m17vnn2gra.apps.googleusercontent.com"
```
