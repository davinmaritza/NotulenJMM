'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { UserFriendlyWorkflowBar } from './UserFriendlyWorkflowBar';
import { GoogleAuthGate } from './GoogleAuthGate';
import { useMeetings } from '../context/MeetingContext';
import { Menu } from 'lucide-react';

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
      : 'craft';

  const handleNavigateFromWorkflow = (tab: string) => {
    if (tab === 'craft') router.push('/');
    else if (tab === 'dashboard') router.push('/arsip');
    else if (tab === 'record') router.push('/record');
    else if (tab === 'notulen') router.push('/notulen');
    else if (tab === 'actions') router.push('/tasks');
  };

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

        {/* Content Body with phone-optimized top breathing room */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 md:px-8 pt-5 sm:pt-8 pb-8 sm:pb-12 space-y-4 sm:space-y-6">
          {/* Friendly 3-Step Workflow & Secretary Greeting Hub */}
          <UserFriendlyWorkflowBar
            activeTab={currentTab}
            onSelectTab={handleNavigateFromWorkflow}
            hasActiveMeeting={!!activeMeeting}
            totalMeetingsCount={meetings.length}
          />

          {children}
        </main>

        {/* Neo-Brutalist Institutional Footer */}
        <footer className="mt-auto border-t-2 border-black bg-[#FFFDF5] py-4 text-center text-xs text-black">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-[11px] font-mono font-bold text-black text-center sm:text-left">
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
    </div>
  );
};
