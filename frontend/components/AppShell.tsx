'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { UserFriendlyWorkflowBar } from './UserFriendlyWorkflowBar';
import { useMeetings } from '../context/MeetingContext';
import { Menu } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  const {
    meetings,
    activeMeeting,
    isRecording,
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

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black flex flex-col lg:flex-row antialiased selection:bg-[#FFE600] selection:text-black">
      {/* Institutional Left Sidebar */}
      <Sidebar
        activeTab={currentTab}
        isRecording={isRecording}
        totalMeetingsCount={meetings.length}
        activeMeeting={activeMeeting}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Workspace to the Right of Sidebar */}
      <div className="flex-1 flex flex-col lg:pl-64 sm:lg:pl-72 min-w-0 min-h-screen">
        {/* Top Mobile Bar (visible only on mobile/tablet) */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#FFFDF5] border-b-2 border-black px-4 py-3 flex items-center justify-between shadow-[0_3px_0_0_#000]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFD93D] border-2 border-black flex items-center justify-center text-black font-black text-xs shadow-[2px_2px_0px_0px_#000] select-none">
              NJ
            </div>
            <div>
              <span className="font-black text-xs text-black">NotulenJMM</span>
              <span className="text-[10px] font-mono ml-1.5 px-1.5 py-0.5 rounded bg-[#C4B5FD] text-black border border-black font-bold">
                MPK 13
              </span>
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

        {/* Content Body */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
          {/* Friendly 3-Step Workflow & Secretary Greeting Hub */}
          <UserFriendlyWorkflowBar
            activeTab={currentTab}
            onSelectTab={handleNavigateFromWorkflow}
            hasActiveMeeting={!!activeMeeting}
            totalMeetingsCount={meetings.length}
          />

          {children}
        </main>

        {/* Neo-Brutalist Institutional Footer (Fixed from dark mode) */}
        <footer className="mt-auto border-t-2 border-black bg-[#FFFDF5] py-4 text-center text-xs text-black">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono font-bold text-black">
            <p>
              NotulenJMM • Hak Cipta &copy; 2026 <strong className="font-black text-black">MPK SMK Negeri 13 Bandung</strong>. Karya <strong className="font-black text-black">Davin Maritza</strong>.
            </p>
            <div className="flex items-center gap-3 font-black text-black">
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
