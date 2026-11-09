'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { GoogleAuthGate } from './GoogleAuthGate';
import { BeginnerGuideModal } from './BeginnerGuideModal';
import { useMeetings } from '../context/MeetingContext';
import { Menu, ShieldAlert, AlertTriangle, LogOut } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('notulenjmm_guest_mode') === 'true';
  });

  const {
    meetings,
    activeMeeting,
    isRecording,
    googleAccount,
    isHydrated,
    isBeginnerGuideOpen,
    openBeginnerGuide,
    closeBeginnerGuide,
    handleLogoutGoogle,
  } = useMeetings();

  const currentTab =
    pathname === '/arsip'
      ? 'dashboard'
      : pathname === '/record'
      ? 'record'
      : pathname === '/notulen'
      ? 'notulen'
      : pathname === '/tasks'
      ? 'actions'
      : pathname === '/admin'
      ? 'admin'
      : 'craft';

  // 1. Initial hydration skeleton to prevent auth gate flicker
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center p-6 text-black select-none">
        <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-2 border-black p-1.5 shadow-[4px_4px_0px_0px_#000] flex items-center justify-center mb-4">
          <Image
            src="/logo-mpk.png"
            alt="Logo MPK"
            width={44}
            height={44}
            className="w-full h-full object-contain animate-pulse"
            priority
          />
        </div>
        <p className="text-xs font-mono font-bold text-zinc-800 animate-pulse">
          Memuat Workspace NotulenJMM...
        </p>
      </div>
    );
  }

  // 2. Google Authentication Gate if not connected and not in guest mode
  if (!(googleAccount.connected && googleAccount.email) && !isGuestMode) {
    return (
      <GoogleAuthGate
        onGuestContinue={() => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('notulenjmm_guest_mode', 'true');
          }
          setIsGuestMode(true);
        }}
      />
    );
  }

  // 3. User Suspension Lockout Gate
  if (googleAccount.connected && googleAccount.isSuspended) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center p-4 sm:p-6 text-black select-none">
        <div className="w-full max-w-md bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] text-center space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6B6B] border-2 border-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#000]">
            <ShieldAlert className="w-8 h-8 text-black stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 bg-red-100 text-red-800 border border-red-500 rounded-full text-[10px] font-mono font-black uppercase tracking-wider inline-block">
              Akses Ditangguhkan
            </span>
            <h1 className="text-xl font-black text-black tracking-tight">
              Akun Dinonaktifkan Sementara
            </h1>
            <p className="text-xs text-zinc-600 font-sans font-medium leading-relaxed">
              Akses risalah dan persidangan untuk akun <span className="font-mono font-bold text-black bg-zinc-100 px-1.5 py-0.5 rounded border border-black/20">{googleAccount.email}</span> telah ditangguhkan oleh Administrator MPK SMK Negeri 13 Bandung.
            </p>
          </div>

          <div className="bg-[#FFFDF5] border-2 border-black/15 rounded-xl p-3.5 text-left text-[11px] text-zinc-700 space-y-1.5">
            <p className="font-bold text-black flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              Butuh Pemulihan Hak Akses?
            </p>
            <p className="text-zinc-600 leading-normal">
              Silakan hubungi Presidium Majelis atau Superadministrator di <a href="mailto:alfarrezald@gmail.com" className="font-mono text-black font-bold underline">alfarrezald@gmail.com</a> untuk verifikasi ulang status kepengurusan Anda.
            </p>
          </div>

          <button
            onClick={() => handleLogoutGoogle()}
            className="w-full py-3 px-4 rounded-xl bg-black text-white font-black text-xs border-2 border-black hover:bg-zinc-800 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Ganti Akun Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black flex flex-col lg:flex-row antialiased selection:bg-[#FFE600] selection:text-black">
      {/* Institutional Left Sidebar */}
      <Sidebar
        activeTab={currentTab}
        isRecording={isRecording}
        totalMeetingsCount={meetings.length}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Workspace to the Right of Sidebar */}
      <div className="flex-1 flex flex-col lg:pl-64 sm:lg:pl-72 min-w-0 min-h-screen">
        {/* Top Mobile Bar (visible only on mobile/tablet) */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#FFFDF5] border-b-2 border-black px-4 pt-[max(0.85rem,env(safe-area-inset-top))] pb-3 flex items-center justify-between shadow-[0_3px_0_0_#000]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center p-0.5 shadow-[2px_2px_0px_0px_#000] select-none overflow-hidden shrink-0">
              <Image
                src="/logo-mpk.png"
                alt="Logo MPK SMK Negeri 13 Bandung"
                width={30}
                height={30}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-black text-xs text-black">NotulenJMM</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpenMobile(true)}
              className="p-1.5 rounded-xl bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              title="Buka Menu Navigasi"
              aria-label="Buka Menu Navigasi"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </header>

        {/* Content Body with generous modern breathing room and fluid container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-10 pt-6 sm:pt-8 pb-10 sm:pb-16 space-y-6 sm:space-y-8">
          {children}
        </main>

        {/* Neo-Brutalist Institutional Footer */}
        <footer className="mt-auto border-t-2 border-black bg-[#FFFDF5] py-4 text-center text-xs text-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-[11px] font-mono font-bold text-black text-center sm:text-left">
            <p className="leading-relaxed">
              NotulenJMM • Hak Cipta &copy; 2026 <strong className="font-black text-black">MPK SMK Negeri 13 Bandung</strong>. Karya <strong className="font-black text-black">Davin Maritza</strong>.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 font-black text-black text-[10px] sm:text-[11px]">
              <span>Tata Naskah Dinas Digital</span>
              <span>•</span>
              <span>Web &amp; Android APK</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Interactive Beginner Guide Modal */}
      <BeginnerGuideModal isOpen={isBeginnerGuideOpen} onClose={closeBeginnerGuide} />
    </div>
  );
};
