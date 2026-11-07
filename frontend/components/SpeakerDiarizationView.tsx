'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import { UserCheck, Clock, Edit2, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Timeline Transkripsi & Diarisasi Pembicara</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              VibeVoice ASR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hasil pengenalan suara dan pelabelan pembicara otomatis (*Who, When, What*) dari Microsoft VibeVoice
          </p>
        </div>

        {/* Trigger 9Router Synthesizer */}
        <button
          onClick={onSynthesizeNotulen}
          disabled={isSynthesizing || transcript.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSynthesizing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Memproses dengan 9Router LLM...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Sintesis Notulen Cerdas via 9Router</span>
            </>
          )}
        </button>
      </div>

      {/* Speaker Mapping Quick Bar */}
      {uniqueSpeakers.length > 0 && (
        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Daftar Pembicara Terdeteksi ({uniqueSpeakers.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {uniqueSpeakers.map((spk) => (
              <div
                key={spk}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-200 font-medium">{spk}</span>
                <button
                  onClick={() => {
                    setEditingSpeaker(spk);
                    setNewSpeakerName(spk);
                  }}
                  className="text-slate-400 hover:text-indigo-300 ml-1"
                  title="Ganti nama pembicara ini"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {editingSpeaker && (
            <div className="mt-3 p-3 bg-slate-900 border border-indigo-500/40 rounded-xl flex flex-col sm:flex-row items-center gap-2">
              <span className="text-xs text-slate-300">Ubah &ldquo;{editingSpeaker}&rdquo; menjadi:</span>
              <input
                type="text"
                value={newSpeakerName}
                onChange={(e) => setNewSpeakerName(e.target.value)}
                placeholder="Nama Pengurus / Peserta"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-indigo-500"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleRenameSpeaker(editingSpeaker)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                >
                  Simpan Nama
                </button>
                <button
                  onClick={() => setEditingSpeaker(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transcript Segments List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {transcript.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Belum ada transkrip audio.</p>
            <p className="text-xs text-slate-600 mt-1">
              Rekam rapat di Studio Rekam atau muat simulasi untuk melihat diarisasi.
            </p>
          </div>
        ) : (
          transcript.map((seg, idx) => (
            <div
              key={seg.id || idx}
              className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-xl hover:border-slate-700 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold">
                    {seg.speaker}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>
                    {seg.startTime} — {seg.endTime}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">{seg.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
