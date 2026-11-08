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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border-[3px] border-black rounded-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] shadow-[8px_8px_0px_0px_#000]">
        {/* Header */}
        <div className="p-6 border-b-2 border-black/10 flex items-center justify-between bg-[#FFFDF5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C4B5FD] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000]">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-black tracking-tight">Panduan Praktis Notulis MPK</h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#FFD93D] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                  SMKN 13 BDG
                </span>
              </div>
              <p className="text-xs text-zinc-700 font-medium font-sans">
                Tata cara merekam rapat, menyusun draf risalah, dan membagikan notulensi resmi.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-black hover:bg-yellow-100 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer"
            title="Tutup Panduan"
            aria-label="Tutup Panduan Notulis"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Navigation Pills */}
        <div className="p-3 border-b-2 border-black/10 bg-[#FFFDF5] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSection('recording')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
              activeSection === 'recording'
                ? 'bg-[#FF6B6B] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-zinc-700 hover:text-black border-2 border-black/60 hover:border-black shadow-[1px_1px_0px_0px_#000]'
            }`}
          >
            <Mic className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>1. Rekam Voice Note</span>
          </button>

          <button
            onClick={() => setActiveSection('standards')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
              activeSection === 'standards'
                ? 'bg-[#38BDF8] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-zinc-700 hover:text-black border-2 border-black/60 hover:border-black shadow-[1px_1px_0px_0px_#000]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>2. Standar Format</span>
          </button>

          <button
            onClick={() => setActiveSection('drafts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
              activeSection === 'drafts'
                ? 'bg-[#FFD93D] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-zinc-700 hover:text-black border-2 border-black/60 hover:border-black shadow-[1px_1px_0px_0px_#000]'
            }`}
          >
            <Save className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>3. Draf Online</span>
          </button>

          <button
            onClick={() => setActiveSection('export')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
              activeSection === 'export'
                ? 'bg-[#4ECDC4] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-zinc-700 hover:text-black border-2 border-black/60 hover:border-black shadow-[1px_1px_0px_0px_#000]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>4. Ekspor &amp; WA</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-zinc-800 font-sans leading-relaxed">
          {/* SECTION 1: REKAM AUDIO */}
          {activeSection === 'recording' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFE4E6] border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                <Lightbulb className="w-5 h-5 text-rose-600 stroke-[2.5] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-black">Tips Perekaman Suara Jernih di Ruang Sidang</h3>
                  <p className="text-xs text-zinc-800 font-medium">
                    Letakkan laptop atau ponsel di tengah meja sidang agar suara pimpinan sidang dan seluruh peserta komisi dapat tertangkap mikrofon secara merata.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-black">Langkah Perekaman:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-zinc-800 font-medium">
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

              <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-black flex items-center justify-between shadow-[3px_3px_0px_0px_#000]">
                <div>
                  <p className="text-xs font-black text-black">Ingin langsung mencoba merekam?</p>
                  <p className="text-[11px] text-zinc-700 font-medium">Buka Studio Perekaman Suara sekarang.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateTab) onNavigateTab('record');
                  }}
                  className="px-4 py-2 bg-[#FF6B6B] hover:bg-rose-500 text-black border-2 border-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>Buka Studio Rekam</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: STANDAR FORMAT */}
          {activeSection === 'standards' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-800 font-medium">
                NotulenJMM menyediakan 4 format naskah dinas resmi sesuai ketentuan Majelis Perwakilan Kelas SMK Negeri 13 Bandung:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#E0F2FE] border-2 border-black space-y-1.5 shadow-[3px_3px_0px_0px_#000]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 border border-black" />
                    <h5 className="text-xs font-black text-black">1. Tata Naskah Dinas MPK 13</h5>
                  </div>
                  <p className="text-[11px] text-zinc-800 font-medium">
                    Standar utama persidangan pleno resmi, penetapan AD/ART, dan penerbitan Surat Keputusan (SK) bernomor resmi.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#DCFCE7] border-2 border-black space-y-1.5 shadow-[3px_3px_0px_0px_#000]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black" />
                    <h5 className="text-xs font-black text-black">2. Risalah Padat &amp; Ketetapan Inti</h5>
                  </div>
                  <p className="text-[11px] text-zinc-800 font-medium">
                    Untuk briefing mingguan cepat, koordinasi internal antar-pengurus harian, dan ringkasan eksekutif 2 paragraf.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FEF08A] border-2 border-black space-y-1.5 shadow-[3px_3px_0px_0px_#000]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-black" />
                    <h5 className="text-xs font-black text-black">3. Rapat Kerja &amp; Anggaran Kas</h5>
                  </div>
                  <p className="text-[11px] text-zinc-800 font-medium">
                    Fokus pada pencatatan alokasi dana, rancangan anggaran biaya (RAB), verifikasi bendahara, dan pengeluaran kas.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#DDD6FE] border-2 border-black space-y-1.5 shadow-[3px_3px_0px_0px_#000]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 border border-black" />
                    <h5 className="text-xs font-black text-black">4. Evaluasi Program Kerja &amp; LPJ</h5>
                  </div>
                  <p className="text-[11px] text-zinc-800 font-medium">
                    Untuk sidang pertanggungjawaban kegiatan pasca-acara, analisis kendala teknis, dan catatan rekomendasi perbaikan.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFDF5] border-2 border-black text-xs text-black font-medium shadow-[2.5px_2.5px_0px_0px_#000]">
                Kamu bisa berganti format kapan saja di halaman risalah dengan menekan tombol <strong>Modifikasi Format</strong>.
              </div>
            </div>
          )}

          {/* SECTION 3: DRAF ONLINE */}
          {activeSection === 'drafts' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FEF08A] border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                <Save className="w-5 h-5 text-black stroke-[2.5] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-black">Draf Aman dan Tidak Akan Hilang</h3>
                  <p className="text-xs text-zinc-800 font-medium">
                    Setiap kali kamu menekan <strong>Simpan Sebagai Draf Online</strong>, seluruh catatan dan audio tersimpan di penyimpanan lokal browser dengan penanda waktu resmi (WIB).
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-black">Kelebihan Fitur Draf:</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 text-xs text-zinc-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5] shrink-0 mt-0.5" />
                    <span><strong>Tahan Refresh / Tutup Tab:</strong> Saat browser dibuka kembali, draf tetap muncul di tab Arsip Sidang dengan badge kuning <code>DRAF ONLINE</code>.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-zinc-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5] shrink-0 mt-0.5" />
                    <span><strong>Bisa Dilanjutkan Kapan Saja:</strong> Cukup klik <em>Lanjutkan Draf</em> untuk menyambung catatan atau merekam audio tambahan.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-zinc-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5] shrink-0 mt-0.5" />
                    <span><strong>Bisa Langsung Diekspor:</strong> Dokumen berstatus draf tetap bisa langsung diunduh ke Word, Excel, maupun dibagikan ke WhatsApp.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: EKSPOR & WHATSAPP */}
          {activeSection === 'export' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-800 font-medium">
                NotulenJMM dirancang agar hasil rapat dapat disebarkan ke forum dalam hitungan detik tanpa perlu pengetikan ulang:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#DCFCE7] border-2 border-black flex items-start gap-3 shadow-[3px_3px_0px_0px_#000]">
                  <Share2 className="w-5 h-5 text-emerald-700 stroke-[2.5] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-black">1-Klik Kirim ke WhatsApp</h5>
                    <p className="text-xs text-zinc-800 font-medium">
                      Klik tombol <strong>WhatsApp</strong> di risalah untuk langsung membuka WhatsApp Web atau aplikasi ponsel dengan format teks pesan rapi (agenda, ringkasan, pasal ketetapan, dan PIC tugas).
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#E0F2FE] border-2 border-black flex items-start gap-3 shadow-[3px_3px_0px_0px_#000]">
                  <FileText className="w-5 h-5 text-sky-700 stroke-[2.5] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-black">Unduh Dokumen Word (.doc) &amp; PDF</h5>
                    <p className="text-xs text-zinc-800 font-medium">
                      Format dokumen resmi lengkap dengan Kop Surat MPK SMK Negeri 13 Bandung, kolom tanda tangan ketua &amp; notulis, dan siap dicetak atau diarsipkan.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FEF08A] border-2 border-black flex items-start gap-3 shadow-[3px_3px_0px_0px_#000]">
                  <FileSpreadsheet className="w-5 h-5 text-black stroke-[2.5] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-black">Tabel Matriks Keputusan Excel (.xls)</h5>
                    <p className="text-xs text-zinc-800 font-medium">
                      Rekap tabel spreadsheet untuk memantau status pengerjaan tugas komisi, batas waktu, dan penanggung jawab (PIC).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-black/10 bg-[#FFFDF5] flex items-center justify-between">
          <span className="text-[11px] text-zinc-700 font-bold">
            Bantuan Praktis Notulis • NotulenJMM 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#FFE600] hover:bg-[#ffd93d] text-black font-black rounded-xl text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Mengerti, Lanjutkan Kerja
          </button>
        </div>
      </div>
    </div>
  );
};
