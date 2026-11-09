'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  FileText,
  Mic,
  BookOpen,
  CheckSquare,
  X,
  Cloud,
  LogOut,
  GraduationCap,
  Sparkles,
  Shield,
} from 'lucide-react';
import { useMeetings } from '../context/MeetingContext';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isRecording?: boolean;
  totalMeetingsCount: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isRecording = false,
  totalMeetingsCount,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { googleAccount, handleLogoutGoogle, handleLoginGoogle, handleLoginWithEmail, openBeginnerGuide, isAdmin } = useMeetings();

  const currentTab =
    activeTab ||
    (pathname === '/arsip'
      ? 'dashboard'
      : pathname === '/record'
      ? 'record'
      : pathname === '/notulen'
      ? 'notulen'
      : pathname === '/tasks'
      ? 'actions'
      : pathname === '/admin'
      ? 'admin'
      : 'craft');

  const handleSelectTab = (tab: string, route: string) => {
    if (setActiveTab) setActiveTab(tab);
    setIsOpenMobile(false);
    router.push(route);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 sm:w-72 bg-[#FFFDF5] border-r-[2.5px] border-black flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Institution Emblem & Branding */}
        <div className="pt-[max(1.15rem,env(safe-area-inset-top)+0.5rem)] pb-4 px-4 sm:p-5 border-b-2 border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center p-1 shadow-[3px_3px_0px_0px_#000] select-none overflow-hidden shrink-0">
              <Image
                src="/logo-mpk.png"
                alt="Logo MPK SMK Negeri 13 Bandung"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-black">NotulenJMM</span>
              </div>
              <p className="text-[11px] text-zinc-600 font-sans font-medium truncate max-w-[140px]">
                SMK Negeri 13 Bandung
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden text-black hover:bg-black/10 p-1.5 rounded-lg border border-black transition-colors cursor-pointer"
            aria-label="Tutup Menu Navigasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Categorized Navigation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Group 1: Ruang Kerja Sidang */}
          <div className="space-y-2">
            <span className="px-2 text-[10px] font-mono uppercase tracking-[0.15em] text-black font-extrabold block">
              Ruang Kerja
            </span>

            <button
              onClick={() => handleSelectTab('craft', '/')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                currentTab === 'craft'
                  ? 'bg-[#FFD93D] text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] translate-x-0.5'
                  : 'bg-white text-zinc-800 font-bold border-2 border-black/20 hover:border-black hover:bg-white hover:shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Studio Agenda</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-700">Mufakat</span>
            </button>

            <button
              onClick={() => handleSelectTab('dashboard', '/arsip')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-[#FFD93D] text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] translate-x-0.5'
                  : 'bg-white text-zinc-800 font-bold border-2 border-black/20 hover:border-black hover:bg-white hover:shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Arsip Sidang Resmi</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#4ECDC4] text-black font-black border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                {totalMeetingsCount}
              </span>
            </button>
          </div>

          {/* Group 2: Produksi & Audio */}
          <div className="space-y-2">
            <span className="px-2 text-[10px] font-mono uppercase tracking-[0.15em] text-black font-extrabold block">
              Produksi &amp; Suara
            </span>

            <button
              onClick={() => handleSelectTab('record', '/record')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                currentTab === 'record'
                  ? 'bg-[#FF6B6B] text-white font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] translate-x-0.5'
                  : isRecording
                  ? 'bg-[#FF6B6B]/20 text-[#FF6B6B] font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-zinc-800 font-bold border-2 border-black/20 hover:border-black hover:bg-white hover:shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Studio Voice Note</span>
              </div>
              {isRecording ? (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 border border-black animate-ping" />
              ) : (
                <span className="text-[10px] font-mono font-bold text-zinc-700">Rekam</span>
              )}
            </button>

            <button
              onClick={() => handleSelectTab('notulen', '/notulen')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                currentTab === 'notulen'
                  ? 'bg-[#FFD93D] text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] translate-x-0.5'
                  : 'bg-white text-zinc-800 font-bold border-2 border-black/20 hover:border-black hover:bg-white hover:shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Risalah &amp; Notulen</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-700">Editor</span>
            </button>
          </div>

          {/* Group 3: Keputusan & Tindak Lanjut */}
          <div className="space-y-2">
            <span className="px-2 text-[10px] font-mono uppercase tracking-[0.15em] text-black font-extrabold block">
              Ketetapan &amp; Tugas
            </span>

            <button
              onClick={() => handleSelectTab('actions', '/tasks')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                currentTab === 'actions'
                  ? 'bg-[#FFD93D] text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] translate-x-0.5'
                  : 'bg-white text-zinc-800 font-bold border-2 border-black/20 hover:border-black hover:bg-white hover:shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Ketetapan &amp; Tugas</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-700">PIC</span>
            </button>
          </div>

          {/* Group 4: Administrasi & Tata Kelola (Hanya untuk alfarrezald@gmail.com) */}
          {isAdmin && (
            <div className="space-y-2">
              <span className="px-2 text-[10px] font-mono uppercase tracking-[0.15em] text-black font-extrabold block">
                Tata Kelola
              </span>

              <button
                onClick={() => handleSelectTab('admin', '/admin')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-[#FFE600] text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] translate-x-0.5'
                    : 'bg-white text-zinc-800 font-bold border-2 border-black/20 hover:border-black hover:bg-white hover:shadow-[2px_2px_0px_0px_#000]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>Panel Administrator</span>
                </div>
                <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-black text-[#FFE600]">
                  MPK 13
                </span>
              </button>
            </div>
          )}

          {/* Bantuan */}
          <div className="pt-2 border-t border-black/10">
            <button
              type="button"
              onClick={() => {
                setIsOpenMobile(false);
                openBeginnerGuide();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-black hover:bg-[#FFFDF5] transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-zinc-600 stroke-[2]" />
              <span>Panduan Pemula</span>
            </button>
          </div>

        </div>

        {/* Google User Profile & Session Card */}
        {googleAccount.connected && googleAccount.email ? (
          <div className="p-3 border-t-2 border-black bg-[#FFFDF5]">
            <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#FFE600] border border-black flex items-center justify-center font-black text-xs text-black shrink-0 shadow-[1px_1px_0px_0px_#000] overflow-hidden relative">
                  {googleAccount.photoUrl ? (
                    <img
                      src={googleAccount.photoUrl}
                      alt={googleAccount.name || googleAccount.email}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{googleAccount.email.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-black text-black truncate max-w-[90px]" title={googleAccount.name ? `${googleAccount.name} (${googleAccount.email})` : googleAccount.email}>
                      {googleAccount.name || googleAccount.email}
                    </p>
                    {isAdmin && (
                      <span className="px-1 py-0.2 rounded bg-[#FFE600] text-black border border-black font-mono text-[8px] font-black uppercase tracking-wider shrink-0">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono truncate max-w-[125px]" title={googleAccount.email}>
                    {googleAccount.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Keluar dari akun Google ini?')) {
                    sessionStorage.removeItem('notulenjmm_guest_mode');
                    handleLogoutGoogle();
                  }
                }}
                title="Keluar dari akun Google"
                className="p-1.5 rounded-lg bg-zinc-50 hover:bg-rose-50 text-zinc-600 hover:text-rose-700 border border-black/40 hover:border-black cursor-pointer transition-colors shrink-0"
                aria-label="Keluar dari akun Google"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t-2 border-black bg-[#FFFDF5]">
            <div className="p-2.5 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                <span>Mode Tamu</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('notulenjmm_guest_mode');
                    window.location.reload();
                  }
                }}
                className="w-full py-1.5 px-2 bg-[#FFE600] hover:bg-[#ffd93d] text-black border-2 border-black rounded-lg text-xs font-black flex items-center justify-center gap-1.5 shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all"
                title="Masuk dengan Akun Google"
              >
                <span>Masuk Akun Google</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
