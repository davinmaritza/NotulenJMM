'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { UserFriendlyWorkflowBar } from './UserFriendlyWorkflowBar';
import { SecretaryGuideModal } from './SecretaryGuideModal';
import { useMeetings } from '../context/MeetingContext';
import { Menu } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isOpenGuide, setIsOpenGuide] = useState<boolean>(false);

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
    <div className="min-h-screen bg-[#07080a] text-[#f4f4f6] flex flex-col lg:flex-row antialiased selection:bg-white/10 selection:text-white">
      {/* Secretary Interactive Guide Modal */}
      <SecretaryGuideModal
        isOpen={isOpenGuide}
        onClose={() => setIsOpenGuide(false)}
        onNavigateTab={(tab) => {
          handleNavigateFromWorkflow(tab);
          setIsOpenGuide(false);
        }}
      />

      {/* Institutional Left Sidebar */}
      <Sidebar
        activeTab={currentTab}
        isRecording={isRecording}
        totalMeetingsCount={meetings.length}
        activeMeeting={activeMeeting}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        onOpenGuide={() => setIsOpenGuide(true)}
      />

      {/* Main Content Workspace to the Right of Sidebar */}
      <div className="flex-1 flex flex-col lg:pl-64 sm:lg:pl-72 min-w-0 min-h-screen">
        {/* Top Mobile Bar (visible only on mobile/tablet) */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#090a0f]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#13151d] border border-white/10 flex items-center justify-center text-white font-bold text-xs select-none">
              NJ
            </div>
            <div>
              <span className="font-semibold text-xs text-white">NotulenJMM</span>
              <span className="text-[10px] font-mono ml-1.5 px-1.5 py-0.2 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
                MPK 13
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpenGuide(true)}
              className="p-1.5 rounded-lg bg-sky-950/40 text-sky-400 hover:text-white border border-sky-500/30 text-xs font-semibold cursor-pointer"
              title="Buku Saku Notulis"
            >
              Buku Saku
            </button>
            <button
              onClick={() => setIsOpenMobile(true)}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 cursor-pointer"
              title="Buka Menu Navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
          {/* Friendly 3-Step Workflow & Secretary Greeting Hub */}
          <UserFriendlyWorkflowBar
            activeTab={currentTab}
            onSelectTab={handleNavigateFromWorkflow}
            onOpenGuide={() => setIsOpenGuide(true)}
            hasActiveMeeting={!!activeMeeting}
            totalMeetingsCount={meetings.length}
          />

          {children}
        </main>

        {/* Institutional Footer */}
        <footer className="mt-auto border-t border-white/[0.06] bg-[#07080a] py-6 text-center text-xs text-zinc-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono">
            <p>
              NotulenJMM • Hak Cipta &copy; 2026 <strong>MPK SMK Negeri 13 Bandung</strong>. Karya <strong>Davin Maritza</strong>.
            </p>
            <div className="flex items-center gap-3 text-zinc-500">
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
