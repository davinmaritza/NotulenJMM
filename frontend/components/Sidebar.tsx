'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React from 'react';
import {
  Compass,
  FileText,
  Mic,
  BookOpen,
  CheckSquare,
  Activity,
  X,
  Clock,
} from 'lucide-react';
import { Meeting } from '../lib/types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRecording: boolean;
  totalMeetingsCount: number;
  activeMeeting?: Meeting | null;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isRecording,
  totalMeetingsCount,
  activeMeeting,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 sm:w-72 bg-[#090a0f] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Institution Emblem & Branding */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#13151d] border border-white/10 flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] select-none">
              NJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-white">NotulenJMM</span>
                <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08] select-none">
                  MPK 13
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-sans truncate max-w-[140px]">
                SMK Negeri 13 Bandung
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Categorized Navigation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Group 1: Ruang Kerja Sidang */}
          <div className="space-y-1.5">
            <span className="px-3 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500 font-semibold block">
              Ruang Kerja
            </span>

            <button
              onClick={() => handleSelectTab('craft')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-[0.985] cursor-pointer ${
                activeTab === 'craft'
                  ? 'bg-zinc-800 text-white font-semibold border border-white/10 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-zinc-300" />
                <span>Studio Agenda</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Mufakat</span>
            </button>

            <button
              onClick={() => handleSelectTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-[0.985] cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-800 text-white font-semibold border border-white/10 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-zinc-300" />
                <span>Arsip &amp; Draf Sidang</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-400 border border-white/[0.06]">
                {totalMeetingsCount}
              </span>
            </button>
          </div>

          {/* Group 2: Produksi & Audio */}
          <div className="space-y-1.5">
            <span className="px-3 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500 font-semibold block">
              Produksi &amp; Suara
            </span>

            <button
              onClick={() => handleSelectTab('record')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-[0.985] cursor-pointer ${
                activeTab === 'record'
                  ? 'bg-rose-950/60 text-rose-200 border border-rose-500/30 font-semibold shadow-sm'
                  : isRecording
                  ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-rose-400" />
                <span>Studio Voice Note</span>
              </div>
              {isRecording ? (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              ) : (
                <span className="text-[10px] font-mono text-zinc-500">Rekam</span>
              )}
            </button>

            <button
              onClick={() => handleSelectTab('notulen')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-[0.985] cursor-pointer ${
                activeTab === 'notulen'
                  ? 'bg-zinc-800 text-white font-semibold border border-white/10 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-zinc-300" />
                <span>Risalah &amp; Notulen</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Editor</span>
            </button>
          </div>

          {/* Group 3: Keputusan & Telemetri */}
          <div className="space-y-1.5">
            <span className="px-3 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500 font-semibold block">
              Kontrol &amp; Sistem
            </span>

            <button
              onClick={() => handleSelectTab('actions')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-[0.985] cursor-pointer ${
                activeTab === 'actions'
                  ? 'bg-zinc-800 text-white font-semibold border border-white/10 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-zinc-300" />
                <span>Ketetapan &amp; Tugas</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">PIC</span>
            </button>

            <button
              onClick={() => handleSelectTab('status')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-[0.985] cursor-pointer ${
                activeTab === 'status'
                  ? 'bg-zinc-800 text-white font-semibold border border-white/10 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-zinc-300" />
                <span>Status Sistem</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
            </button>
          </div>

          {/* Active Session Context Card in Sidebar */}
          {activeMeeting && (
            <div className="pt-2">
              <div
                onClick={() => handleSelectTab('notulen')}
                className="p-3 bg-[#12141c] hover:bg-[#161924] border border-white/[0.07] rounded-2xl space-y-1.5 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                    Sesi Terpilih
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.2 rounded-full ${
                      activeMeeting.status === 'FINALIZED'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : activeMeeting.status === 'DRAFT'
                        ? 'bg-amber-500/10 text-amber-300'
                        : 'bg-sky-500/10 text-sky-400'
                    }`}
                  >
                    {activeMeeting.status === 'DRAFT' ? 'DRAF' : activeMeeting.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-white truncate group-hover:text-sky-300 transition-colors">
                  {activeMeeting.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{Math.floor(activeMeeting.durationSeconds / 60)} Menit Audio</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom: Profile & Telemetry Badge */}
        <div className="p-4 border-t border-white/[0.06] bg-[#07080c] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-white text-xs font-semibold font-mono">
                DM
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-white leading-none">Davin Maritza</p>
                <p className="text-[10px] text-zinc-500 font-sans leading-none">Sekretariat MPK 13</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Aktif</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
