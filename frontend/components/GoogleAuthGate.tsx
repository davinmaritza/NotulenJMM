'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import Image from 'next/image';
import {
  Cloud,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  Settings,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useMeetings } from '../context/MeetingContext';
import { getGoogleClientId, setGoogleClientId } from '../lib/googleDriveBackup';

interface GoogleAuthGateProps {
  onGuestContinue: () => void;
}

const DETECTED_ACCOUNTS = [
  {
    email: 'alfarrezald@gmail.com',
    label: 'Akun Google Utama (Google Drive / Cloud)',
    isPrimary: true,
  },
  {
    email: 'workwithdap@gmail.com',
    label: 'Akun Google Developer Android',
    isPrimary: false,
  },
];

export const GoogleAuthGate: React.FC<GoogleAuthGateProps> = ({ onGuestContinue }) => {
  const { handleLoginGoogle, handleLoginWithEmail } = useMeetings();
  const [emailInput, setEmailInput] = useState<string>('alfarrezald@gmail.com');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [clientIdInput, setClientIdInput] = useState<string>(() => getGoogleClientId());

  const handleDirectLogin = (email: string, name?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const targetEmail = email.trim();
      if (!targetEmail) {
        throw new Error(
          'Silakan pilih salah satu Akun Google terdeteksi atau ketikkan alamat email Google Anda.'
        );
      }
      if (!targetEmail.includes('@') || !targetEmail.includes('.')) {
        throw new Error('Format email tidak valid. Masukkan format email lengkap (misal: alfarrezald@gmail.com).');
      }
      handleLoginWithEmail(targetEmail, name);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const onSignInClick = (emailOverride?: string) => {
    const targetEmail = (emailOverride || emailInput).trim();
    handleDirectLogin(targetEmail);
  };

  const onTryOAuthPopup = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const activeClientId = clientIdInput.trim() || getGoogleClientId();
      if (activeClientId) {
        setGoogleClientId(activeClientId);
      }
      await handleLoginGoogle(emailInput);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const onSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleClientId(clientIdInput.trim());
    setErrorMsg(null);
    setShowConfig(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black flex flex-col items-center justify-center px-4 py-8 sm:p-6 pt-[max(2.5rem,env(safe-area-inset-top)+2rem)] antialiased selection:bg-[#FFE600] selection:text-black">
      {/* Background Decorative Graphic Elements */}
      <div className="w-full max-w-xl mx-auto space-y-6 pt-2 sm:pt-0">
        {/* Main Neo-Brutalism Card */}
        <div className="bg-white border-[3px] border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
          {/* Header Branding */}
          <div className="flex flex-col items-center text-center space-y-3 pb-5 border-b-2 border-black/15">
            <div className="w-16 h-16 rounded-2xl bg-[#FFE600] border-2 border-black p-2 shadow-[3px_3px_0px_0px_#000] flex items-center justify-center">
              <Image
                src="/logo-mpk.png"
                alt="Logo MPK SMK Negeri 13 Bandung"
                width={52}
                height={52}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F2FE] text-black border border-black font-mono text-[10px] font-bold shadow-[1px_1px_0px_0px_#000] mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
                <span>GERBANG OTENTIKASI &amp; CADANGAN RESMI</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-tight">
                NotulenJMM • MPK 13
              </h1>
              <p className="text-xs text-zinc-700 font-sans font-medium mt-1">
                Sistem Manajemen Risalah Sidang &amp; Dokumentasi Majelis Perwakilan Kelas SMK Negeri 13 Bandung
              </p>
            </div>
          </div>

          {/* Description & Objective */}
          <div className="space-y-2">
            <h2 className="text-sm sm:text-base font-black text-black text-center tracking-tight">
              Masuk dengan Akun Google untuk Mengaktifkan Pencadangan Cloud
            </h2>
            <p className="text-xs text-zinc-600 text-center leading-relaxed">
              Login sekali saja — sesi Anda akan tersimpan secara otomatis sehingga tidak perlu login berulang kali. Seluruh notulen dan keputusan sidang terlindungi di Google Drive dan siap diekspor ke Google Docs.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-1">
              <div className="flex items-center gap-1.5 text-black">
                <Cloud className="w-4 h-4 text-sky-700 stroke-[2.5]" />
                <span className="text-[11px] font-black">Auto-Backup</span>
              </div>
              <p className="text-[10px] text-zinc-700 leading-snug">
                Pencadangan otomatis ke Google Drive setiap kali Anda menulis.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-1">
              <div className="flex items-center gap-1.5 text-black">
                <FileText className="w-4 h-4 text-blue-700 stroke-[2.5]" />
                <span className="text-[11px] font-black">Google Docs</span>
              </div>
              <p className="text-[10px] text-zinc-700 leading-snug">
                Ekspor naskah risalah resmi langsung ke format Google Docs.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-1">
              <div className="flex items-center gap-1.5 text-black">
                <Zap className="w-4 h-4 text-amber-600 stroke-[2.5]" />
                <span className="text-[11px] font-black">Sesi Permanen</span>
              </div>
              <p className="text-[10px] text-zinc-700 leading-snug">
                Sesi tersimpan otomatis tanpa perlu repot login berulang kali.
              </p>
            </div>
          </div>

          {/* Error Message Box if Any */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-100 border-2 border-black text-xs text-rose-900 font-bold shadow-[2px_2px_0px_0px_#000] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-700 mt-0.5" />
              <div className="flex-1">
                <p className="font-black text-rose-950">Gagal Masuk</p>
                <p className="text-[11px] mt-0.5 font-medium">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Quick-Pick Detected Accounts from PC */}
          <div className="space-y-2 pt-1 border-t-2 border-black/10">
            <div className="text-[11px] font-black text-black flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Akun Google Terdeteksi di PC / Browser:</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#A7F3D0] border border-black text-black">
                1-Klik Masuk
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DETECTED_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setEmailInput(acc.email);
                    handleDirectLogin(acc.email, acc.label);
                  }}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 border-black text-left transition-all shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-between group cursor-pointer ${
                    acc.isPrimary ? 'bg-[#FEF9C3] hover:bg-[#FFE600]' : 'bg-[#FFFDF5] hover:bg-yellow-100'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-xs font-black text-black truncate block">{acc.email}</span>
                    <p className="text-[10px] text-zinc-700 font-medium truncate mt-0.5">{acc.label}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-black opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Primary CTA: Google Sign-in Button & Email Input */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="gate-email-input" className="text-xs font-black text-black flex items-center justify-between">
                <span>Alamat Email Google / Akun Notulis Lainnya:</span>
                <span className="text-[10px] font-mono text-zinc-600 font-bold">Sesi Tersimpan</span>
              </label>
              <input
                id="gate-email-input"
                name="gateEmail"
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSignInClick();
                  }
                }}
                placeholder="misal: sekretaris.mpk13@gmail.com"
                className="w-full bg-[#FFFDF5] border-2 border-black text-black font-mono text-xs font-bold rounded-xl px-3.5 py-3 shadow-[2.5px_2.5px_0px_0px_#000] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600]"
              />
              <p className="text-[10px] text-zinc-600 leading-tight">
                Ketik email Google Anda agar sesi tersimpan otomatis di perangkat ini dan terhubung ke dokumen sidang.
              </p>
            </div>

            <button
              onClick={() => onSignInClick()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-[#FFE600] hover:bg-[#ffd93d] text-black font-black text-sm sm:text-base border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-black stroke-[3]" />
                  <span>Menghubungkan Akun Google...</span>
                </>
              ) : (
                <>
                  {/* Official Google G Logo SVG */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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

            {/* Offline / Guest Mode Fallback */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={onGuestContinue}
                className="text-xs font-bold text-zinc-600 hover:text-black underline underline-offset-2 transition-colors cursor-pointer"
              >
                Lanjutkan Mode Tamu / Offline (Tanpa Akun)
              </button>

              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="text-xs font-bold text-zinc-600 hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Pengaturan Client ID</span>
              </button>
            </div>
          </div>

          {/* Expandable Google Client ID Configuration Drawer */}
          {showConfig && (
            <form onSubmit={onSaveClientId} className="p-4 rounded-xl bg-[#FFFDF5] border-2 border-black space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-black">Konfigurasi Google Client ID</span>
                <span className="text-[10px] text-zinc-500 font-mono">OAuth 2.0</span>
              </div>
              <p className="text-[11px] text-zinc-600">
                Masukkan Client ID dari Google Cloud Console organisasi Anda jika diperlukan:
              </p>
              <label htmlFor="gate-client-id-input" className="sr-only">
                Konfigurasi Google Client ID OAuth 2.0
              </label>
              <input
                id="gate-client-id-input"
                name="googleClientId"
                type="text"
                aria-label="Konfigurasi Google Client ID OAuth 2.0"
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                placeholder="misal: 123456789-abcdef.apps.googleusercontent.com"
                className="w-full bg-white border-2 border-black text-black font-mono text-xs rounded-xl px-3 py-2 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              />
              <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={onTryOAuthPopup}
                  className="px-3 py-1.5 bg-[#E0F2FE] hover:bg-sky-200 text-black border border-black rounded-lg text-xs font-bold shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                >
                  Tes Otorisasi Popup OAuth
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfig(false)}
                    className="px-3 py-1.5 text-xs font-bold text-black hover:underline cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#A7F3D0] hover:bg-emerald-300 text-black border-2 border-black rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer"
                  >
                    Simpan Client ID
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Credit & Info */}
        <div className="text-center text-[11px] text-zinc-600 font-medium">
          <p>
            Majelis Perwakilan Kelas (MPK) SMK Negeri 13 Bandung • Sistem Notulen Mandiri
          </p>
        </div>
      </div>
    </div>
  );
};
