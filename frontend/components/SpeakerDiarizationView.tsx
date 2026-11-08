'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import { Clock, Edit2, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import { AudioSegment } from '../lib/types';

interface SpeakerDiarizationViewProps {
  transcript: AudioSegment[];
  onUpdateTranscript: (updated: AudioSegment[]) => void;
  onSynthesizeNotulen: () => void;
  isSynthesizing: boolean;
}

export const SpeakerDiarizationView: React.FC<SpeakerDiarizationViewProps> = ({
  transcript,
  onUpdateTranscript,
  onSynthesizeNotulen,
  isSynthesizing,
}) => {
  const [editingSpeaker, setEditingSpeaker] = useState<string | null>(null);
  const [newSpeakerName, setNewSpeakerName] = useState<string>('');

  const uniqueSpeakers = Array.from(new Set(transcript.map((s) => s.speaker)));

  const handleRenameSpeaker = (oldName: string) => {
    if (!newSpeakerName.trim()) return;
    const updated = transcript.map((seg) =>
      seg.speaker === oldName ? { ...seg, speaker: newSpeakerName.trim() } : seg
    );
    onUpdateTranscript(updated);
    setEditingSpeaker(null);
    setNewSpeakerName('');
  };

  return (
    <div className="bg-[#111318] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-white tracking-tight">Timeline Transkripsi & Diarisasi</h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/[0.05] text-zinc-300 border border-white/[0.08]">
              VibeVoice Engine
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Segmentasi pembicara otomatis (*Who, When, What*) diproses melalui Microsoft VibeVoice
          </p>
        </div>

        {/* Trigger 9Router Synthesizer (High-Contrast Button-in-Button) */}
        <button
          onClick={onSynthesizeNotulen}
          disabled={isSynthesizing || transcript.length === 0}
          className="group flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs shadow-md hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer"
        >
          {isSynthesizing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-950" />
              <span>Memproses dengan 9Router LLM...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              <span>Sintesis Notulen Cerdas</span>
              <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <span className="text-[10px] font-bold">→</span>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Speaker Mapping Quick Bar */}
      {uniqueSpeakers.length > 0 && (
        <div className="p-4 bg-black/40 border border-white/[0.05] rounded-2xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
            Daftar Pembicara Terdeteksi ({uniqueSpeakers.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {uniqueSpeakers.map((spk) => (
              <div
                key={spk}
                className="inline-flex items-center gap-2 bg-[#161822] border border-white/[0.08] px-3 py-1.5 rounded-xl text-xs"
              >
                <div className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-300 flex items-center justify-center text-[10px] font-mono">
                  {spk.charAt(0).toUpperCase()}
                </div>
                {editingSpeaker === spk ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newSpeakerName}
                      onChange={(e) => setNewSpeakerName(e.target.value)}
                      placeholder="Nama baru..."
                      className="bg-black/60 border border-white/20 text-white rounded px-2 py-0.5 text-xs focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameSpeaker(spk)}
                    />
                    <button
                      onClick={() => handleRenameSpeaker(spk)}
                      className="px-2 py-0.5 bg-white text-zinc-950 rounded text-[11px] font-semibold"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setEditingSpeaker(null)}
                      className="text-zinc-500 hover:text-white text-[11px]"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-zinc-200">{spk}</span>
                    <button
                      onClick={() => {
                        setEditingSpeaker(spk);
                        setNewSpeakerName(spk);
                      }}
                      className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors"
                      title="Ubah nama pembicara"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transcript Segments List */}
      <div className="space-y-3">
        {transcript.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/[0.08] rounded-2xl space-y-2">
            <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 font-medium">Belum ada transkripsi audio untuk sesi rapat ini.</p>
            <p className="text-[11px] text-zinc-500 font-mono">
              Buka tab &quot;Studio Rekam&quot; untuk merekam suara atau unggah file rekaman majelis.
            </p>
          </div>
        ) : (
          transcript.map((seg) => (
            <div
              key={seg.id}
              className="p-4 bg-[#14161f] border border-white/[0.06] rounded-2xl space-y-2 hover:border-white/15 transition-all"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/[0.08]">
                    {seg.speaker}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                  <Clock className="w-3 h-3 text-zinc-600" />
                  <span>
                    {seg.startTime} — {seg.endTime}
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans pl-1">
                {seg.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
