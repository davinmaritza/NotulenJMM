'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React from 'react';
import {
  Cpu,
  Layers,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Terminal,
  BookOpen,
} from 'lucide-react';

export const SystemIntegrationModal: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Status Integrasi & Arsitektur Sistem</h2>
        <p className="text-xs text-slate-400 mt-1">
          Spesifikasi konektivitas mesin AI, kontainer mobile Android APK, dan atribusi lisensi resmi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: VibeVoice */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Microsoft VibeVoice</h3>
                <p className="text-[11px] text-slate-400">Speech-to-Text & Diarization</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              TERINTEGRASI
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Menyediakan transkripsi audio rapat hingga 60 menit dengan joint speaker diarization & timestamping (Who, When, What) dan tokenisasi ultra-low 7.5 Hz.
          </p>
          <div className="text-[11px] text-indigo-400 font-mono flex items-center gap-1.5 pt-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>github.com/microsoft/VibeVoice</span>
          </div>
        </div>

        {/* Card 2: 9router */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">9router AI Gateway</h3>
                <p className="text-[11px] text-slate-400">Multi-Tier LLM Fallback & Router</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              AKTIF
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Router LLM cerdas OpenAI-compatible (`http://localhost:20128/v1`) yang menghubungkan 40+ provider AI dengan fallback otomatis dan kompresi token (RTK).
          </p>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 pt-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>9router.com (OpenAI Endpoint Compatible)</span>
          </div>
        </div>

        {/* Card 3: Capacitor Android */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Capacitor Android Container</h3>
                <p className="text-[11px] text-slate-400">Cross-Platform Packaging</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-[10px] font-bold border border-violet-500/20">
              v8.6.0
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mengemas antarmuka Next.js menjadi aplikasi native Android APK dengan Application ID <code>com.mpk13.notulenjmm</code> dan akses perizinan mikrofon.
          </p>
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 pt-1">
            <span>npm run build:apk</span>
          </div>
        </div>

        {/* Card 4: Legal & License */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Lisensi & Hak Cipta</h3>
                <p className="text-[11px] text-slate-400">Legal Ownership</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
              MIT LICENSE
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dilisensikan untuk <strong>MPK SMK Negeri 13 Bandung</strong>, seluruh hak cipta dan kode dikembangkan oleh <strong>Davin Maritza</strong> (2026).
          </p>
          <div className="text-[11px] text-amber-300 font-mono flex items-center gap-1.5 pt-1">
            <span>Copyright (c) 2026 MPK SMK Negeri 13 Bandung</span>
          </div>
        </div>
      </div>
    </div>
  );
};
