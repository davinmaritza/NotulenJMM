'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { AudioRecorderStudio } from '../components/AudioRecorderStudio';
import { SpeakerDiarizationView } from '../components/SpeakerDiarizationView';
import { NotulenEditor } from '../components/NotulenEditor';
import { SystemIntegrationModal } from '../components/SystemIntegrationModal';
import { INITIAL_MEETINGS } from '../lib/mockData';
import { Meeting, AudioSegment } from '../lib/types';
import {
  FileText,
  Mic,
  CheckCircle2,
  Scale,
  Clock,
  Plus,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [activeMeetingId, setActiveMeetingId] = useState<string>(INITIAL_MEETINGS[0].id);
  const [isRecording] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const activeMeeting = meetings.find((m) => m.id === activeMeetingId) || meetings[0];

  const handleUpdateActiveMeeting = (updated: Meeting) => {
    setMeetings((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDiarizationComplete = (segments: AudioSegment[], duration: number) => {
    const updatedMeeting: Meeting = {
      ...activeMeeting,
      status: 'TRANSCRIBING',
      durationSeconds: (activeMeeting.durationSeconds || 0) + duration,
      transcript: [...activeMeeting.transcript, ...segments],
    };

    handleUpdateActiveMeeting(updatedMeeting);
    setActiveTab('notulen');
  };

  const handleSynthesizeNotulen = () => {
    setIsSynthesizing(true);

    // Simulate 9router LLM processing
    setTimeout(() => {
      const updatedMeeting: Meeting = {
        ...activeMeeting,
        status: 'FINALIZED',
        executiveSummary:
          'Rapat koordinasi dan evaluasi MPK SMK Negeri 13 Bandung menetapkan kesiapan pelaksanaan program kerja tengah semester dan LDKS 2026. Alokasi anggaran disetujui, pembagian penugasan koordinator disahkan, dan gladi bersih dijadwalkan H-2.',
        agendas: [
          {
            title: 'Evaluasi Program Kerja Tengah Semester',
            discussionPoints: [
              'Seluruh komisi melaporkan capaian target kerja telah mencapai 90%.',
              'Sistem NotulenJMM telah resmi digunakan untuk standardisasi seluruh arsip rapat.',
            ],
          },
          {
            title: 'Penetapan Teknis LDKS 2026 & Simulasi Sidang',
            discussionPoints: [
              'Izin ruang aula dan sarana telah dikonfirmasi disetujui.',
              'Modul simulasi persidangan siswa parlemen masuk ke dalam kurikulum wajib.',
            ],
          },
        ],
        decisions: [
          ...activeMeeting.decisions,
          {
            id: `dec-${Date.now()}`,
            number: `KEP/003/MPK-13/XI/2026`,
            decisionText: 'Jadwal Gladi Bersih LDKS 2026 disepakati pada H-2 tanggal 26 November 2026.',
            rationale: 'Memastikan seluruh perangkat audio dan narasumber telah siap.',
            category: 'Program Kerja',
            status: 'DISAHKAN',
            date: '2026-11-07',
          },
        ],
        actionItems: [
          ...activeMeeting.actionItems,
          {
            id: `act-${Date.now()}`,
            description: 'Kirim surat konfirmasi narasumber eksternal LDKS 2026',
            assignee: 'Siti Rahmawati (Sekretaris)',
            dueDate: '2026-11-12',
            status: 'PENDING',
          },
        ],
      };

      handleUpdateActiveMeeting(updatedMeeting);
      setIsSynthesizing(false);
    }, 2000);
  };

  const handleCreateNewMeeting = () => {
    const newMeet: Meeting = {
      id: `meet-${Date.now()}`,
      title: 'Rapat Koordinasi Pengurus MPK SMK Negeri 13 Bandung Baru',
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      location: 'Ruang Multimedia / OSIS SMK Negeri 13 Bandung',
      organizer: 'MPK SMK Negeri 13 Bandung',
      status: 'DRAFT',
      durationSeconds: 0,
      attendees: [
        { id: 'att-1', name: 'Davin Maritza', role: 'Leader', present: true },
        { id: 'att-2', name: 'Notulis MPK', role: 'Note Taker', present: true },
      ],
      transcript: [],
      agendas: [
        {
          title: 'Pembahasan Agenda Prioritas',
          discussionPoints: ['Pencatatan poin-poin awal rapat.'],
        },
      ],
      decisions: [],
      actionItems: [],
    };

    setMeetings([newMeet, ...meetings]);
    setActiveMeetingId(newMeet.id);
    setActiveTab('record');
  };

  // Metrics
  const totalDecisions = meetings.reduce((acc, m) => acc + m.decisions.length, 0);
  const totalActionItems = meetings.reduce((acc, m) => acc + m.actionItems.length, 0);
  const completedActionItems = meetings.reduce(
    (acc, m) => acc + m.actionItems.filter((a) => a.status === 'COMPLETED').length,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isRecording={isRecording} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Hero / Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Rapat</span>
                  <FileText className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">{meetings.length}</p>
                <p className="text-[11px] text-slate-500">Sesi rapat terdokumentasi</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Keputusan Resmi</span>
                  <Scale className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">{totalDecisions}</p>
                <p className="text-[11px] text-emerald-400/80 font-medium">100% Keputusan Disahkan</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Action Items</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {completedActionItems}/{totalActionItems}
                </p>
                <p className="text-[11px] text-slate-500">Tugas tindak lanjut selesai</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Speech & AI</span>
                  <Sparkles className="w-4 h-4 text-violet-400" />
                </div>
                <p className="text-lg font-bold text-white tracking-tight truncate">VibeVoice + 9Router</p>
                <p className="text-[11px] text-violet-400/80 font-medium">MPK SMK Negeri 13 Bandung</p>
              </div>
            </div>

            {/* Meeting List Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Daftar Sesi Rapat</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pilih rapat untuk meninjau transkripsi audio, notula, atau memulai rekaman baru
                </p>
              </div>

              <button
                onClick={handleCreateNewMeeting}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                Mulai Sesi Rapat Baru
              </button>
            </div>

            {/* Meeting Cards List */}
            <div className="space-y-4">
              {meetings.map((meet) => (
                <div
                  key={meet.id}
                  onClick={() => {
                    setActiveMeetingId(meet.id);
                    setActiveTab('notulen');
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-slate-900 hover:border-indigo-500/50 hover:shadow-xl ${
                    meet.id === activeMeetingId ? 'border-indigo-500 ring-1 ring-indigo-500/30' : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                            meet.status === 'FINALIZED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : meet.status === 'TRANSCRIBING'
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {meet.status}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">ID: {meet.id}</span>
                      </div>

                      <h3 className="text-base font-bold text-white tracking-tight">{meet.title}</h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {meet.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          {meet.attendees.length} Peserta
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {Math.floor(meet.durationSeconds / 60)} Menit Audio
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMeetingId(meet.id);
                          setActiveTab('record');
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Mic className="w-3.5 h-3.5 text-rose-400" />
                        Rekam
                      </button>
                      <button className="px-3.5 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1">
                        Buka Notulen
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: STUDIO REKAM */}
        {activeTab === 'record' && (
          <div className="space-y-6">
            <AudioRecorderStudio onDiarizationComplete={handleDiarizationComplete} />
          </div>
        )}

        {/* TAB 3: NOTULEN & TRANSKRIPSI */}
        {activeTab === 'notulen' && (
          <div className="space-y-8">
            <SpeakerDiarizationView
              transcript={activeMeeting.transcript}
              onUpdateTranscript={(updated) => handleUpdateActiveMeeting({ ...activeMeeting, transcript: updated })}
              onSynthesizeNotulen={handleSynthesizeNotulen}
              isSynthesizing={isSynthesizing}
            />

            <NotulenEditor meeting={activeMeeting} onUpdateMeeting={handleUpdateActiveMeeting} />
          </div>
        )}

        {/* TAB 4: ACTION ITEMS & KEPUTUSAN */}
        {activeTab === 'actions' && (
          <div className="space-y-6">
            <NotulenEditor meeting={activeMeeting} onUpdateMeeting={handleUpdateActiveMeeting} />
          </div>
        )}

        {/* TAB 5: INTEGRASI & SISTEM */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            <SystemIntegrationModal />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          NotulenJMM • Hak Cipta &copy; 2026 <strong>MPK SMK Negeri 13 Bandung</strong>. Diciptakan oleh{' '}
          <strong>Davin Maritza</strong>.
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Didukung oleh Microsoft VibeVoice (ASR & Diarization) dan 9Router (OpenAI-compatible LLM Gateway).
        </p>
      </footer>
    </div>
  );
}
