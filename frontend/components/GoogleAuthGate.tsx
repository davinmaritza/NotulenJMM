'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import Image from 'next/image';
import {
  Cloud,
  FileText,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Lock,
  CheckCircle2,
  Sparkles,
  School,
} from 'lucide-react';
import { useMeetings } from '../context/MeetingContext';

interface GoogleAuthGateProps {
  onGuestContinue?: () => void;
}

export const GoogleAuthGate: React.FC<GoogleAuthGateProps> = () => {
  const { handleLoginGoogle } = useMeetings();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onGoogleAuthClick = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await handleLoginGoogle();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black flex flex-col justify-between relative overflow-hidden antialiased selection:bg-[#FFE600] selection:text-black">
      {/* Background Dot Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#00000015_1px,transparent_1px)] [background-size:22px_22px]"
        aria-hidden="true"
      />



      {/* TOP INSTITUTIONAL BAR */}
      <header className="relative z-10 w-full border-b-2 border-black bg-white/90 backdrop-blur-sm px-4 sm:px-8 py-3.5 shadow-[0_2px_0_0_#000]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
              <Image
                src="/logo-mpk.png"
                alt="Logo MPK SMK Negeri 13 Bandung"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-black">NotulenJMM</span>
                <span className="text-[10px] font-mono font-black uppercase px-1.5 py-0.2 rounded bg-[#FFE600] border border-black shadow-[1px_1px_0px_0px_#000]">
                  v0.9.3
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 font-sans font-medium truncate hidden sm:block">
                MPK Nawadasha Bhakti Amita Paramartha • SMK Negeri 13 Bandung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-950 border border-emerald-400 font-mono text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden xs:inline">Sistem Online</span>
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Institutional Prestige & Feature Pillars (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFDF5] border-2 border-black font-mono text-[11px] font-black shadow-[2px_2px_0px_0px_#000]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span className="uppercase tracking-wider">Portal Masuk Resmi • Jalur Menyurat (JMM)</span>
            </div>

            {/* Title & Vision */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight leading-[1.15]">
                Sistem Risalah Sidang &amp; Ketetapan TAP Majelis
              </h1>
              <p className="text-xs sm:text-sm text-zinc-700 font-sans font-medium leading-relaxed max-w-xl">
                Akses terpadu bagi seluruh anggota dan pengurus MPK SMK Negeri 13 Bandung. 
                Perekaman Notulensi Berbasis Voice, manajemen arsip dinas, dan pengesahan ketetapan sidang dalam satu pintu aman.
              </p>
            </div>

            {/* 3 Pillar Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Pillar 1 */}
              <div className="p-3.5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-sky-100 border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
                  <Cloud className="w-4 h-4 text-sky-700 stroke-[2.5]" />
                </div>
                <h2 className="text-xs font-black text-black">Google Drive Sync</h2>
                <p className="text-[11px] text-zinc-600 leading-snug">
                  Pencadangan otomatis risalah sidang langsung ke cloud Google Drive Anda.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-3.5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
                  <FileText className="w-4 h-4 text-purple-700 stroke-[2.5]" />
                </div>
                <h2 className="text-xs font-black text-black">Ekspor Dokumen</h2>
                <p className="text-[11px] text-zinc-600 leading-snug">
                  Format naskah dinas resmi siap ekspor ke Google Docs &amp; PDF terstandarisasi.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-3.5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
                  <Lock className="w-4 h-4 text-amber-700 stroke-[2.5]" />
                </div>
                <h2 className="text-xs font-black text-black">Akses Terproteksi</h2>
                <p className="text-[11px] text-zinc-600 leading-snug">
                  Otentikasi tunggal akun Google dengan pembatasan peran &amp; wewenang komisi.
                </p>
              </div>
            </div>

            {/* Institutional Seal Footnote */}
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-zinc-600">
              <School className="w-4 h-4 text-black shrink-0" />
              <span>SMK Negeri 13 Bandung • Kawaluyaan, Bandung, Jawa Barat</span>
            </div>
          </div>

          {/* RIGHT COLUMN: The Google Sign-In Card (5 cols on lg) */}
          <div className="lg:col-span-5">
            <div className="bg-white border-[3px] border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000] space-y-5 text-center relative animate-in fade-in zoom-in-95">
              
              {/* Emblem & Identity */}
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#FFE600] border-2 border-black p-2 mx-auto shadow-[3px_3px_0px_0px_#000] flex items-center justify-center">
                  <Image
                    src="/logo-mpk.png"
                    alt="Logo MPK"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-black tracking-tight">
                    Masuk ke NotulenJMM
                  </h2>
                  <p className="text-xs text-zinc-600 font-sans font-medium mt-1">
                    Gunakan akun Google aktif Anda untuk membuka sesi kerja notulensi &amp; persidangan.
                  </p>
                </div>
              </div>

              {/* Error Alert Box if any */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-500 text-xs text-rose-950 font-medium shadow-[2px_2px_0px_0px_#000] text-left flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="font-black text-xs text-rose-950">Gagal Melakukan Otorisasi</p>
                    <p className="text-[11px] leading-relaxed break-words">{errorMsg}</p>
                    <p className="text-[10px] text-rose-800 font-mono pt-1">
                      Tips: Pastikan pop-up peramban diizinkan untuk jmm.davinn.net.
                    </p>
                  </div>
                </div>
              )}

              {/* THE SOLE CALL TO ACTION: OFFICIAL GOOGLE LOGIN BUTTON */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={onGoogleAuthClick}
                  disabled={isLoading}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#FFE600] hover:bg-[#ffd93d] text-black font-black text-sm border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 select-none"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-black stroke-[2.5]" />
                      <span>Menghubungkan ke Google...</span>
                    </>
                  ) : (
                    <>
                      {/* Official 4-Color Google Logo SVG */}
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Masuk dengan Akun Google</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>

                {/* Single Sign-On Info */}
                <p className="text-[11px] text-zinc-500 font-sans font-medium leading-normal">
                  Login sekali untuk sesi permanen di peramban Anda.
                </p>
              </div>

              {/* Security & Verification Guarantee */}
              <div className="pt-3 border-t-2 border-black/10 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-black">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <span>Jaminan Privasi &amp; Keamanan</span>
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  Sistem hanya meminta akses identitas dasar (nama &amp; email) serta penyimpanan Google Drive untuk berkas risalah Anda. NotulenJMM tidak pernah menyimpan kata sandi.
                </p>
              </div>

              {/* Help & Contact Presidium */}
              <div className="p-3 bg-[#FFFDF5] border border-black/20 rounded-xl text-left text-[11px] text-zinc-700 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  Butuh hak akses administrator atau bantuan? Hubungi Presidium Majelis di{' '}
                  <a
                    href="mailto:alfarrezald@gmail.com"
                    className="font-mono font-bold text-black underline underline-offset-2"
                  >
                    alfarrezald@gmail.com
                  </a>
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full border-t-2 border-black bg-white/90 backdrop-blur-sm py-4 px-4 sm:px-8 text-center text-xs text-zinc-700">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono">
          <p className="font-bold text-black">
            © 2026 MPK SMK Negeri 13 Bandung • Jalur Menyurat MPK (JMM)
          </p>
          <p className="text-zinc-600">
            Dibuat untuk Majelis Perwakilan Kelas SMK Negeri 13 Bandung
          </p>
        </div>
      </footer>
    </div>
  );
};
