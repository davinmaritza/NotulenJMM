'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import {
  Compass,
  Mic,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';

interface UserFriendlyWorkflowBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenGuide: () => void;
  hasActiveMeeting?: boolean;
  totalMeetingsCount: number;
}

const getGreetingText = (): string => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return 'Selamat Pagi';
  if (hour >= 11 && hour < 15) return 'Selamat Siang';
  if (hour >= 15 && hour < 19) return 'Selamat Sore';
  return 'Selamat Malam';
};

export const UserFriendlyWorkflowBar: React.FC<UserFriendlyWorkflowBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenGuide,
  totalMeetingsCount,
}) => {
  const [greeting] = useState<string>(getGreetingText);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="bg-[#0e0f14] border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 transition-all">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-semibold text-white tracking-tight flex items-center gap-2">
              {greeting}, Davin Maritza <span className="animate-wave inline-block">👋</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Notulis Siap
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Alur kerja pencatatan sidang MPK SMK Negeri 13 Bandung: Rekam suara, rumuskan keputusan resmi, dan bagikan dalam hitungan detik.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141620] hover:bg-zinc-800 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold active:scale-[0.985] transition-all cursor-pointer"
            title="Buka Buku Saku & Panduan Notulis"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Buku Saku Notulis</span>
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
            title={isCollapsed ? 'Tampilkan Alur Kerja' : 'Ciutkan Alur Kerja'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 3-Step Interactive Workflow Cards */}
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-white/[0.05]">
          {/* STEP 1: Agenda */}
          <div
            onClick={() => onSelectTab('craft')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 active:scale-[0.985] ${
              activeTab === 'craft'
                ? 'bg-[#151824] border-sky-500/60 shadow-md ring-1 ring-sky-500/20'
                : 'bg-[#10121a] border-white/[0.06] hover:border-white/15 hover:bg-[#131622]'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Langkah 1
                </span>
                {totalMeetingsCount > 0 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <h4 className="text-xs font-semibold text-white truncate">Studio Agenda &amp; Format</h4>
              <p className="text-[11px] text-zinc-400 line-clamp-1">
                Pilih format dinas atau buat sesi sidang baru
              </p>
            </div>
          </div>

          {/* STEP 2: Voice Note */}
          <div
            onClick={() => onSelectTab('record')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 active:scale-[0.985] ${
              activeTab === 'record'
                ? 'bg-rose-950/30 border-rose-500/60 shadow-md ring-1 ring-rose-500/20'
                : 'bg-[#10121a] border-white/[0.06] hover:border-white/15 hover:bg-[#131622]'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
              <Mic className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Langkah 2
                </span>
                <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded">
                  Waveform
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white truncate">Perekam Voice Note</h4>
              <p className="text-[11px] text-zinc-400 line-clamp-1">
                Rekam langsung, jeda saat skors, &amp; simpan draf
              </p>
            </div>
          </div>

          {/* STEP 3: Notulen & Ekspor */}
          <div
            onClick={() => onSelectTab('notulen')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 active:scale-[0.985] ${
              activeTab === 'notulen'
                ? 'bg-emerald-950/30 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/20'
                : 'bg-[#10121a] border-white/[0.06] hover:border-white/15 hover:bg-[#131622]'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Langkah 3
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                  Word / WA
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white truncate">Risalah &amp; Ekspor</h4>
              <p className="text-[11px] text-zinc-400 line-clamp-1">
                Kirim WA, unduh Word, PDF resmi &amp; Excel
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
