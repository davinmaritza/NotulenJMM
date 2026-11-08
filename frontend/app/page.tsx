'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { CraftStudioView } from '../components/CraftStudioView';
import { AudioRecorderStudio } from '../components/AudioRecorderStudio';
import { SpeakerDiarizationView } from '../components/SpeakerDiarizationView';
import { NotulenEditor } from '../components/NotulenEditor';
import { SystemIntegrationModal } from '../components/SystemIntegrationModal';
import { Meeting, AudioSegment } from '../lib/types';
import { synthesizeNotulenApi } from '../lib/api';
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
  Upload,
  Compass,
  FileCheck,
  Trash2,
  Menu,
} from 'lucide-react';

const STORAGE_KEY = 'notulenjmm_meetings_v2';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('craft');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse stored meetings:', e);
      }
    }
    return [];
  });
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id;
        }
      } catch {
        // ignore
      }
    }
    return null;
  });
  const [isRecording] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  // Save meetings to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    } catch (e) {
      console.warn('Failed to store meetings in localStorage:', e);
    }
  }, [meetings]);

  const activeMeeting =
    meetings.find((m) => m.id === activeMeetingId) || (meetings.length > 0 ? meetings[0] : null);

  const handleUpdateActiveMeeting = (updated: Meeting) => {
    setMeetings((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMeeting = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    if (activeMeetingId === id) {
      const remaining = meetings.filter((m) => m.id !== id);
      setActiveMeetingId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Save Voice Note / Meeting as Online Draft
  const handleSaveDraft = (draft: {
    title: string;
    secretaryNotes: string;
    durationSeconds: number;
    audioBlob?: Blob | null;
    audioUrl?: string | null;
  }) => {
    const draftId = `draft-${Date.now()}`;
    const timestamp =
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const newDraft: Meeting = {
      id: draftId,
      title: draft.title,
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      location: 'Ruang Sidang Majelis / Multimedia SMK Negeri 13 Bandung',
      organizer: 'MPK SMK Negeri 13 Bandung',
      status: 'DRAFT',
      durationSeconds: draft.durationSeconds,
      secretaryNotes: draft.secretaryNotes,
      formatStandard: 'TATA_NASKAH_DINAS',
      lastSavedAt: timestamp,
      audioUrl: draft.audioUrl || undefined,
      attendees: [
        { id: 'att-1', name: 'Davin Maritza', role: 'Leader', present: true },
        { id: 'att-2', name: 'Notulis Sidang', role: 'Note Taker', present: true },
      ],
      transcript: [],
      agendas: [
        {
          title: 'Draf Agenda Rapat',
          discussionPoints: [
            'Draf rekaman suara voice note tersimpan secara online.',
            `Catatan pengarah: ${draft.secretaryNotes.slice(0, 80)}...`,
          ],
        },
      ],
      decisions: [],
      actionItems: [],
    };

    setMeetings((prev) => [newDraft, ...prev]);
    setActiveMeetingId(draftId);
    setActiveTab('notulen');
  };

  const handleDiarizationComplete = async (
    segments: AudioSegment[],
    duration: number,
    meetingTitle?: string,
    secretaryNotes?: string,
    audioUrl?: string
  ) => {
    const title = meetingTitle?.trim() || 'Sidang Pleno MPK SMK Negeri 13 Bandung';
    const newMeetId = `meet-${Date.now()}`;
    const timestamp =
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const newMeet: Meeting = {
      id: newMeetId,
      title: title,
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      location: 'Ruang Sidang Majelis / Multimedia SMK Negeri 13 Bandung',
      organizer: 'MPK SMK Negeri 13 Bandung',
      status: 'TRANSCRIBING',
      durationSeconds: duration,
      secretaryNotes: secretaryNotes,
      formatStandard: 'TATA_NASKAH_DINAS',
      lastSavedAt: timestamp,
      audioUrl: audioUrl,
      attendees: [
        { id: 'att-1', name: 'Davin Maritza', role: 'Leader', present: true },
        { id: 'att-2', name: 'Notulis Sidang', role: 'Note Taker', present: true },
        { id: 'att-3', name: 'Perwakilan Komisi', role: 'Member', present: true },
      ],
      transcript: segments,
      agendas: [
        {
          title: 'Hasil Transkripsi & Verifikasi Suara Sidang',
          discussionPoints: segments.slice(0, 3).map((s) => `${s.speaker}: ${s.text.slice(0, 90)}...`),
        },
      ],
      decisions: [],
      actionItems: [],
    };

    // Add meeting, select it, switch to notulen tab
    setMeetings((prev) => [newMeet, ...prev]);
    setActiveMeetingId(newMeetId);
    setActiveTab('notulen');

    // Automatically trigger AI synthesis if transcript exists
    if (segments.length > 0) {
      setIsSynthesizing(true);
      try {
        const result = await synthesizeNotulenApi(
          title,
          segments,
          'MPK SMK Negeri 13 Bandung',
          secretaryNotes
        );

        const finalizedMeet: Meeting = {
          ...newMeet,
          status: 'FINALIZED',
          executiveSummary: result.executiveSummary,
          agendas: result.agendas.length > 0 ? result.agendas : newMeet.agendas,
          decisions: result.decisions,
          actionItems: result.actionItems,
          lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        };

        setMeetings((prev) => prev.map((m) => (m.id === newMeetId ? finalizedMeet : m)));
      } catch (err) {
        console.error('Automatic synthesis failed:', err);
      } finally {
        setIsSynthesizing(false);
      }
    }
  };

  const handleSynthesizeNotulen = async (customNotes?: string) => {
    if (!activeMeeting) return;
    setIsSynthesizing(true);

    try {
      const notesToUse = customNotes || activeMeeting.secretaryNotes;
      const result = await synthesizeNotulenApi(
        activeMeeting.title,
        activeMeeting.transcript,
        activeMeeting.organizer,
        notesToUse
      );

      const updatedMeeting: Meeting = {
        ...activeMeeting,
        status: 'FINALIZED',
        secretaryNotes: notesToUse,
        executiveSummary: result.executiveSummary,
        agendas: result.agendas.length > 0 ? result.agendas : activeMeeting.agendas,
        decisions: result.decisions.length > 0 ? result.decisions : activeMeeting.decisions,
        actionItems: result.actionItems.length > 0 ? result.actionItems : activeMeeting.actionItems,
        lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      };

      handleUpdateActiveMeeting(updatedMeeting);
    } catch (err: unknown) {
      console.error('Synthesis error:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCreateNewMeeting = () => {
    const newMeet: Meeting = {
      id: `meet-${Date.now()}`,
      title: 'Sidang Koordinasi Pengurus MPK SMK Negeri 13 Bandung',
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      location: 'Ruang Sidang Majelis / Multimedia SMK Negeri 13 Bandung',
      organizer: 'MPK SMK Negeri 13 Bandung',
      status: 'DRAFT',
      durationSeconds: 0,
      secretaryNotes:
        'Susun kata-kata secara formal dan lugas berstandar MPK SMK Negeri 13 Bandung. Tonjolkan keputusan resmi, alokasi anggaran dana jika ada, serta daftar penugasan PIC dan batas waktu.',
      formatStandard: 'TATA_NASKAH_DINAS',
      lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      attendees: [
        { id: 'att-1', name: 'Davin Maritza', role: 'Leader', present: true },
        { id: 'att-2', name: 'Notulis Sidang', role: 'Note Taker', present: true },
      ],
      transcript: [],
      agendas: [
        {
          title: 'Pembahasan Agenda Prioritas Majelis',
          discussionPoints: ['Pencatatan usulan dan pokok bahasan awal sidang.'],
        },
      ],
      decisions: [],
      actionItems: [],
    };

    setMeetings([newMeet, ...meetings]);
    setActiveMeetingId(newMeet.id);
    setActiveTab('record');
  };

  const handleStartCraftSession = (session: {
    cardTitle: string;
    cardDescription: string;
    prompt: string;
    engine: string;
    destinationFolder: string;
    activeTab: string;
  }) => {
    const newMeet: Meeting = {
      id: `meet-craft-${Date.now()}`,
      title: `${session.cardTitle}: ${session.prompt.slice(0, 45) || 'Sesi Sidang MPK'}`,
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      location: 'Ruang Sidang Majelis / Multimedia SMK Negeri 13 Bandung',
      organizer: 'MPK SMK Negeri 13 Bandung',
      status: 'DRAFT',
      durationSeconds: 0,
      secretaryNotes: session.prompt || 'Susunan formal risalah sidang.',
      formatStandard: 'TATA_NASKAH_DINAS',
      lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      attendees: [
        { id: 'att-1', name: 'Davin Maritza', role: 'Leader', present: true },
        { id: 'att-2', name: 'Notulis Sidang', role: 'Note Taker', present: true },
        { id: 'att-3', name: 'Peserta Sidang', role: 'Member', present: true },
      ],
      transcript: [
        {
          id: `seg-${Date.now()}`,
          speaker: 'Speaker 1 (Davin Maritza)',
          startTime: '00:00',
          endTime: '00:20',
          text: `Pembukaan ${session.cardTitle}. Pokok bahasan sidang: ${session.prompt}.`,
        },
      ],
      agendas: [
        {
          title: session.cardTitle,
          discussionPoints: [
            session.prompt || session.cardDescription,
            `Format persidangan: ${session.cardTitle}`,
            `Penanggung Jawab: Presidium Sidang MPK 13`,
          ],
        },
      ],
      decisions: [],
      actionItems: [],
    };

    setMeetings([newMeet, ...meetings]);
    setActiveMeetingId(newMeet.id);
    setActiveTab('notulen');
  };

  // Metrics
  const totalDecisions = meetings.reduce((acc, m) => acc + m.decisions.length, 0);
  const totalActionItems = meetings.reduce((acc, m) => acc + m.actionItems.length, 0);
  const completedActionItems = meetings.reduce(
    (acc, m) => acc + m.actionItems.filter((a) => a.status === 'COMPLETED').length,
    0
  );

  return (
    <div className="min-h-screen bg-[#07080a] text-[#f4f4f6] flex flex-col lg:flex-row antialiased selection:bg-white/10 selection:text-white">
      {/* Institutional Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRecording={isRecording}
        totalMeetingsCount={meetings.length}
        activeMeeting={activeMeeting}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Workspace to the Right of Sidebar */}
      <div className="flex-1 flex flex-col lg:pl-64 sm:lg:pl-72 min-w-0 min-h-screen">
        {/* Top Mobile Bar (visible only on mobile/tablet) */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#090a0f]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#13151d] border border-white/10 flex items-center justify-center text-white font-bold text-xs select-none">
              NJ
            </div>
            <div>
              <span className="font-semibold text-xs text-white">NotulenJMM</span>
              <span className="text-[10px] font-mono ml-1.5 px-1.5 py-0.2 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
                MPK 13
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsOpenMobile(true)}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 cursor-pointer"
            title="Buka Menu Navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Content Body */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
          {/* TAB 0: STUDIO AGENDA */}
          {activeTab === 'craft' && (
            <CraftStudioView onStartSession={handleStartCraftSession} />
          )}

          {/* TAB 1: ARSIP SIDANG (DASHBOARD) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Linear-Tier Editorial KPI Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="bg-[#0e0f14] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-lg space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">Total Sesi Sidang</span>
                    <FileText className="w-4 h-4 text-zinc-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-semibold font-mono text-white tracking-tight">{meetings.length}</p>
                  <p className="text-[11px] text-zinc-500 font-mono">Terdokumentasi resmi</p>
                </div>

                <div className="bg-[#0e0f14] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-lg space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">Ketetapan Pleno</span>
                    <Scale className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-semibold font-mono text-white tracking-tight">{totalDecisions}</p>
                  <p className="text-[11px] text-emerald-400/90 font-mono">100% Disahkan Forum</p>
                </div>

                <div className="bg-[#0e0f14] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-lg space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">Penugasan Komisi</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-semibold font-mono text-white tracking-tight">
                    {completedActionItems} <span className="text-base text-zinc-500 font-normal">/ {totalActionItems}</span>
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono">Komitmen terealisasi</p>
                </div>

                <div className="bg-[#0e0f14] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-lg space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">Format Risalah</span>
                    <FileCheck className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-white tracking-tight truncate">
                    Tata Naskah Dinas
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono truncate">Berita Acara &amp; Salinan SK</p>
                </div>
              </div>

              {/* Meeting List Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">Arsip Notulen &amp; Draf Sidang</h2>
                  <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                    Dokumen resmi persidangan &amp; draf aktif Majelis Perwakilan Kelas SMK Negeri 13 Bandung
                  </p>
                </div>

                <button
                  onClick={handleCreateNewMeeting}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 rounded-xl text-xs font-semibold shadow-md hover:bg-zinc-200 active:scale-[0.985] transition-all shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  Buat Sesi Sidang Baru
                </button>
              </div>

              {/* Empty State vs Meeting Cards List */}
              {meetings.length === 0 ? (
                <div className="bg-[#0e0f14] border border-dashed border-white/[0.12] rounded-3xl p-10 sm:p-14 text-center space-y-5 shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">Belum Ada Sesi Sidang Tersimpan</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Sistem siap merekam voice note sekretaris dan merumuskan risalah sidang. Silakan rekam suara sidang atau unggah berkas audio di Studio.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('record')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-950 rounded-xl text-xs font-bold shadow-md hover:bg-zinc-200 active:scale-[0.985] transition-all cursor-pointer"
                    >
                      <Mic className="w-4 h-4 text-rose-500" />
                      <span>Rekam Voice Note Sidang</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('craft')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#14161f] hover:bg-zinc-800 text-zinc-200 border border-white/10 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Compass className="w-4 h-4 text-sky-400" />
                      <span>Buka Studio Agenda</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {meetings.map((meet) => (
                    <div
                      key={meet.id}
                      onClick={() => {
                        setActiveMeetingId(meet.id);
                        setActiveTab('notulen');
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer bg-[#0e0f14] active:scale-[0.99] ${
                        meet.id === activeMeetingId
                          ? 'border-sky-500/80 shadow-[0_4px_20px_-4px_rgba(14,165,233,0.12)] ring-1 ring-sky-500/30'
                          : 'border-white/[0.06] hover:border-white/15 hover:bg-[#14161f]'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                                meet.status === 'FINALIZED'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : meet.status === 'DRAFT'
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/25 font-semibold'
                                  : meet.status === 'TRANSCRIBING'
                                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                  : 'bg-zinc-900 text-zinc-400 border-white/[0.06]'
                              }`}
                            >
                              {meet.status === 'DRAFT' ? 'DRAF ONLINE' : meet.status}
                            </span>
                            {meet.lastSavedAt && (
                              <span className="text-[10px] font-mono text-zinc-400">
                                Disimpan: {meet.lastSavedAt}
                              </span>
                            )}
                            <span className="text-[11px] text-zinc-600 font-mono">ID: {meet.id}</span>
                          </div>

                          <h3 className="text-sm font-semibold text-white tracking-tight">{meet.title}</h3>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-mono text-[11px]">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                              {meet.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-zinc-500" />
                              {meet.attendees.length} Peserta
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-zinc-500" />
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
                            className="px-3 py-1.5 bg-[#14161f] hover:bg-zinc-800 text-zinc-300 border border-white/[0.06] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Mic className="w-3.5 h-3.5 text-rose-400" />
                            Rekam
                          </button>
                          <button className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/10 cursor-pointer">
                            <span>{meet.status === 'DRAFT' ? 'Lanjutkan Draf' : 'Buka Risalah'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteMeeting(meet.id, e)}
                            title="Hapus Sesi / Draf Sidang"
                            className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STUDIO REKAM VOICE NOTE */}
          {activeTab === 'record' && (
            <div className="space-y-6">
              <AudioRecorderStudio
                onDiarizationComplete={handleDiarizationComplete}
                onSaveDraft={handleSaveDraft}
              />
            </div>
          )}

          {/* TAB 3: NOTULEN & TRANSKRIPSI */}
          {activeTab === 'notulen' && (
            <div className="space-y-8">
              {activeMeeting ? (
                <>
                  <SpeakerDiarizationView
                    transcript={activeMeeting.transcript}
                    onUpdateTranscript={(updated) => handleUpdateActiveMeeting({ ...activeMeeting, transcript: updated })}
                    onSynthesizeNotulen={handleSynthesizeNotulen}
                    isSynthesizing={isSynthesizing}
                    initialSecretaryNotes={activeMeeting.secretaryNotes}
                  />

                  <NotulenEditor meeting={activeMeeting} onUpdateMeeting={handleUpdateActiveMeeting} />
                </>
              ) : (
                <div className="bg-[#0e0f14] border border-dashed border-white/[0.12] rounded-3xl p-10 sm:p-14 text-center space-y-5 shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">Belum Ada Sesi Sidang Terpilih</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Silakan unggah rekaman audio sekretaris di tab &quot;Studio Voice Note&quot; atau mulai sesi baru untuk melihat risalah dan transkripsi.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('record')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-950 rounded-xl text-xs font-bold shadow-md hover:bg-zinc-200 active:scale-[0.985] transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Unggah Berkas Audio</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACTION ITEMS & KEPUTUSAN */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              {activeMeeting ? (
                <NotulenEditor meeting={activeMeeting} onUpdateMeeting={handleUpdateActiveMeeting} />
              ) : (
                <div className="bg-[#0e0f14] border border-dashed border-white/[0.12] rounded-3xl p-10 sm:p-14 text-center space-y-5 shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
                    <CheckCircle2 className="w-8 h-8 text-amber-400" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">Belum Ada Tindak Lanjut Terbuka</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Penugasan komisi dan ketetapan hukum majelis akan muncul di sini setelah sesi sidang dirumuskan.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('record')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-950 rounded-xl text-xs font-bold shadow-md hover:bg-zinc-200 active:scale-[0.985] transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Mulai dengan Unggah Audio</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: STATUS SISTEM */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              <SystemIntegrationModal />
            </div>
          )}
        </main>

        {/* Institutional Footer */}
        <footer className="mt-auto border-t border-white/[0.06] bg-[#07080a] py-6 text-center text-xs text-zinc-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono">
            <p>
              NotulenJMM • Hak Cipta &copy; 2026 <strong>MPK SMK Negeri 13 Bandung</strong>. Karya <strong>Davin Maritza</strong>.
            </p>
            <div className="flex items-center gap-3 text-zinc-500">
              <span>Tata Naskah Dinas Digital</span>
              <span>•</span>
              <span>Web &amp; Android APK</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
