'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React from 'react';
import { useRouter } from 'next/navigation';
import { SpeakerDiarizationView } from '../../components/SpeakerDiarizationView';
import { NotulenEditor } from '../../components/NotulenEditor';
import { useMeetings } from '../../context/MeetingContext';
import { FileText, Mic, Compass } from 'lucide-react';

export default function NotulenPage() {
  const router = useRouter();
  const {
    activeMeeting,
    handleUpdateActiveMeeting,
    handleSynthesizeNotulen,
    isSynthesizing,
  } = useMeetings();

  return (
    <div className="space-y-8">
      {activeMeeting ? (
        <>
          <SpeakerDiarizationView
            transcript={activeMeeting.transcript}
            onUpdateTranscript={(updated) =>
              handleUpdateActiveMeeting({ ...activeMeeting, transcript: updated })
            }
            onSynthesizeNotulen={handleSynthesizeNotulen}
            isSynthesizing={isSynthesizing}
            initialSecretaryNotes={activeMeeting.secretaryNotes}
          />

          <NotulenEditor
            meeting={activeMeeting}
            onUpdateMeeting={handleUpdateActiveMeeting}
          />
        </>
      ) : (
        <div className="bg-[#0e0f14] border border-dashed border-white/[0.12] rounded-2xl p-10 sm:p-14 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Belum Ada Sesi Sidang Terpilih
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Silakan rekam suara rapat di Studio Voice Note atau pilih sesi sidang dari tab Arsip &amp; Draf untuk menyusun risalah.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.push('/record')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-950 rounded-xl text-xs font-bold hover:bg-zinc-200 active:scale-[0.985] transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 text-rose-500" />
              <span>Mulai Rekam Voice Note</span>
            </button>
            <button
              onClick={() => router.push('/arsip')}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#14161f] hover:bg-zinc-800 text-zinc-200 border border-white/10 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Buka Arsip Sidang</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
