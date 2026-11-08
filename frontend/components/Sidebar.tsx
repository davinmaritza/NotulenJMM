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
  Clock,
} from 'lucide-react';
import { Meeting } from '../lib/types';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isRecording?: boolean;
  totalMeetingsCount: number;
  activeMeeting?: Meeting | null;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isRecording = false,
  totalMeetingsCount,
  activeMeeting,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const pathname = usePathname();
  const router = useRouter();

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
        <div className="p-4 sm:p-5 border-b-2 border-black flex items-center justify-between bg-white">
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
                <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-[#C4B5FD] text-black border border-black font-bold shadow-[1.5px_1.5px_0px_0px_#000] select-none">
                  MPK 13
                </span>
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
                <span>Arsip &amp; Draf Sidang</span>
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

          {/* Active Session Context Card in Sidebar */}
          {activeMeeting && (
            <div className="pt-2">
              <div
                onClick={() => handleSelectTab('notulen', '/notulen')}
                className="p-3.5 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] space-y-1.5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0px_0px_#000] cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-700 font-bold">
                    Sesi Terpilih
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] ${
                      activeMeeting.status === 'FINALIZED'
                        ? 'bg-[#4ECDC4] text-black'
                        : activeMeeting.status === 'DRAFT'
                        ? 'bg-[#FFD93D] text-black'
                        : 'bg-[#C4B5FD] text-black'
                    }`}
                  >
                    {activeMeeting.status === 'DRAFT' ? 'DRAF' : activeMeeting.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-black truncate group-hover:text-amber-800 transition-colors">
                  {activeMeeting.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono font-medium">
                  <Clock className="w-3 h-3 text-black" />
                  <span>{Math.floor(activeMeeting.durationSeconds / 60)} Menit Audio</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom: Profile & Telemetry Badge */}
        <div className="p-4 border-t-2 border-black bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFD93D] border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-black text-xs font-black font-mono">
                DM
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-black text-black leading-none">Davin Maritza</p>
                <p className="text-[10px] text-zinc-700 font-sans font-medium leading-none">Sekretariat MPK 13</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#4ECDC4] border border-black text-[10px] font-mono font-bold text-black shadow-[1.5px_1.5px_0px_0px_#000]">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <span>Aktif</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
