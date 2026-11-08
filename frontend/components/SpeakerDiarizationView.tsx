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
    initialSecretaryNotes || ''
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
    <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_0px_#000]">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-black text-black tracking-tight">
              Transkripsi Suara &amp; Pemisahan Pembicara
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFD93D] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              Verifikasi Sidang
            </span>
          </div>
          <p className="text-xs text-zinc-700 mt-1 font-sans font-medium">
            Segmentasi pembicara otomatis terverifikasi (*Siapa, Kapan, Apa yang Dibahas*)
          </p>
        </div>

        {/* Primary CTA: Rumuskan Risalah Sidang */}
        <button
          onClick={() => onSynthesizeNotulen(secretaryNotes)}
          disabled={isSynthesizing}
          className="group flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#FFE600] hover:bg-[#ffd93d] text-black font-black text-xs border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSynthesizing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black stroke-[2.5]" />
              <span>Memproses &amp; Merumuskan Risalah...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Rumuskan Risalah Sidang</span>
              <div className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3 stroke-[3]" />
              </div>
            </>
          )}
        </button>
      </div>

      {/* Human Guidance: Arahan Notulis Sidang */}
      <div className="p-4 sm:p-5 bg-[#FFFDF5] border-2 border-black rounded-2xl space-y-3 shadow-[3px_3px_0px_0px_#000]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="speaker-diarization-notes" className="text-xs font-black text-black">
              Catatan Pengarah Notulis / Sekretaris Sidang
            </label>
          </div>
          <span className="text-[10px] font-black text-black bg-[#FFD93D] border border-black px-1.5 py-0.2 rounded shadow-[1px_1px_0px_0px_#000]">
            Panduan Diksi &amp; Arah Putusan
          </span>
        </div>

        <textarea
          id="speaker-diarization-notes"
          name="speaker-diarization-notes"
          aria-label="Catatan Pengarah Notulis / Sekretaris Sidang"
          rows={2}
          value={secretaryNotes}
          onChange={(e) => setSecretaryNotes(e.target.value)}
          placeholder="Tuliskan arahan khusus untuk AI: misal gaya bahasa formal, fokus anggaran dana, atau penugasan tenggat waktu..."
          className="w-full bg-white border-2 border-black rounded-xl p-3 text-xs text-black placeholder:text-zinc-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black leading-relaxed font-sans font-medium"
        />

        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] font-black uppercase text-black mr-1">Preset Format:</span>
          {presetNotes.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSecretaryNotes(p.text)}
              className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-white hover:bg-yellow-100 text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Speaker Mapping Quick Bar */}
      {uniqueSpeakers.length > 0 && (
        <div className="p-4 bg-[#FFFDF5] border-2 border-black rounded-2xl space-y-3 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] uppercase tracking-wider text-black font-black block">
            Daftar Pembicara Terdeteksi ({uniqueSpeakers.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {uniqueSpeakers.map((spk) => (
              <div
                key={spk}
                className="inline-flex items-center gap-2 bg-white border-2 border-black px-3 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000]"
              >
                <div className="w-5 h-5 rounded-md bg-[#FFD93D] text-black border border-black flex items-center justify-center text-[10px] font-black">
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
                      className="bg-white border-2 border-black text-black rounded px-2 py-0.5 text-xs focus:outline-none font-bold"
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameSpeaker(spk)}
                    />
                    <button
                      onClick={() => handleRenameSpeaker(spk)}
                      className="px-2 py-0.5 bg-[#A7F3D0] text-black border border-black rounded text-[11px] font-black cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setEditingSpeaker(null)}
                      className="text-black hover:underline text-[11px] font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-black">{spk}</span>
                    <button
                      onClick={() => {
                        setEditingSpeaker(spk);
                        setNewSpeakerName(spk);
                      }}
                      className="text-black hover:text-zinc-600 p-0.5 rounded transition-colors cursor-pointer"
                      title="Ubah nama pembicara"
                    >
                      <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
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
          <div className="text-center py-12 border-2 border-dashed border-black rounded-2xl space-y-2 bg-[#FFFDF5] shadow-[3px_3px_0px_0px_#000]">
            <MessageSquare className="w-8 h-8 text-black mx-auto stroke-[2.5]" />
            <p className="text-xs text-black font-black">Belum ada transkripsi audio untuk sesi rapat ini.</p>
            <p className="text-[11px] text-zinc-700 font-medium">
              Buka tab &quot;Perekaman Audio&quot; untuk merekam suara atau unggah file rekaman majelis.
            </p>
          </div>
        ) : (
          transcript.map((seg) => (
            <div
              key={seg.id}
              className="p-4 bg-[#FFFDF5] border-2 border-black rounded-2xl space-y-2 shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#A7F3D0] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                    {seg.speaker}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-zinc-700 font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 text-black stroke-[2.5]" />
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
                      className="opacity-0 group-hover:opacity-100 text-black hover:bg-yellow-200 border border-black px-1.5 py-0.5 rounded transition-all cursor-pointer text-[10px] font-black flex items-center gap-1 shadow-[1px_1px_0px_0px_#000]"
                      title="Koreksi teks ucapan"
                    >
                      <Edit2 className="w-2.5 h-2.5 stroke-[2.5]" />
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
                    className="w-full bg-white border-2 border-black rounded-xl p-2.5 text-xs text-black font-medium focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveSegmentEdit(seg.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-[#A7F3D0] hover:bg-emerald-300 text-black border-2 border-black rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Simpan Koreksi</span>
                    </button>
                    <button
                      onClick={() => setEditingSegmentId(null)}
                      className="text-xs text-black font-bold hover:underline px-2 py-1 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-black leading-relaxed font-sans font-medium pl-1">
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
