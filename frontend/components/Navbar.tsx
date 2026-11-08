'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React from 'react';
import { Mic, FileText, CheckSquare, Activity, Smartphone, Sparkles, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRecording: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isRecording }) => {
  return (
    <header className="sticky top-0 z-50 pt-3 px-4 sm:px-6 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <div className="bg-[#0e1017]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl px-4 py-2.5 shadow-2xl shadow-black/70 flex items-center justify-between gap-4 transition-all">
          {/* Brand Monogram & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white font-bold text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              NJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">NotulenJMM</span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-md bg-white/[0.05] text-zinc-300 border border-white/[0.08]">
                  MPK 13
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden sm:block">
                Davin Maritza • 9Router Gateway & VibeVoice
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.05]">
            <button
              onClick={() => setActiveTab('craft')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                activeTab === 'craft'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Craft Studio
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-zinc-300" />
              Daftar Rapat
            </button>

            <button
              onClick={() => setActiveTab('record')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                activeTab === 'record'
                  ? 'bg-rose-900/60 text-rose-200 border border-rose-500/30'
                  : isRecording
                  ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-rose-400" />
              Studio Rekam
              {isRecording && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
            </button>

            <button
              onClick={() => setActiveTab('notulen')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                activeTab === 'notulen'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Editor Notulen
            </button>

            <button
              onClick={() => setActiveTab('actions')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                activeTab === 'actions'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              Keputusan & Aksi
            </button>

            <button
              onClick={() => setActiveTab('status')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                activeTab === 'status'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              Status Sistem
            </button>
          </nav>

          {/* Clean Hardware Telemetry Badges */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-white/[0.06] text-zinc-300 text-[11px] px-3 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              <span className="hidden sm:inline font-mono text-[10px] tracking-tight">9Router • Online</span>
              <span className="sm:hidden font-mono text-[10px]">9R Ready</span>
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-white/[0.06] text-zinc-400 text-[11px] px-2.5 py-1 rounded-lg">
              <Smartphone className="w-3 h-3 text-zinc-400" />
              <span className="font-mono text-[10px]">APK & Web</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
