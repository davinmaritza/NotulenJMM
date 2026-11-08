'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React from 'react';
import { useRouter } from 'next/navigation';
import { SpeakerDiarizationView } from '../../components/SpeakerDiarizationView';
import { NotulenEditor } from '../../components/NotulenEditor';
import { BeginnerChecklistCard } from '../../components/BeginnerChecklistCard';
import { useMeetings } from '../../context/MeetingContext';
import { FileText, Mic, Compass, GraduationCap } from 'lucide-react';

export default function NotulenPage() {
  const router = useRouter();
  const {
    activeMeeting,
    handleUpdateActiveMeeting,
    handleSynthesizeNotulen,
    handleCreateMplsMeeting,
    isSynthesizing,
    openBeginnerGuide,
  } = useMeetings();

  const handleSynthesizeWithScroll = async (notes?: string) => {
    await handleSynthesizeNotulen(notes);
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById('notulen-document-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {activeMeeting ? (
        <>
          {/* Beginner Completeness Guide Checklist */}
          <BeginnerChecklistCard
            meeting={activeMeeting}
            onOpenGuide={openBeginnerGuide}
            onSynthesize={() => handleSynthesizeWithScroll()}
          />

          <SpeakerDiarizationView
            transcript={activeMeeting.transcript}
            onUpdateTranscript={(updated) =>
              handleUpdateActiveMeeting({ ...activeMeeting, transcript: updated })
            }
            onSynthesizeNotulen={handleSynthesizeWithScroll}
            isSynthesizing={isSynthesizing}
            initialSecretaryNotes={activeMeeting.secretaryNotes}
          />

          <div id="notulen-document-section">
            <NotulenEditor
              meeting={activeMeeting}
              onUpdateMeeting={handleUpdateActiveMeeting}
            />
          </div>
        </>
      ) : (
        <div className="bg-white border-3 border-dashed border-black rounded-3xl p-10 sm:p-14 text-center space-y-5 shadow-[6px_6px_0px_0px_#000]">
          <div className="w-16 h-16 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center mx-auto text-black shadow-[3px_3px_0px_0px_#000]">
            <FileText className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-black text-black tracking-tight">
              Belum Ada Sesi Sidang Terpilih
            </h3>
            <p className="text-xs text-black/80 font-bold leading-relaxed">
              Silakan buat agenda baru, muat template resmi Panitia MPLS, atau ikuti panduan notulis pemula.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleCreateMplsMeeting()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FFE600] hover:bg-[#ffd93d] text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Muat Contoh Panitia MPLS 2026/2027</span>
            </button>
            <button
              onClick={openBeginnerGuide}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#38BDF8] text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Panduan Cepat Pemula</span>
            </button>
            <button
              onClick={() => router.push('/record')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B6B] text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Mulai Rekam Suara</span>
            </button>
            <button
              onClick={() => router.push('/arsip')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Buka Arsip Sidang</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
