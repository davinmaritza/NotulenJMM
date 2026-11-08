'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  FileCheck,
  Zap,
} from 'lucide-react';
import { Meeting } from '../lib/types';
import { useMeetings } from '../context/MeetingContext';

interface BeginnerChecklistCardProps {
  meeting: Meeting;
  onOpenGuide: () => void;
  onSynthesize?: () => void;
}

export const BeginnerChecklistCard: React.FC<BeginnerChecklistCardProps> = ({
  meeting,
  onOpenGuide,
  onSynthesize,
}) => {
  const { isBeginnerMode } = useMeetings();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  if (!isBeginnerMode) return null;

  const checks = [
    {
      id: 'agenda',
      title: 'Agenda & Format Sidang Terpilih',
      passed: Boolean(meeting.title && meeting.agendas && meeting.agendas.length > 0),
      hint: 'Pilih format sidang di Studio Agenda.',
    },
    {
      id: 'datetime',
      title: 'Hari, Tanggal & Pukul Sidang Sesuai',
      passed: Boolean(meeting.date && meeting.date.includes('WIB')),
      hint: 'Gunakan tombol Edit Tanggal Resmi Indonesia.',
    },
    {
      id: 'mostImportant',
      title: 'Poin Kritis / Keputusan Utama (Wajib)',
      passed: Boolean(meeting.mostImportant && meeting.mostImportant.trim().length > 5),
      hint: 'Isi kartu Poin Kritis dengan keputusan paling mendesak.',
    },
    {
      id: 'summary',
      title: 'Ringkasan Eksekutif Terisi',
      passed: Boolean(meeting.executiveSummary && meeting.executiveSummary.trim().length > 10),
      hint: 'Klik tombol Rumuskan Risalah Sidang untuk sintesis otomatis.',
    },
    {
      id: 'decisions',
      title: 'Ketetapan Sidang & Penugasan PIC',
      passed: Boolean(
        (meeting.decisions && meeting.decisions.length > 0) ||
          (meeting.actionItems && meeting.actionItems.length > 0)
      ),
      hint: 'Pastikan ada ketetapan atau daftar tugas penanggung jawab.',
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const totalCount = checks.length;
  const percent = Math.round((passedCount / totalCount) * 100);
  const isAllComplete = passedCount === totalCount;

  return (
    <div className="bg-white border-[2.5px] border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] space-y-3.5 transition-all">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_#000] shrink-0">
            <FileCheck className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-black text-black tracking-tight">
                Checklist Kelengkapan Notulen (Panduan Pemula)
              </h4>
              <span
                className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border border-black ${
                  isAllComplete
                    ? 'bg-emerald-300 text-emerald-950'
                    : 'bg-amber-200 text-amber-950'
                }`}
              >
                {passedCount}/{totalCount} Siap ({percent}%)
              </span>
            </div>
            <p className="text-[11px] text-zinc-700 font-medium">
              Standar naskah dinas resmi Majelis Perwakilan Kelas SMK Negeri 13 Bandung
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenGuide}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-[#FFFDF5] hover:bg-yellow-100 text-black border border-black rounded-lg text-[11px] font-bold shadow-[1px_1px_0px_0px_#000] cursor-pointer"
            title="Buka Panduan Pemula"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-800" />
            <span>Panduan</span>
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 bg-[#FFFDF5] hover:bg-zinc-100 text-black border border-black rounded-lg shadow-[1px_1px_0px_0px_#000] cursor-pointer"
            title={isCollapsed ? 'Tampilkan Checklist' : 'Ciutkan Checklist'}
            aria-label={isCollapsed ? 'Tampilkan Checklist' : 'Ciutkan Checklist'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4 stroke-[2.5]" /> : <ChevronUp className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 border border-black rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isAllComplete ? 'bg-emerald-500' : 'bg-[#FFD93D]'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Expanded Checklist Items */}
      {!isCollapsed && (
        <div className="pt-1 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {checks.map((check) => (
              <div
                key={check.id}
                className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs transition-colors ${
                  check.passed
                    ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950'
                    : 'bg-zinc-50 border-black/40 text-zinc-800'
                }`}
              >
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 fill-emerald-100" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold leading-tight">{check.title}</p>
                  {!check.passed && (
                    <p className="text-[10px] text-zinc-600 font-medium pt-0.5 leading-snug">
                      {check.hint}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Helper Action Footer */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-black/10">
            {isAllComplete ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                <span>Dokumen Anda 100% lengkap &amp; siap dicetak atau diekspor ke Word!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Klik tombol kuning di bawah untuk sintesis otomatis bila ada yang belum terisi.</span>
              </div>
            )}

            {!isAllComplete && onSynthesize && (
              <button
                onClick={onSynthesize}
                className="px-3 py-1.5 bg-[#FFE600] hover:bg-amber-300 text-black border border-black rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-black" />
                <span>Rumuskan Otomatis Sekarang</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
