'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import {
  Compass,
  Mic,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';

interface UserFriendlyWorkflowBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
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
  totalMeetingsCount,
}) => {
  const [greeting] = useState<string>(getGreetingText);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="bg-white border-[2.5px] border-black rounded-2xl p-5 sm:p-6 space-y-4 shadow-[5px_5px_0px_0px_#000] transition-all">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-black text-black tracking-tight flex items-center gap-2">
              {greeting}, Davin Maritza
            </span>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#A7F3D0] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              Notulis Siap
            </span>
          </div>
          <p className="text-xs text-zinc-700 font-medium leading-relaxed">
            Alur kerja pencatatan sidang MPK SMK Negeri 13 Bandung: Rekam suara, rumuskan keputusan resmi, dan bagikan dalam hitungan detik.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 bg-[#FFFDF5] hover:bg-yellow-100 text-black border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
            title={isCollapsed ? 'Tampilkan Alur Kerja' : 'Ciutkan Alur Kerja'}
            aria-label={isCollapsed ? 'Tampilkan Alur Kerja' : 'Ciutkan Alur Kerja'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4 stroke-[2.5]" /> : <ChevronUp className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* 3-Step Interactive Workflow Cards */}
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t-2 border-black/10">
          {/* STEP 1: Agenda */}
          <div
            onClick={() => onSelectTab('craft')}
            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 ${
              activeTab === 'craft'
                ? 'bg-[#E0F2FE] border-black shadow-[4px_4px_0px_0px_#000]'
                : 'bg-[#FFFDF5] border-black/70 hover:border-black hover:bg-white shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000]'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#38BDF8] border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_#000] shrink-0 mt-0.5">
              <Compass className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-200 border border-black text-black">
                  Langkah 1
                </span>
                {totalMeetingsCount > 0 && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                )}
              </div>
              <h4 className="text-xs font-black text-black truncate pt-0.5">Studio Agenda &amp; Format</h4>
              <p className="text-[11px] text-zinc-700 font-medium line-clamp-1">
                Pilih format dinas atau buat sesi sidang baru
              </p>
            </div>
          </div>

          {/* STEP 2: Voice Note */}
          <div
            onClick={() => onSelectTab('record')}
            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 ${
              activeTab === 'record'
                ? 'bg-[#FFE4E6] border-black shadow-[4px_4px_0px_0px_#000]'
                : 'bg-[#FFFDF5] border-black/70 hover:border-black hover:bg-white shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000]'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#FF6B6B] border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_#000] shrink-0 mt-0.5">
              <Mic className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-200 border border-black text-black">
                  Langkah 2
                </span>
                <span className="text-[9px] font-black text-black bg-[#FFD93D] border border-black px-1.5 py-0.2 rounded shadow-[1px_1px_0px_0px_#000]">
                  Waveform
                </span>
              </div>
              <h4 className="text-xs font-black text-black truncate pt-0.5">Perekam Voice Note</h4>
              <p className="text-[11px] text-zinc-700 font-medium line-clamp-1">
                Rekam langsung, jeda saat skors, &amp; simpan draf
              </p>
            </div>
          </div>

          {/* STEP 3: Notulen & Ekspor */}
          <div
            onClick={() => onSelectTab('notulen')}
            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 ${
              activeTab === 'notulen'
                ? 'bg-[#DCFCE7] border-black shadow-[4px_4px_0px_0px_#000]'
                : 'bg-[#FFFDF5] border-black/70 hover:border-black hover:bg-white shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000]'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#4ECDC4] border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_#000] shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-200 border border-black text-black">
                  Langkah 3
                </span>
                <span className="text-[9px] font-black text-black bg-[#A7F3D0] border border-black px-1.5 py-0.2 rounded shadow-[1px_1px_0px_0px_#000]">
                  Word / WA
                </span>
              </div>
              <h4 className="text-xs font-black text-black truncate pt-0.5">Risalah &amp; Ekspor</h4>
              <p className="text-[11px] text-zinc-700 font-medium line-clamp-1">
                Kirim WA, unduh Word, PDF resmi &amp; Excel
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
