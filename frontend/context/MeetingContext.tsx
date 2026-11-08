'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Meeting, AudioSegment } from '../lib/types';
import { synthesizeNotulenApi } from '../lib/api';

const STORAGE_KEY = 'notulenjmm_meetings_v2';

interface MeetingContextType {
  meetings: Meeting[];
  activeMeetingId: string | null;
  activeMeeting: Meeting | null;
  setActiveMeetingId: (id: string | null) => void;
  handleUpdateActiveMeeting: (updated: Meeting) => void;
  handleDeleteMeeting: (id: string, e?: React.MouseEvent) => void;
  handleSaveDraft: (draft: {
    title: string;
    secretaryNotes: string;
    durationSeconds: number;
    audioBlob?: Blob | null;
    audioUrl?: string | null;
  }) => string;
  handleDiarizationComplete: (
    segments: AudioSegment[],
    duration: number,
    meetingTitle?: string,
    secretaryNotes?: string,
    audioUrl?: string
  ) => Promise<string>;
  handleSynthesizeNotulen: (customNotes?: string) => Promise<void>;
  handleCreateNewMeeting: () => string;
  handleStartCraftSession: (session: {
    cardTitle: string;
    cardDescription: string;
    prompt: string;
    engine: string;
    destinationFolder: string;
    activeTab: string;
  }) => string;
  isRecording: boolean;
  isSynthesizing: boolean;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const [isRecording] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  // Hydrate from localStorage once on client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMeetings(parsed);
            setActiveMeetingId(parsed[0].id);
          }
        }
      } catch (e) {
        console.warn('Failed to parse stored meetings:', e);
      }
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync to localStorage only after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    } catch (e) {
      console.warn('Failed to store meetings in localStorage:', e);
    }
  }, [meetings, isHydrated]);

  const activeMeeting =
    meetings.find((m) => m.id === activeMeetingId) || (meetings.length > 0 ? meetings[0] : null);

  const handleUpdateActiveMeeting = (updated: Meeting) => {
    setMeetings((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMeeting = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    if (activeMeetingId === id) {
      const remaining = meetings.filter((m) => m.id !== id);
      setActiveMeetingId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleSaveDraft = (draft: {
    title: string;
    secretaryNotes: string;
    durationSeconds: number;
    audioBlob?: Blob | null;
    audioUrl?: string | null;
  }): string => {
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
    return draftId;
  };

  const handleDiarizationComplete = async (
    segments: AudioSegment[],
    duration: number,
    meetingTitle?: string,
    secretaryNotes?: string,
    audioUrl?: string
  ): Promise<string> => {
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

    setMeetings((prev) => [newMeet, ...prev]);
    setActiveMeetingId(newMeetId);

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

    return newMeetId;
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

  const handleCreateNewMeeting = (): string => {
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

    setMeetings((prev) => [newMeet, ...prev]);
    setActiveMeetingId(newMeet.id);
    return newMeet.id;
  };

  const handleStartCraftSession = (session: {
    cardTitle: string;
    cardDescription: string;
    prompt: string;
    engine: string;
    destinationFolder: string;
    activeTab: string;
  }): string => {
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

    setMeetings((prev) => [newMeet, ...prev]);
    setActiveMeetingId(newMeet.id);
    return newMeet.id;
  };

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        activeMeetingId,
        activeMeeting,
        setActiveMeetingId,
        handleUpdateActiveMeeting,
        handleDeleteMeeting,
        handleSaveDraft,
        handleDiarizationComplete,
        handleSynthesizeNotulen,
        handleCreateNewMeeting,
        handleStartCraftSession,
        isRecording,
        isSynthesizing,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeetings = (): MeetingContextType => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeetings must be used within a MeetingProvider');
  }
  return context;
};
