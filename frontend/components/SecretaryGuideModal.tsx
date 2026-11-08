'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Mic,
  Share2,
  FileSpreadsheet,
  FileText,
  Save,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface SecretaryGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const SecretaryGuideModal: React.FC<SecretaryGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [activeSection, setActiveSection] = useState<'recording' | 'standards' | 'export' | 'drafts'>('recording');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0e0f14] border border-white/10 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#12141c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white tracking-tight">Panduan Praktis Notulis MPK</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  SMKN 13 BDG
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                Tata cara merekam rapat, menyusun draf risalah, dan membagikan notulensi resmi.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
            title="Tutup Panduan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Pills */}
        <div className="p-4 border-b border-white/[0.06] bg-[#090a0f] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSection('recording')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
              activeSection === 'recording'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>1. Rekam Voice Note</span>
          </button>

          <button
            onClick={() => setActiveSection('standards')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
              activeSection === 'standards'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Standar Format</span>
          </button>

          <button
            onClick={() => setActiveSection('drafts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
              activeSection === 'drafts'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>3. Draf Online</span>
          </button>

          <button
            onClick={() => setActiveSection('export')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
              activeSection === 'export'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>4. Ekspor &amp; WA</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-zinc-300 font-sans leading-relaxed">
          {/* SECTION 1: REKAM AUDIO */}
          {activeSection === 'recording' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20">
                <Lightbulb className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-rose-200">Tips Perekaman Suara Jernih di Ruang Sidang</h3>
                  <p className="text-xs text-rose-200/80">
                    Letakkan laptop atau ponsel di tengah meja sidang agar suara pimpinan sidang dan seluruh peserta komisi dapat tertangkap mikrofon secara merata.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Langkah Perekaman:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-zinc-300">
                  <li>
                    Buka tab <strong>Studio Voice Note</strong> pada bilah menu di sebelah kiri.
                  </li>
                  <li>
                    Ketik judul rapat atau klik <em>Gunakan Tanggal Hari Ini</em> untuk penamaan otomatis.
                  </li>
                  <li>
                    Tekan tombol <strong>Mulai Merekam Suara</strong> berwarna merah.
                  </li>
                  <li>
                    Gunakan tombol <strong>Jeda (Pause)</strong> apabila forum sedang diskors, istirahat, atau ada penundaan sidang.
                  </li>
                  <li>
                    Setelah sidang selesai, tekan <strong>Selesai Merekam</strong>. Kamu dapat memutar ulang rekaman untuk memastikan suara terdengar jelas.
                  </li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-[#141620] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Ingin langsung mencoba merekam?</p>
                  <p className="text-[11px] text-zinc-400">Buka Studio Perekaman Suara sekarang.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateTab) onNavigateTab('record');
                  }}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Buka Studio Rekam</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: STANDAR FORMAT */}
          {activeSection === 'standards' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-300">
                NotulenJMM menyediakan 4 format naskah dinas resmi sesuai ketentuan Majelis Perwakilan Kelas SMK Negeri 13 Bandung:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#141620] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <h5 className="text-xs font-semibold text-white">1. Tata Naskah Dinas MPK 13</h5>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Standar utama persidangan pleno resmi, penetapan AD/ART, dan penerbitan Surat Keputusan (SK) bernomor resmi.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141620] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <h5 className="text-xs font-semibold text-white">2. Risalah Padat &amp; Ketetapan Inti</h5>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Untuk briefing mingguan cepat, koordinasi internal antar-pengurus harian, dan ringkasan eksekutif 2 paragraf.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141620] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <h5 className="text-xs font-semibold text-white">3. Rapat Kerja &amp; Anggaran Kas</h5>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Fokus pada pencatatan alokasi dana, rancangan anggaran biaya (RAB), verifikasi bendahara, dan pengeluaran kas.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141620] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <h5 className="text-xs font-semibold text-white">4. Evaluasi Program Kerja &amp; LPJ</h5>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Untuk sidang pertanggungjawaban kegiatan pasca-acara, analisis kendala teknis, dan catatan rekomendasi perbaikan.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-950/20 border border-sky-500/20 text-xs text-sky-200">
                Kamu bisa berganti format kapan saja di halaman risalah dengan menekan tombol <strong>Modifikasi Format</strong>.
              </div>
            </div>
          )}

          {/* SECTION 3: DRAF ONLINE */}
          {activeSection === 'drafts' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20">
                <Save className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-amber-200">Draf Aman dan Tidak Akan Hilang</h3>
                  <p className="text-xs text-amber-200/80">
                    Setiap kali kamu menekan <strong>Simpan Sebagai Draf Online</strong>, seluruh catatan dan audio tersimpan di penyimpanan lokal browser dengan penanda waktu resmi (WIB).
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Kelebihan Fitur Draf:</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Tahan Refresh / Tutup Tab:</strong> Saat browser dibuka kembali, draf tetap muncul di tab Arsip Sidang dengan badge kuning <code>DRAF ONLINE</code>.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Bisa Dilanjutkan Kapan Saja:</strong> Cukup klik <em>Lanjutkan Draf</em> untuk menyambung catatan atau merekam audio tambahan.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Bisa Langsung Diekspor:</strong> Dokumen berstatus draf tetap bisa langsung diunduh ke Word, Excel, maupun dibagikan ke WhatsApp.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: EKSPOR & WHATSAPP */}
          {activeSection === 'export' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-300">
                NotulenJMM dirancang agar hasil rapat dapat disebarkan ke forum dalam hitungan detik tanpa perlu pengetikan ulang:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3">
                  <Share2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-semibold text-emerald-200">1-Klik Kirim ke WhatsApp</h5>
                    <p className="text-xs text-emerald-200/80">
                      Klik tombol <strong>WhatsApp</strong> di risalah untuk langsung membuka WhatsApp Web atau aplikasi ponsel dengan format teks pesan rapi (agenda, ringkasan, pasal ketetapan, dan PIC tugas).
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141620] border border-white/[0.06] flex items-start gap-3">
                  <FileText className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-semibold text-white">Unduh Dokumen Word (.doc) &amp; PDF</h5>
                    <p className="text-xs text-zinc-400">
                      Format dokumen resmi lengkap dengan Kop Surat MPK SMK Negeri 13 Bandung, kolom tanda tangan ketua &amp; notulis, dan siap dicetak atau diarsipkan.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141620] border border-white/[0.06] flex items-start gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-semibold text-white">Tabel Matriks Keputusan Excel (.xls)</h5>
                    <p className="text-xs text-zinc-400">
                      Rekap tabel spreadsheet untuk memantau status pengerjaan tugas komisi, batas waktu, dan penanggung jawab (PIC).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#12141c] flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 font-mono">
            Bantuan Praktis Notulis • NotulenJMM 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-zinc-950 font-semibold rounded-xl text-xs hover:bg-zinc-200 active:scale-[0.985] transition-all cursor-pointer"
          >
            Mengerti, Lanjutkan Kerja
          </button>
        </div>
      </div>
    </div>
  );
};
