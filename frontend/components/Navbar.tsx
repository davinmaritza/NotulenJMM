'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React from 'react';
import { Mic, FileText, CheckSquare, Activity, Compass, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRecording: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isRecording }) => {
  return (
    <header className="sticky top-0 z-50 pt-3 px-3 sm:px-6 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <div className="bg-[#0b0c10]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl px-3.5 py-2.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 transition-all">
          {/* Official Emblem & Monogram */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14161d] border border-white/10 flex items-center justify-center text-white font-bold text-xs tracking-tight shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] select-none">
              NJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-white">NotulenJMM</span>
                <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-300 border border-white/[0.08] select-none">
                  MPK 13
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-sans hidden sm:block">
                Majelis Perwakilan Kelas SMK Negeri 13 Bandung
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Human & Editorial) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#12141a]/90 p-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('craft')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.985] cursor-pointer ${
                activeTab === 'craft'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-zinc-300" />
              <span>Studio Agenda</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.985] cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-zinc-300" />
              <span>Arsip Sidang</span>
            </button>

            <button
              onClick={() => setActiveTab('record')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.985] cursor-pointer ${
                activeTab === 'record'
                  ? 'bg-rose-950/60 text-rose-200 border border-rose-500/30 font-semibold'
                  : isRecording
                  ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-rose-400" />
              <span>Perekaman Audio</span>
              {isRecording && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
            </button>

            <button
              onClick={() => setActiveTab('notulen')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.985] cursor-pointer ${
                activeTab === 'notulen'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-300" />
              <span>Risalah & Notulen</span>
            </button>

            <button
              onClick={() => setActiveTab('actions')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.985] cursor-pointer ${
                activeTab === 'actions'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-zinc-300" />
              <span>Ketetapan & Tugas</span>
            </button>

            <button
              onClick={() => setActiveTab('status')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.985] cursor-pointer ${
                activeTab === 'status'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-zinc-300" />
              <span>Status Server</span>
            </button>
          </nav>

          {/* Minimalist Institutional Telemetry */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#12141a] border border-white/[0.07] text-zinc-300 text-[11px] px-3 py-1.5 rounded-xl select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              <span className="font-mono text-[10px] text-zinc-300 font-medium">Sistem Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
