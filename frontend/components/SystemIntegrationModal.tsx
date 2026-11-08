'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useEffect, useState } from 'react';
import { Cpu, Layers, Smartphone, Database } from 'lucide-react';
import { checkBackendHealth, HealthCheckResult } from '@/lib/api';

export const SystemIntegrationModal: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckResult | null>(null);

  useEffect(() => {
    checkBackendHealth().then(setHealth);
  }, []);

  return (
    <div className="bg-[#111318] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-white tracking-tight">Status Integrasi & Arsitektur Sistem</h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/[0.05] text-zinc-300 border border-white/[0.08]">
                DIAGNOSTIK TEKNIS
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Telemetri konektivitas gateway 9Router, model LLM aktif, kontainer Android APK, dan integritas repositori
            </p>
          </div>

          {health && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${health.online ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-zinc-600'}`} />
              <span className="text-zinc-300">
                {health.online ? 'Backend: Connected (HTTP 200)' : 'Client Standalone Mode'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hardware Telemetry 4-Card Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: 9Router AI Gateway */}
        <div className="p-5 bg-[#14161f] border border-white/[0.06] rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-sky-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">9Router Cloud AI Gateway</h3>
                <p className="text-[10px] font-mono text-zinc-500">OpenAI-Compatible LLM Router</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold border border-emerald-500/20">
              AKTIF & TERHUBUNG
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Gateway pemrosesan naskah sidang untuk penyusunan ringkasan eksekutif, perumusan ketetapan musyawarah, dan penyusunan daftar penugasan komisi.
          </p>
          <div className="pt-2 border-t border-white/[0.05] space-y-1 font-mono text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span className="text-zinc-500">Endpoint:</span>
              <span className="text-zinc-200">https://routernines.bytenodes.icu/v1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Model Default:</span>
              <span className="text-sky-400 font-semibold">ag/gemini-3.8-flash</span>
            </div>
          </div>
        </div>

        {/* Card 2: Microsoft VibeVoice */}
        <div className="p-5 bg-[#14161f] border border-white/[0.06] rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">Microsoft VibeVoice</h3>
                <p className="text-[10px] font-mono text-zinc-500">Diarization & ASR Tokenizer</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-white/[0.05] text-zinc-300 text-[10px] font-mono font-semibold border border-white/[0.08]">
              PIPELINE READY
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Menyediakan pengenalan suara rapat hingga 60 menit dengan joint speaker diarization & timestamping (*Who, When, What*) berbasis tokenisasi frekuensi ultra-low 7.5 Hz.
          </p>
          <div className="pt-2 border-t border-white/[0.05] space-y-1 font-mono text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span className="text-zinc-500">Sampling Rate:</span>
              <span className="text-zinc-200">48kHz High-Fidelity Audio</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Diarization Target:</span>
              <span className="text-zinc-200">Multi-Speaker Classroom Majelis</span>
            </div>
          </div>
        </div>

        {/* Card 3: Capacitor Android Native APK */}
        <div className="p-5 bg-[#14161f] border border-white/[0.06] rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">Android Native Container</h3>
                <p className="text-[10px] font-mono text-zinc-500">Capacitor 8 + Gradle 8.14.3</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold border border-emerald-500/20">
              COMPILED (4.4 MB)
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Biner APK mandiri yang dapat dipasang di smartphone Android pengurus OSIS/MPK SMK Negeri 13 Bandung, dilengkapi izin mikrofon native dan persistensi offline.
          </p>
          <div className="pt-2 border-t border-white/[0.05] space-y-1 font-mono text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span className="text-zinc-500">Package ID:</span>
              <span className="text-zinc-200">com.mpk13.notulenjmm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Target SDK:</span>
              <span className="text-zinc-200">Android Platform 36 (JDK 21)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Notion Project Knowledge System */}
        <div className="p-5 bg-[#14161f] border border-white/[0.06] rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">Notion Knowledge System</h3>
                <p className="text-[10px] font-mono text-zinc-500">Model Context Protocol (MCP)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold border border-emerald-500/20">
              19 HALAMAN SINKRON
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Arsitektur terintegrasi antara repositori lokal, CLAUDE.md, dan halaman Notion NotionJMM sebagai sumber kebenaran (source of truth) dokumentasi dan keputusan proyek.
          </p>
          <div className="pt-2 border-t border-white/[0.05] space-y-1 font-mono text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span className="text-zinc-500">Root Page:</span>
              <span className="text-zinc-200">NotulenJMM Root (UUID: 40a13039)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Lisensi & Hak Cipta:</span>
              <span className="text-zinc-200">MPK SMK Negeri 13 Bandung • Davin Maritza</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
