'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  X,
  Sparkles,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useMeetings } from '../context/MeetingContext';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { handleCreateMplsMeeting, isBeginnerMode, setIsBeginnerMode } = useMeetings();
  const [activeTab, setActiveTab] = useState<'workflow' | 'glossary' | 'tips'>('workflow');

  if (!isOpen) return null;

  const handleTryInstantExample = () => {
    handleCreateMplsMeeting();
    onClose();
    router.push('/notulen');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="beginner-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#FFFDF5] border-[3px] border-black rounded-3xl shadow-[8px_8px_0px_0px_#000] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#FFE600] border-b-[2.5px] border-black px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000] shrink-0">
              <GraduationCap className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="beginner-guide-title" className="text-base sm:text-lg font-black text-black tracking-tight">
                  Panduan Cepat Notulis Pemula
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-black text-[#FFE600] text-[10px] font-mono font-black uppercase">
                  3 Menit Paham
                </span>
              </div>
              <p className="text-xs font-bold text-black/80">
                Standar Tata Naskah Dinas MPK SMK Negeri 13 Bandung
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-black/10 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Tutup Panduan"
            aria-label="Tutup Panduan"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b-2 border-black/15 bg-white flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'workflow'
                  ? 'bg-[#FFD93D] text-black border-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-zinc-700 border-transparent hover:border-black/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Alur 3 Langkah</span>
            </button>

            <button
              onClick={() => setActiveTab('glossary')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'glossary'
                  ? 'bg-[#38BDF8] text-black border-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-zinc-700 border-transparent hover:border-black/30'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Kamus Istilah Sidang</span>
            </button>

            <button
              onClick={() => setActiveTab('tips')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tips'
                  ? 'bg-[#4ECDC4] text-black border-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-zinc-700 border-transparent hover:border-black/30'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Tips Notulis Hebat</span>
            </button>
          </div>

          <label className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-zinc-800 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isBeginnerMode}
              onChange={(e) => setIsBeginnerMode(e.target.checked)}
              className="rounded border-black text-amber-500 focus:ring-0 cursor-pointer"
            />
            <span>Mode Pemula Aktif</span>
          </label>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-black">
          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <div className="bg-[#E0F2FE] border-2 border-black rounded-2xl p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_#000]">
                <h4 className="text-xs sm:text-sm font-black text-black flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-700 stroke-[2.5]" />
                  <span>Tidak Perlu Mengetik Tiap Kata! Cukup 3 Langkah Saja:</span>
                </h4>
                <p className="text-xs text-zinc-800 font-medium mt-1 leading-relaxed">
                  Sebagai notulis baru, Anda tidak perlu khawatir ketinggalan mencatat pembicaraan. Sistem cerdas NotulenJMM akan merapikan catatan menjadi format dinas resmi sekolah.
                </p>
              </div>

              {/* Step 1 */}
              <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#38BDF8] border-2 border-black flex items-center justify-center font-black text-sm text-black shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
                  1
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs sm:text-sm font-black text-black">
                      Pilih Format Rapat di Studio Agenda
                    </h5>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 border border-black font-bold">
                      Menu Utama
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                    Pilih kartu format yang sesuai dengan jenis pertemuan Anda, seperti <strong>Sidang Pleno</strong>, <strong>Rapat Kerja (Raker)</strong>, atau <strong>Panitia MPLS</strong>. Anda juga bisa langsung mengetik garis besar pembahasan di kolom bawah.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF6B6B] border-2 border-black flex items-center justify-center font-black text-sm text-black shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
                  2
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs sm:text-sm font-black text-black">
                      Rekam Suara atau Catat Poin Penting
                    </h5>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 border border-black font-bold">
                      Voice Note / Catatan
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                    Buka menu <strong>Studio Voice Note</strong> dan letakkan HP/laptop di tengah meja rapat untuk merekam suara pimpinan dan peserta. Jika rapat berlangsung singkat, Anda juga bisa langsung mengetik poin-poin usulan di catatan pengarah.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#4ECDC4] border-2 border-black flex items-center justify-center font-black text-sm text-black shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
                  3
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs sm:text-sm font-black text-black">
                      Rumuskan Risalah &amp; Ekspor Dokumen
                    </h5>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 border border-black font-bold">
                      1-Klik Jadi
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                    Tekan tombol kuning <strong>&quot;Rumuskan Risalah Sidang&quot;</strong>. Sistem akan otomatis membagi naskah menjadi: Dasar Hukum, Poin Kritis (Most Important), Pembahasan, Keputusan, dan Tugas PIC. Cukup klik tombol ekspor untuk mencetak PDF, mengunduh Word, atau membagikan ke WhatsApp pembina!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'glossary' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-700 font-bold">
                Daftar istilah formal persidangan dan rapat dinas agar Anda tidak bingung saat bertugas:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black">Risalah Sidang</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-200 border border-black font-bold">Dokumen Resmi</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 font-medium leading-relaxed">
                    Naskah dinas resmi yang mencatat kronologi jalannya sidang, daftar hadir, pokok perdebatan, dan ketetapan sah yang mengikat organisasi.
                  </p>
                </div>

                <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black">Quorum (Kuorum)</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-200 border border-black font-bold">Keabsahan</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 font-medium leading-relaxed">
                    Jumlah minimal anggota atau perwakilan kelas yang wajib hadir (biasanya 50% + 1) agar sidang dapat dimulai dan keputusannya sah.
                  </p>
                </div>

                <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black">Poin Kritis (Most Important)</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-200 border border-black font-bold">Wajib Diisi</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 font-medium leading-relaxed">
                    Intisari keputusan paling krusial dan berisiko tinggi yang wajib diketahui pimpinan sekolah / pembina sebelum keputusan lain dieksekusi.
                  </p>
                </div>

                <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black">Action Items (Tugas PIC)</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-200 border border-black font-bold">Tindak Lanjut</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 font-medium leading-relaxed">
                    Tugas nyata yang dibebankan kepada penanggung jawab tertentu (Person in Charge) lengkap dengan batas waktu penyelesaian (deadline).
                  </p>
                </div>

                <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black">Konsiderans (Mengingat)</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-200 border border-black font-bold">Dasar Hukum</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 font-medium leading-relaxed">
                    Rujukan aturan hukum dasar yang melandasi sidang, seperti AD/ART MPK 13, Petunjuk Teknis Dinas Pendidikan, atau SK Kepala Sekolah.
                  </p>
                </div>

                <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black">Skorsing Sidang</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-200 border border-black font-bold">Jeda Sidang</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 font-medium leading-relaxed">
                    Penghentian sementara jalannya sidang (misal: waktu istirahat salat, makan, atau musyawarah lobi antarkomisi). Notulis menjeda rekaman audio.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-amber-50 border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_#000] space-y-1.5">
                <h5 className="text-xs font-black text-black flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-amber-600 stroke-[3]" />
                  <span>1. Gunakan Template Siap Pakai Panitia MPLS</span>
                </h5>
                <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                  Untuk melihat contoh hasil naskah sidang yang sempurna, klik tombol <strong>&quot;Muat Contoh Panitia MPLS&quot;</strong>. Anda bisa langsung melihat bagaimana 6 divisi, RAB, dan ketetapan tersusun rapi.
                </p>
              </div>

              <div className="p-3.5 bg-sky-50 border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_#000] space-y-1.5">
                <h5 className="text-xs font-black text-black flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-sky-600 stroke-[3]" />
                  <span>2. Kirim Ringkasan ke WhatsApp Guru / Pembina</span>
                </h5>
                <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                  Setelah risalah selesai dirumuskan, klik tombol <strong>&quot;WhatsApp&quot;</strong> di pojok kanan atas editor. Sistem akan menyalin ringkasan eksekutif rapi siap kirim ke grup chat sekolah.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50 border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_#000] space-y-1.5">
                <h5 className="text-xs font-black text-black flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>3. Otomatisasi Cloud Backup</span>
                </h5>
                <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                  Sambungkan akun Google Anda di sidebar. Setiap kali Anda mengedit notulen, data otomatis dicadangkan ke Google Drive dan tidak akan hilang jika HP/laptop kehabisan baterai.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#FFFDF5] border-t-2 border-black p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-zinc-100 text-black border-2 border-black rounded-xl text-xs font-bold shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-center"
          >
            Tutup Panduan
          </button>

          <button
            onClick={handleTryInstantExample}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#FFE600] hover:bg-[#ffd93d] text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
            <span>⚡ Coba Contoh Panitia MPLS (1-Klik Langsung Jadi)</span>
            <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
