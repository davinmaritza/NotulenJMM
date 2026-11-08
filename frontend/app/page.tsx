'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
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
  Activity,
  Upload,
  Compass,
} from 'lucide-react';

const STORAGE_KEY = 'notulenjmm_meetings_v2';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('craft');
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

  const handleDiarizationComplete = async (
    segments: AudioSegment[],
    duration: number,
    meetingTitle?: string,
    secretaryNotes?: string
  ) => {
    const title = meetingTitle?.trim() || 'Sesi Rapat MPK SMK Negeri 13 Bandung';
    const newMeetId = `meet-${Date.now()}`;

    const newMeet: Meeting = {
      id: newMeetId,
      title: title,
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      location: 'Ruang Multimedia / OSIS SMK Negeri 13 Bandung',
      organizer: 'MPK SMK Negeri 13 Bandung',
      status: 'TRANSCRIBING',
      durationSeconds: duration,
      secretaryNotes: secretaryNotes,
      attendees: [
        { id: 'att-1', name: 'Davin Maritza', role: 'Leader', present: true },
        { id: 'att-2', name: 'Notulis MPK', role: 'Note Taker', present: true },
        { id: 'att-3', name: 'Peserta Majelis', role: 'Member', present: true },
      ],
      transcript: segments,
      agendas: [
        {
          title: 'Hasil Transkripsi & Diarisasi Suara',
          discussionPoints: segments.slice(0, 3).map((s) => `${s.speaker}: ${s.text.slice(0, 80)}...`),
        },
      ],
      decisions: [],
      actionItems: [],
    };

    // Add meeting, select it, switch to notulen tab
    setMeetings((prev) => [newMeet, ...prev]);
    setActiveMeetingId(newMeetId);
    setActiveTab('notulen');

    // Automatically trigger 9Router AI synthesis if transcript exists
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
      title: 'Rapat Koordinasi Pengurus MPK SMK Negeri 13 Bandung Baru',
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      location: 'Ruang Multimedia / OSIS SMK Negeri 13 Bandung',
      organizer: 'MPK SMK Negeri 13 Bandung',
      status: 'DRAFT',
      durationSeconds: 0,
      secretaryNotes:
        'Susun kata-kata secara formal dan lugas berstandar MPK SMK Negeri 13 Bandung. Tonjolkan keputusan resmi, alokasi anggaran dana jika ada, serta daftar penugasan PIC dan batas waktu.',
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
      title: `${session.cardTitle}: ${session.prompt.slice(0, 45) || 'Sesi Rapat MPK'}`,
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      location: 'Ruang Multimedia / OSIS SMK Negeri 13 Bandung',
      organizer: 'MPK SMK Negeri 13 Bandung',
      status: 'DRAFT',
      durationSeconds: 0,
      secretaryNotes: session.prompt || 'Susunan formal risalah rapat.',
      attendees: [
        { id: 'att-1', name: 'Davin Maritza', role: 'Leader', present: true },
        { id: 'att-2', name: 'Notulis MPK', role: 'Note Taker', present: true },
        { id: 'att-3', name: 'Peserta Majelis', role: 'Member', present: true },
      ],
      transcript: [
        {
          id: `seg-${Date.now()}`,
          speaker: 'Speaker 1 (Davin Maritza)',
          startTime: '00:00',
          endTime: '00:20',
          text: `Pembukaan ${session.cardTitle}. Pokok bahasan rapat: ${session.prompt}.`,
        },
      ],
      agendas: [
        {
          title: session.cardTitle,
          discussionPoints: [
            session.prompt || session.cardDescription,
            `Format agenda: ${session.cardTitle}`,
            `AI Engine: ${session.engine}`,
            `Folder Simpan: ${session.destinationFolder}`,
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
    <div className="min-h-screen bg-[#090a0f] text-[#f4f4f6] flex flex-col antialiased selection:bg-white/10 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isRecording={isRecording} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* TAB 0: CRAFT STUDIO */}
        {activeTab === 'craft' && (
          <CraftStudioView onStartSession={handleStartCraftSession} />
        )}

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Asymmetrical Bento KPI Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-[#111318] border border-white/[0.06] rounded-2xl p-4 sm:p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Total Sesi Rapat</span>
                  <FileText className="w-4 h-4 text-zinc-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">{meetings.length}</p>
                <p className="text-[11px] text-zinc-500 font-mono">Terdokumentasi resmi</p>
              </div>

              <div className="bg-[#111318] border border-white/[0.06] rounded-2xl p-4 sm:p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Ketetapan Hukum</span>
                  <Scale className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">{totalDecisions}</p>
                <p className="text-[11px] text-emerald-400/90 font-mono">100% Disahkan Forum</p>
              </div>

              <div className="bg-[#111318] border border-white/[0.06] rounded-2xl p-4 sm:p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Tindak Lanjut (Aksi)</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  {completedActionItems} <span className="text-base text-zinc-500 font-normal">/ {totalActionItems}</span>
                </p>
                <p className="text-[11px] text-zinc-500 font-mono">Tugas terselesaikan</p>
              </div>

              <div className="bg-[#111318] border border-white/[0.06] rounded-2xl p-4 sm:p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Mesin AI Aktif</span>
                  <Activity className="w-4 h-4 text-sky-400" />
                </div>
                <p className="text-base sm:text-lg font-bold font-mono text-white tracking-tight truncate">
                  9Router Gateway
                </p>
                <p className="text-[11px] text-zinc-500 font-mono truncate">ag/gemini-3.8-flash</p>
              </div>
            </div>

            {/* Meeting List Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Daftar Sesi Notula &amp; Majelis</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Arsip dokumen rapat MPK SMK Negeri 13 Bandung dengan transkripsi terverifikasi
                </p>
              </div>

              <button
                onClick={handleCreateNewMeeting}
                className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 rounded-xl text-xs font-semibold shadow-md hover:bg-zinc-200 active:scale-[0.98] transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                Buat Sesi Rapat Baru
              </button>
            </div>

            {/* Empty State vs Meeting Cards List */}
            {meetings.length === 0 ? (
              <div className="bg-[#111318] border border-dashed border-white/[0.12] rounded-3xl p-10 sm:p-14 text-center space-y-5 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
                  <FileText className="w-8 h-8 text-zinc-500" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-white tracking-tight">Belum Ada Sesi Rapat Tersimpan</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Sistem bekerja dengan data riil sekretaris (seluruh dummy data telah dibersihkan). Silakan unggah rekaman audio rapat atau mulai sesi di Craft Studio.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('record')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-950 rounded-xl text-xs font-bold shadow-md hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Unggah Audio Sekretaris</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('craft')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-sky-400" />
                    <span>Buka Craft Studio</span>
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
                    className={`p-5 rounded-2xl border transition-all cursor-pointer bg-[#111318] active:scale-[0.99] ${
                      meet.id === activeMeetingId
                        ? 'border-sky-500/80 shadow-[0_4px_20px_-4px_rgba(14,165,233,0.12)] ring-1 ring-sky-500/30'
                        : 'border-white/[0.06] hover:border-white/15 hover:bg-[#151722]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-md border ${
                              meet.status === 'FINALIZED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : meet.status === 'TRANSCRIBING'
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                : 'bg-zinc-900 text-zinc-400 border-white/[0.06]'
                            }`}
                          >
                            {meet.status}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-mono">ID: {meet.id}</span>
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
                          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/[0.06] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Mic className="w-3.5 h-3.5 text-rose-400" />
                          Rekam
                        </button>
                        <button className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/10 cursor-pointer">
                          <span>Buka Notulen</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <div className="bg-[#111318] border border-dashed border-white/[0.12] rounded-3xl p-10 sm:p-14 text-center space-y-5 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
                  <FileText className="w-8 h-8 text-zinc-500" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-white tracking-tight">Belum Ada Sesi Rapat Terpilih</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Silakan unggah rekaman audio sekretaris di tab &quot;Studio Rekam&quot; atau mulai sesi baru untuk melihat notulensi dan transkripsi.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('record')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-950 rounded-xl text-xs font-bold shadow-md hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Unggah Audio Sekretaris</span>
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
              <div className="bg-[#111318] border border-dashed border-white/[0.12] rounded-3xl p-10 sm:p-14 text-center space-y-5 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
                  <CheckCircle2 className="w-8 h-8 text-amber-400" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-white tracking-tight">Belum Ada Tindak Lanjut Terbuka</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Penugasan action items dan ketetapan hukum majelis akan muncul di sini setelah sesi rapat dirumuskan.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('record')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-950 rounded-xl text-xs font-bold shadow-md hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Mulai dengan Unggah Audio</span>
                  </button>
                </div>
              </div>
            )}
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
      <footer className="mt-auto border-t border-white/[0.06] bg-[#090a0f] py-6 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono">
          <p>
            NotulenJMM • Hak Cipta &copy; 2026 <strong>MPK SMK Negeri 13 Bandung</strong>. Karya <strong>Davin Maritza</strong>.
          </p>
          <div className="flex items-center gap-3 text-zinc-500">
            <span>Microsoft VibeVoice</span>
            <span>•</span>
            <span>9Router Gateway</span>
            <span>•</span>
            <span>Capacitor Android</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
