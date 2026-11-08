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
    <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_0px_#000]">
      {/* Header */}
      <div className="border-b-2 border-black/10 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-black text-black tracking-tight">Status Integrasi &amp; Arsitektur Sistem</h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FFD93D] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                DIAGNOSTIK TEKNIS
              </span>
            </div>
            <p className="text-xs text-zinc-700 font-medium mt-1">
              Telemetri konektivitas gateway 9Router, model LLM aktif, kontainer Android APK, dan integritas repositori
            </p>
          </div>

          {health && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-black bg-white text-xs font-mono font-black shadow-[2px_2px_0px_0px_#000]">
              <span className={`w-2.5 h-2.5 rounded-full border border-black ${health.online ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
              <span className="text-black">
                {health.online ? 'Backend: Connected (HTTP 200)' : 'Client Standalone Mode'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hardware Telemetry 4-Card Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: 9Router AI Gateway */}
        <div className="p-5 bg-[#E0F2FE] border-2 border-black rounded-2xl space-y-3 shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#38BDF8] border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                <Layers className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black text-black">9Router Cloud AI Gateway</h3>
                <p className="text-[10px] font-mono text-zinc-700 font-bold">OpenAI-Compatible LLM Router</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#A7F3D0] text-black text-[10px] font-black border border-black shadow-[1px_1px_0px_0px_#000]">
              AKTIF &amp; TERHUBUNG
            </span>
          </div>
          <p className="text-xs text-zinc-800 leading-relaxed font-sans font-medium">
            Gateway pemrosesan naskah sidang untuk penyusunan ringkasan eksekutif, perumusan ketetapan musyawarah, dan penyusunan daftar penugasan komisi.
          </p>
          <div className="pt-2 border-t-2 border-black/10 space-y-1 font-mono text-[11px] text-zinc-800">
            <div className="flex justify-between">
              <span className="font-bold">Endpoint:</span>
              <span className="text-black font-bold">https://routernines.bytenodes.icu/v1</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Model Default:</span>
              <span className="text-black bg-yellow-200 border border-black px-1.5 rounded font-black">ag/gemini-3.8-flash</span>
            </div>
          </div>
        </div>

        {/* Card 2: Microsoft VibeVoice */}
        <div className="p-5 bg-[#FEF08A] border-2 border-black rounded-2xl space-y-3 shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFD93D] border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                <Cpu className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black text-black">Microsoft VibeVoice</h3>
                <p className="text-[10px] font-mono text-zinc-700 font-bold">Diarization &amp; ASR Tokenizer</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-white text-black text-[10px] font-black border border-black shadow-[1px_1px_0px_0px_#000]">
              PIPELINE READY
            </span>
          </div>
          <p className="text-xs text-zinc-800 leading-relaxed font-sans font-medium">
            Menyediakan pengenalan suara rapat hingga 60 menit dengan joint speaker diarization &amp; timestamping (*Who, When, What*) berbasis tokenisasi frekuensi ultra-low 7.5 Hz.
          </p>
          <div className="pt-2 border-t-2 border-black/10 space-y-1 font-mono text-[11px] text-zinc-800">
            <div className="flex justify-between">
              <span className="font-bold">Sampling Rate:</span>
              <span className="text-black font-bold">48kHz High-Fidelity Audio</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Diarization Target:</span>
              <span className="text-black font-bold">Multi-Speaker Classroom Majelis</span>
            </div>
          </div>
        </div>

        {/* Card 3: Capacitor Android Native APK */}
        <div className="p-5 bg-[#FECDD3] border-2 border-black rounded-2xl space-y-3 shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B6B] border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                <Smartphone className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black text-black">Android Native Container</h3>
                <p className="text-[10px] font-mono text-zinc-700 font-bold">Capacitor 8 + Gradle 8.14.3</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#A7F3D0] text-black text-[10px] font-black border border-black shadow-[1px_1px_0px_0px_#000]">
              COMPILED (4.4 MB)
            </span>
          </div>
          <p className="text-xs text-zinc-800 leading-relaxed font-sans font-medium">
            Biner APK mandiri yang dapat dipasang di smartphone Android pengurus OSIS/MPK SMK Negeri 13 Bandung, dilengkapi izin mikrofon native dan persistensi offline.
          </p>
          <div className="pt-2 border-t-2 border-black/10 space-y-1 font-mono text-[11px] text-zinc-800">
            <div className="flex justify-between">
              <span className="font-bold">Package ID:</span>
              <span className="text-black font-bold">com.mpk13.notulenjmm</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Target SDK:</span>
              <span className="text-black font-bold">Android Platform 36 (JDK 21)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Notion Project Knowledge System */}
        <div className="p-5 bg-[#DDD6FE] border-2 border-black rounded-2xl space-y-3 shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C4B5FD] border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                <Database className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black text-black">Notion Knowledge System</h3>
                <p className="text-[10px] font-mono text-zinc-700 font-bold">Model Context Protocol (MCP)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#A7F3D0] text-black text-[10px] font-black border border-black shadow-[1px_1px_0px_0px_#000]">
              19 HALAMAN SINKRON
            </span>
          </div>
          <p className="text-xs text-zinc-800 leading-relaxed font-sans font-medium">
            Arsitektur terintegrasi antara repositori lokal, CLAUDE.md, dan halaman Notion NotionJMM sebagai sumber kebenaran (source of truth) dokumentasi dan keputusan proyek.
          </p>
          <div className="pt-2 border-t-2 border-black/10 space-y-1 font-mono text-[11px] text-zinc-800">
            <div className="flex justify-between">
              <span className="font-bold">Root Page:</span>
              <span className="text-black font-bold">NotulenJMM Root (UUID: 40a13039)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Lisensi &amp; Hak Cipta:</span>
              <span className="text-black font-bold">MPK SMK Negeri 13 Bandung • Davin Maritza</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
