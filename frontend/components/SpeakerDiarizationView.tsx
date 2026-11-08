'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import { Clock, Edit2, Sparkles, RefreshCw, MessageSquare, Check, ArrowRight } from 'lucide-react';
import { AudioSegment } from '../lib/types';

interface SpeakerDiarizationViewProps {
  transcript: AudioSegment[];
  onUpdateTranscript: (updated: AudioSegment[]) => void;
  onSynthesizeNotulen: (notes?: string) => void;
  isSynthesizing: boolean;
  initialSecretaryNotes?: string;
}

export const SpeakerDiarizationView: React.FC<SpeakerDiarizationViewProps> = ({
  transcript,
  onUpdateTranscript,
  onSynthesizeNotulen,
  isSynthesizing,
  initialSecretaryNotes,
}) => {
  const [editingSpeaker, setEditingSpeaker] = useState<string | null>(null);
  const [newSpeakerName, setNewSpeakerName] = useState<string>('');
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [editingSegmentText, setEditingSegmentText] = useState<string>('');

  const [secretaryNotes, setSecretaryNotes] = useState<string>(
    initialSecretaryNotes ||
      'Susun kata-kata secara formal dan lugas berstandar MPK SMK Negeri 13 Bandung. Tonjolkan keputusan resmi, alokasi anggaran dana jika ada, serta daftar penugasan PIC dan batas waktu.'
  );

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

  const handleSaveSegmentEdit = (segmentId: string) => {
    const updated = transcript.map((seg) =>
      seg.id === segmentId ? { ...seg, text: editingSegmentText.trim() } : seg
    );
    onUpdateTranscript(updated);
    setEditingSegmentId(null);
    setEditingSegmentText('');
  };

  const presetNotes = [
    {
      label: 'Formal & Yuridis MPK 13',
      text: 'Gunakan tata bahasa formal keputusan pleno majelis, rujuk pasal AD/ART relevan, dan pastikan setiap klausul keputusan bernomor resmi.',
    },
    {
      label: 'Rangkuman Padat & Tajam',
      text: 'Buat ringkasan eksekutif sesingkat mungkin dalam 3-4 kalimat padat langsung ke inti persoalan tanpa basa-basi pengantar.',
    },
    {
      label: 'Fokus Keputusan & Anggaran Dana',
      text: 'Fokuskan perumusan notulensi pada angka anggaran biaya, sumber dana kas, dan pengesahan nominal rupiah per divisi kepengurusan.',
    },
    {
      label: 'Fokus Penugasan (PIC & Deadline)',
      text: 'Ekstraksi seluruh komitmen lisan menjadi daftar tugas operasional yang jelas dengan penanggung jawab spesifik dan tenggat waktu tegas.',
    },
  ];

  return (
    <div className="bg-[#0e0f14] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Transkripsi Suara &amp; Pemisahan Pembicara
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.05] text-zinc-300 border border-white/[0.08]">
              Verifikasi Sidang
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Segmentasi pembicara otomatis terverifikasi (*Siapa, Kapan, Apa yang Dibahas*)
          </p>
        </div>

        {/* Primary CTA: Rumuskan Risalah Sidang */}
        <button
          onClick={() => onSynthesizeNotulen(secretaryNotes)}
          disabled={isSynthesizing || transcript.length === 0}
          className="group flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 active:scale-[0.985] transition-all disabled:opacity-35 cursor-pointer"
        >
          {isSynthesizing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-950" />
              <span>Memproses &amp; Merumuskan Risalah...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              <span>Rumuskan Risalah Sidang</span>
              <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3 text-zinc-950" />
              </div>
            </>
          )}
        </button>
      </div>

      {/* Human Guidance: Arahan Notulis Sidang */}
      <div className="p-4 sm:p-5 bg-[#12141a] border border-white/[0.07] rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="speaker-diarization-notes" className="text-xs font-semibold text-white">
              Catatan Pengarah Notulis / Sekretaris Sidang
            </label>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">Panduan Diksi &amp; Arah Putusan</span>
        </div>

        <textarea
          id="speaker-diarization-notes"
          name="speaker-diarization-notes"
          aria-label="Catatan Pengarah Notulis / Sekretaris Sidang"
          rows={2}
          value={secretaryNotes}
          onChange={(e) => setSecretaryNotes(e.target.value)}
          placeholder="Tuliskan arahan khusus untuk AI: misal gaya bahasa formal, fokus anggaran dana, atau penugasan tenggat waktu..."
          className="w-full bg-black/50 border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 leading-relaxed font-sans"
        />

        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] font-mono text-zinc-500 mr-1">Preset Format:</span>
          {presetNotes.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSecretaryNotes(p.text)}
              className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#181a24] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.06] transition-all cursor-pointer active:scale-[0.98]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Speaker Mapping Quick Bar */}
      {uniqueSpeakers.length > 0 && (
        <div className="p-4 bg-[#12141a] border border-white/[0.06] rounded-2xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
            Daftar Pembicara Terdeteksi ({uniqueSpeakers.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {uniqueSpeakers.map((spk) => (
              <div
                key={spk}
                className="inline-flex items-center gap-2 bg-[#181a24] border border-white/[0.08] px-3 py-1.5 rounded-xl text-xs"
              >
                <div className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-300 flex items-center justify-center text-[10px] font-mono font-semibold">
                  {spk.charAt(0).toUpperCase()}
                </div>
                {editingSpeaker === spk ? (
                  <div className="flex items-center gap-1.5">
                    <label htmlFor={`rename-speaker-${spk}`} className="sr-only">
                      Ganti nama pembicara {spk}
                    </label>
                    <input
                      id={`rename-speaker-${spk}`}
                      name={`rename-speaker-${spk}`}
                      type="text"
                      aria-label={`Ganti nama pembicara ${spk}`}
                      value={newSpeakerName}
                      onChange={(e) => setNewSpeakerName(e.target.value)}
                      placeholder="Nama baru..."
                      className="bg-black/60 border border-white/20 text-white rounded px-2 py-0.5 text-xs focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameSpeaker(spk)}
                    />
                    <button
                      onClick={() => handleRenameSpeaker(spk)}
                      className="px-2 py-0.5 bg-white text-zinc-950 rounded text-[11px] font-semibold cursor-pointer"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setEditingSpeaker(null)}
                      className="text-zinc-500 hover:text-white text-[11px] cursor-pointer"
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
                      className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
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

      {/* Transcript Segments List with Inline Text Correction */}
      <div className="space-y-3">
        {transcript.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/[0.08] rounded-2xl space-y-2 bg-[#12141a]/40">
            <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 font-medium">Belum ada transkripsi audio untuk sesi rapat ini.</p>
            <p className="text-[11px] text-zinc-500 font-mono">
              Buka tab &quot;Perekaman Audio&quot; untuk merekam suara atau unggah file rekaman majelis.
            </p>
          </div>
        ) : (
          transcript.map((seg) => (
            <div
              key={seg.id}
              className="p-4 bg-[#12141a] border border-white/[0.06] rounded-2xl space-y-2 hover:border-white/15 transition-all group"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-white/[0.08]">
                    {seg.speaker}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    <span>
                      {seg.startTime} — {seg.endTime}
                    </span>
                  </div>
                  {editingSegmentId !== seg.id && (
                    <button
                      onClick={() => {
                        setEditingSegmentId(seg.id);
                        setEditingSegmentText(seg.text);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-white p-0.5 rounded transition-all cursor-pointer text-[10px] font-mono flex items-center gap-1"
                      title="Koreksi teks ucapan"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                      <span>Koreksi</span>
                    </button>
                  )}
                </div>
              </div>

              {editingSegmentId === seg.id ? (
                <div className="space-y-2 pt-1">
                  <label htmlFor={`edit-segment-${seg.id}`} className="sr-only">
                    Koreksi teks ucapan pembicara
                  </label>
                  <textarea
                    id={`edit-segment-${seg.id}`}
                    name={`edit-segment-${seg.id}`}
                    aria-label="Koreksi teks ucapan pembicara"
                    rows={2}
                    value={editingSegmentText}
                    onChange={(e) => setEditingSegmentText(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveSegmentEdit(seg.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-white text-zinc-950 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Simpan Koreksi</span>
                    </button>
                    <button
                      onClick={() => setEditingSegmentId(null)}
                      className="text-xs text-zinc-400 hover:text-white px-2 py-1 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans pl-1">
                  {seg.text}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
