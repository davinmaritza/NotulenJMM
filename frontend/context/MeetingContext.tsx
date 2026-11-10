'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Meeting, AudioSegment, HistoryLog, GoogleDriveAccount, isUserAdmin, ADMIN_EMAILS, UserRole } from '../lib/types';
import { synthesizeNotulenApi } from '../lib/api';
import { createMplsMeetingTemplate, OFFICIAL_MEETING_TEMPLATES } from '../lib/meetingTemplates';
import { formatIndonesianDateTime } from '../lib/indonesianDate';
import {
  upsertUserOnLogin,
  isUserSuspended,
  getUserRole,
  USERS_UPDATED_EVENT,
} from '../lib/userManager';
import {
  getStoredGoogleAccount,
  saveStoredGoogleAccount,
  clearStoredGoogleAccount,
  getStoredHistoryLogs,
  addHistoryLog,
  getGoogleClientId,
  requestGoogleAccessToken,
  uploadBackupToGoogleDrive,
  fetchGoogleUserProfile,
  exportMeetingToGoogleDoc,
} from '../lib/googleDriveBackup';

const STORAGE_KEY = 'notulenjmm_meetings_v2';

interface MeetingContextType {
  meetings: Meeting[];
  activeMeetingId: string | null;
  activeMeeting: Meeting | null;
  setActiveMeetingId: (id: string | null) => void;
  handleUpdateActiveMeeting: (updated: Meeting) => void;
  handleDeleteMeeting: (id: string, e?: React.MouseEvent) => void;
  handleArchiveMeeting: (id: string) => void;
  handleUnarchiveMeeting: (id: string) => void;
  handleRestoreBackup: (restoredMeetings: Meeting[]) => void;
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
  handleCreateMplsMeeting: () => string;
  handleCreateTemplateMeeting: (templateId: string) => string;
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
  isAutoSyncing: boolean;
  lastAutoSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  isHydrated: boolean;
  historyLogs: HistoryLog[];
  googleAccount: GoogleDriveAccount;
  setGoogleAccount: (acc: GoogleDriveAccount) => void;
  refreshHistoryLogs: () => void;
  handleToggleAutoSync: (enabled: boolean) => void;
  handleTriggerManualSync: () => Promise<void>;
  handleLoginGoogle: (fallbackEmail?: string) => Promise<void>;
  handleLoginWithEmail: (email: string, name?: string) => void;
  handleLogoutGoogle: () => void;
  handleExportGoogleDoc: (targetMeeting: Meeting) => Promise<{ docId: string; docUrl: string; title: string }>;
  isBeginnerGuideOpen: boolean;
  setIsBeginnerGuideOpen: (open: boolean) => void;
  openBeginnerGuide: () => void;
  closeBeginnerGuide: () => void;
  isBeginnerMode: boolean;
  setIsBeginnerMode: (enabled: boolean) => void;
  isAdmin: boolean;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const [isRecording] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [googleAccount, setGoogleAccountState] = useState<GoogleDriveAccount>({ connected: false });
  const [isAutoSyncing, setIsAutoSyncing] = useState<boolean>(false);
  const [lastAutoSyncStatus, setLastAutoSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const [isBeginnerGuideOpen, setIsBeginnerGuideOpen] = useState<boolean>(false);
  const [isBeginnerMode, setIsBeginnerModeState] = useState<boolean>(true);

  const isAdmin = Boolean(
    googleAccount.connected &&
      googleAccount.email?.trim().toLowerCase() === 'alfarrezald@gmail.com'
  );

  const openBeginnerGuide = () => setIsBeginnerGuideOpen(true);
  const closeBeginnerGuide = () => setIsBeginnerGuideOpen(false);
  const setIsBeginnerMode = (enabled: boolean) => {
    setIsBeginnerModeState(enabled);
    try {
      localStorage.setItem('notulenjmm_beginner_mode', String(enabled));
    } catch {}
  };

  const autoSyncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const meetingsRef = useRef<Meeting[]>(meetings);

  useEffect(() => {
    meetingsRef.current = meetings;
  }, [meetings]);

  const setGoogleAccount = (acc: GoogleDriveAccount) => {
    setGoogleAccountState(acc);
    saveStoredGoogleAccount(acc);
  };

  const refreshHistoryLogs = useCallback(() => {
    setHistoryLogs(getStoredHistoryLogs());
  }, []);

  // Background Google Drive Auto-Sync executor
  const performDriveSync = useCallback(
    async (meetingsToSync: Meeting[], silentAuth = true) => {
      const storedAccount = getStoredGoogleAccount();
      if (!storedAccount.connected) return;
      if (storedAccount.autoSyncEnabled === false && silentAuth) return;

      const clientId = getGoogleClientId();
      if (!clientId) return;

      let token = storedAccount.accessToken;

      // If user is in direct email session mode without an OAuth token,
      // skip background Drive API uploads without triggering silent popup attempts.
      if (!token && silentAuth) {
        return;
      }

      const isTokenExpired =
        !token || !storedAccount.tokenExpiresAt || Date.now() >= storedAccount.tokenExpiresAt - 60000;

      if (isTokenExpired) {
        if (!token && silentAuth) {
          return;
        }
        try {
          token = await requestGoogleAccessToken(clientId, silentAuth);
          const updatedAcc: GoogleDriveAccount = {
            ...storedAccount,
            accessToken: token,
            tokenExpiresAt: Date.now() + 3500 * 1000,
          };
          setGoogleAccountState(updatedAcc);
          saveStoredGoogleAccount(updatedAcc);
        } catch (authErr) {
          if (silentAuth) {
            // Silently stop background refresh when popup/cookies are constrained
            setLastAutoSyncStatus('idle');
            return;
          }
          console.warn('Google Drive token refresh failed:', authErr);
          setLastAutoSyncStatus('error');
          return;
        }
      }

      if (!token) return;

      setIsAutoSyncing(true);
      setLastAutoSyncStatus('syncing');

      try {
        const res = await uploadBackupToGoogleDrive(token, meetingsToSync);
        const nowIso = res.modifiedTime || new Date().toISOString();
        const updatedAcc: GoogleDriveAccount = {
          ...storedAccount,
          accessToken: token,
          lastSyncTime: nowIso,
        };
        setGoogleAccountState(updatedAcc);
        saveStoredGoogleAccount(updatedAcc);
        setLastAutoSyncStatus('synced');
        setHistoryLogs(getStoredHistoryLogs());
      } catch (uploadErr) {
        console.warn('Auto-sync to Google Drive failed:', uploadErr);
        setLastAutoSyncStatus('error');
      } finally {
        setIsAutoSyncing(false);
      }
    },
    []
  );

  // Hydrate from localStorage once on client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized = parsed.map((m: Meeting) =>
              m.secretaryNotes?.includes('Susun kata-kata secara formal')
                ? { ...m, secretaryNotes: '' }
                : m
            );
            setMeetings(sanitized);
            setActiveMeetingId(sanitized[0].id);
          }
        }
        const storedAcc = getStoredGoogleAccount();
        if (storedAcc.connected && storedAcc.email) {
          const isSuperAdminEmail = storedAcc.email.trim().toLowerCase() === 'alfarrezald@gmail.com';
          if (isSuperAdminEmail) {
            storedAcc.role = 'SUPERADMIN';
            storedAcc.isAdmin = true;
            storedAcc.isSuspended = false;
          } else {
            storedAcc.isAdmin = false;
            storedAcc.isSuspended = isUserSuspended(storedAcc.email);
            storedAcc.role = (getUserRole(storedAcc.email) === 'SUPERADMIN' ? 'NOTULIS' : getUserRole(storedAcc.email)) as UserRole;
          }
        }
        setGoogleAccountState(storedAcc);
        setHistoryLogs(getStoredHistoryLogs());
        const savedBeginnerMode = localStorage.getItem('notulenjmm_beginner_mode');
        if (savedBeginnerMode !== null) {
          setIsBeginnerModeState(savedBeginnerMode === 'true');
        }
      } catch (e) {
        console.warn('Failed to parse stored meetings:', e);
      }
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Listen for real-time user management updates (activation/suspension/role changes)
  useEffect(() => {
    const handleUsersUpdated = () => {
      setGoogleAccountState((prev) => {
        if (!prev.connected || !prev.email) return prev;
        const suspended = isUserSuspended(prev.email);
        const role = getUserRole(prev.email) as UserRole;
        if (prev.isSuspended !== suspended || prev.role !== role) {
          return {
            ...prev,
            isSuspended: suspended,
            role,
          };
        }
        return prev;
      });
    };

    window.addEventListener(USERS_UPDATED_EVENT, handleUsersUpdated);
    window.addEventListener('storage', handleUsersUpdated);
    return () => {
      window.removeEventListener(USERS_UPDATED_EVENT, handleUsersUpdated);
      window.removeEventListener('storage', handleUsersUpdated);
    };
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

  // Debounced Auto-Sync triggered whenever meetings change
  useEffect(() => {
    if (!isHydrated || meetings.length === 0) return;
    if (!googleAccount.connected || googleAccount.autoSyncEnabled === false) return;

    if (autoSyncTimerRef.current) {
      clearTimeout(autoSyncTimerRef.current);
    }

    autoSyncTimerRef.current = setTimeout(() => {
      performDriveSync(meetingsRef.current, true);
    }, 4000);

    return () => {
      if (autoSyncTimerRef.current) {
        clearTimeout(autoSyncTimerRef.current);
      }
    };
  }, [meetings, isHydrated, googleAccount.connected, googleAccount.autoSyncEnabled, performDriveSync]);

  // Periodic heartbeat sync every 5 minutes if account is connected
  useEffect(() => {
    if (!isHydrated) return;
    const interval = setInterval(() => {
      const acc = getStoredGoogleAccount();
      if (acc.connected && acc.autoSyncEnabled !== false && meetingsRef.current.length > 0) {
        performDriveSync(meetingsRef.current, true);
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isHydrated, performDriveSync]);

  const handleToggleAutoSync = (enabled: boolean) => {
    const updated: GoogleDriveAccount = {
      ...googleAccount,
      autoSyncEnabled: enabled,
    };
    setGoogleAccountState(updated);
    saveStoredGoogleAccount(updated);
    if (enabled && googleAccount.connected) {
      performDriveSync(meetingsRef.current, false);
    }
  };

  const handleTriggerManualSync = async () => {
    await performDriveSync(meetingsRef.current, false);
  };

  const handleLoginGoogle = async (fallbackEmail?: string) => {
    const clientId = getGoogleClientId();
    if (!clientId) {
      if (fallbackEmail) {
        handleLoginWithEmail(fallbackEmail);
      } else {
        throw new Error('Google Client ID belum diatur di sistem atau file .env.local.');
      }
      return;
    }
    try {
      const token = await requestGoogleAccessToken(clientId, false);
      const profile = await fetchGoogleUserProfile(token);
      const managedUser = upsertUserOnLogin(profile.email, profile.name, profile.picture);
      const isSuperAdmin = isUserAdmin(profile.email);
      const isSuspended = managedUser.status === 'SUSPENDED';

      const newAccount: GoogleDriveAccount = {
        connected: true,
        email: profile.email,
        name: profile.name,
        photoUrl: profile.picture,
        lastSyncTime: new Date().toISOString(),
        accessToken: token,
        tokenExpiresAt: Date.now() + 3500 * 1000,
        autoSyncEnabled: true,
        role: isSuperAdmin ? 'SUPERADMIN' : (managedUser.role as UserRole),
        isAdmin: isSuperAdmin,
        isSuspended,
      };
      setGoogleAccountState(newAccount);
      saveStoredGoogleAccount(newAccount);

      // Initial sync of current meetings
      try {
        const res = await uploadBackupToGoogleDrive(token, meetingsRef.current);
        newAccount.lastSyncTime = res.modifiedTime;
        setGoogleAccountState(newAccount);
        saveStoredGoogleAccount(newAccount);
      } catch (e) {
        console.warn('Initial backup on login failed:', e);
      }

      const updatedLogs = addHistoryLog(
        'BACKUP_CLOUD',
        'Masuk Akun Google',
        `Sesi Google aktif: ${profile.email}. Auto-Backup Cloud diaktifkan.`
      );
      setHistoryLogs(updatedLogs);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn('Google OAuth error, auto-fallback to email session:', errMsg);
      if (
        fallbackEmail &&
        (errMsg.includes('origin') ||
          errMsg.includes('invalid_client') ||
          errMsg.includes('popup_closed') ||
          errMsg.includes('Popup window closed'))
      ) {
        handleLoginWithEmail(fallbackEmail);
        return;
      }
      throw err;
    }
  };

  const handleLoginWithEmail = (email: string, name?: string) => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Format email tidak valid. Masukkan alamat email Google yang benar.');
    }
    const displayName = name?.trim() || cleanEmail.split('@')[0];
    const managedUser = upsertUserOnLogin(cleanEmail, displayName);
    const isSuperAdmin = isUserAdmin(cleanEmail);
    const isSuspended = managedUser.status === 'SUSPENDED';

    const newAccount: GoogleDriveAccount = {
      connected: true,
      email: cleanEmail,
      name: displayName,
      lastSyncTime: new Date().toISOString(),
      autoSyncEnabled: true,
      role: isSuperAdmin ? 'SUPERADMIN' : (managedUser.role as UserRole),
      isAdmin: isSuperAdmin,
      isSuspended,
    };
    setGoogleAccountState(newAccount);
    saveStoredGoogleAccount(newAccount);

    const updatedLogs = addHistoryLog(
      'BACKUP_CLOUD',
      'Masuk Akun Google',
      `Sesi Google aktif untuk ${cleanEmail}.`
    );
    setHistoryLogs(updatedLogs);
  };

  const handleLogoutGoogle = () => {
    clearStoredGoogleAccount();
    setGoogleAccountState({ connected: false });
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('notulenjmm_guest_mode');
    }
    const updatedLogs = addHistoryLog(
      'BACKUP_CLOUD',
      'Keluar Akun Google',
      'Sesi akun Google diputuskan. Cadangan cloud dihentikan.'
    );
    setHistoryLogs(updatedLogs);
  };

  const handleExportGoogleDoc = async (targetMeeting: Meeting) => {
    const storedAccount = getStoredGoogleAccount();
    const clientId = getGoogleClientId();
    let token = storedAccount.accessToken;
    const isTokenExpired =
      !token || !storedAccount.tokenExpiresAt || Date.now() >= storedAccount.tokenExpiresAt - 60000;

    if (isTokenExpired && clientId) {
      try {
        token = await requestGoogleAccessToken(clientId, false);
        const updatedAcc: GoogleDriveAccount = {
          ...storedAccount,
          accessToken: token,
          tokenExpiresAt: Date.now() + 3500 * 1000,
        };
        setGoogleAccountState(updatedAcc);
        saveStoredGoogleAccount(updatedAcc);
      } catch (authErr) {
        console.warn('OAuth token acquisition failed:', authErr);
      }
    }

    if (token) {
      return await exportMeetingToGoogleDoc(token, targetMeeting);
    }

    // Direct fallback if no OAuth client ID configured: open docs.new directly
    if (typeof window !== 'undefined') {
      window.open('https://docs.new', '_blank');
    }
    return {
      docId: 'new-doc',
      docUrl: 'https://docs.new',
      title: targetMeeting.title,
    };
  };

  const activeMeeting =
    meetings.find((m) => m.id === activeMeetingId) || (meetings.length > 0 ? meetings[0] : null);

  const handleUpdateActiveMeeting = (updated: Meeting) => {
    setMeetings((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    const updatedLogs = addHistoryLog(
      'EDIT',
      'Pembaruan Dokumen Sidang',
      `Menyimpan pembaruan pada naskah '${updated.title}'.`
    );
    setHistoryLogs(updatedLogs);
  };

  const handleDeleteMeeting = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = meetings.find((m) => m.id === id);
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    if (activeMeetingId === id) {
      const remaining = meetings.filter((m) => m.id !== id);
      setActiveMeetingId(remaining.length > 0 ? remaining[0].id : null);
    }
    if (target) {
      const updatedLogs = addHistoryLog(
        'DELETE',
        'Penghapusan Sesi Sidang',
        `Menghapus sesi '${target.title}'.`
      );
      setHistoryLogs(updatedLogs);
    }
  };

  const handleArchiveMeeting = (id: string) => {
    const target = meetings.find((m) => m.id === id);
    if (!target) return;
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const seq = String(meetings.filter((m) => m.isArchived).length + 1).padStart(3, '0');
    const archiveNumber = target.archiveNumber || `REG-MPK13/ARSIP/${year}/${month}/${seq}`;
    const archivedAt = new Date().toISOString();

    const updated: Meeting = {
      ...target,
      status: 'FINALIZED',
      isArchived: true,
      archivedAt,
      archiveNumber,
    };

    setMeetings((prev) => prev.map((m) => (m.id === id ? updated : m)));
    const updatedLogs = addHistoryLog(
      'ARCHIVE',
      'Pengarsipan Dokumen Resmi',
      `Sesi '${target.title}' resmi didaftarkan sebagai Arsip MPK 13 (${archiveNumber}).`
    );
    setHistoryLogs(updatedLogs);
  };

  const handleUnarchiveMeeting = (id: string) => {
    const target = meetings.find((m) => m.id === id);
    if (!target) return;
    const updated: Meeting = {
      ...target,
      isArchived: false,
    };
    setMeetings((prev) => prev.map((m) => (m.id === id ? updated : m)));
    const updatedLogs = addHistoryLog(
      'EDIT',
      'Pembatalan Pengarsipan',
      `Sesi '${target.title}' dikembalikan dari lemari arsip ke daftar aktif.`
    );
    setHistoryLogs(updatedLogs);
  };

  const handleRestoreBackup = (restoredMeetings: Meeting[]) => {
    if (!Array.isArray(restoredMeetings) || restoredMeetings.length === 0) return;
    setMeetings(restoredMeetings);
    setActiveMeetingId(restoredMeetings[0].id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredMeetings));
    } catch (e) {
      console.warn('Failed to persist restored meetings:', e);
    }
    const updatedLogs = getStoredHistoryLogs();
    setHistoryLogs(updatedLogs);
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
        { id: 'att-1', name: 'Pimpinan Sidang', role: 'Leader', present: true },
        { id: 'att-2', name: 'Notulis Sidang', role: 'Note Taker', present: true },
      ],
      transcript: [],
      agendas: [
        {
          title: 'Draf Agenda Rapat',
          discussionPoints: [
            'Draf rekaman Notulensi Berbasis Voice tersimpan secara aman di peramban.',
            `Catatan pengarah: ${draft.secretaryNotes.slice(0, 80)}...`,
          ],
        },
      ],
      decisions: [],
      actionItems: [],
    };

    setMeetings((prev) => [newDraft, ...prev]);
    setActiveMeetingId(newDraft.id);
    const updatedLogs = addHistoryLog(
      'CREATE',
      'Penyimpanan Draf Baru',
      `Menyimpan draf sesi '${newDraft.title}'.`
    );
    setHistoryLogs(updatedLogs);
    return newDraft.id;
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

    // Dynamically detect speakers from transcript segments for attendees list
    const detectedSpeakerNames = Array.from(new Set(segments.map((s) => s.speaker.trim()))).filter(Boolean);
    const dynamicAttendees = detectedSpeakerNames.length > 0
      ? detectedSpeakerNames.map((spk, idx) => {
          const lower = spk.toLowerCase();
          const role = lower.includes('pimpinan') || lower.includes('leader') || lower.includes('ketua')
            ? ('Leader' as const)
            : lower.includes('notulis') || lower.includes('sekretaris') || lower.includes('note')
            ? ('Note Taker' as const)
            : ('Member' as const);
          return {
            id: `att-${idx + 1}`,
            name: spk,
            role,
            present: true,
          };
        })
      : [
          { id: 'att-1', name: 'Pimpinan Sidang (Speaker 1)', role: 'Leader' as const, present: true },
          { id: 'att-2', name: 'Notulis Sidang (Speaker 2)', role: 'Note Taker' as const, present: true },
          { id: 'att-3', name: 'Perwakilan Komisi MPK', role: 'Member' as const, present: true },
        ];

    // Guarantee that at least one Leader and one Note Taker exist
    if (!dynamicAttendees.some((a) => a.role === 'Leader') && dynamicAttendees.length > 0) {
      dynamicAttendees[0].role = 'Leader';
    }
    if (!dynamicAttendees.some((a) => a.role === 'Note Taker') && dynamicAttendees.length > 1) {
      dynamicAttendees[1].role = 'Note Taker';
    }

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
      attendees: dynamicAttendees,
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

        // Ensure mandatory primary decision is never empty (Ketetapan Utama Sidang)
        const guaranteedDecisions =
          result.decisions && result.decisions.length > 0
            ? result.decisions
            : [
                {
                  id: `dec-${Date.now()}-1`,
                  number: `TAP/001/MPK-13/XI/${new Date().getFullYear()}`,
                  decisionText: `Mengesahkan pembahasan pokok risalah '${title}' sebagai ketetapan kerja resmi MPK SMK Negeri 13 Bandung.`,
                  rationale: 'Hasil musyawarah mufakat forum persidangan berdasarkan rekaman suara resmi.',
                  category: 'Organisasi' as const,
                  status: 'DISAHKAN' as const,
                  date: new Date().toISOString().split('T')[0],
                },
              ];

        const finalizedMeet: Meeting = {
          ...newMeet,
          status: 'FINALIZED',
          attendees: dynamicAttendees,
          executiveSummary:
            result.executiveSummary ||
            `Risalah resmi persidangan '${title}'. Seluruh rangkaian pemaparan, pandangan fraksi/komisi, dan konsiderans putusan telah diverifikasi oleh sistem AI NotulenJMM.`,
          agendas: result.agendas.length > 0 ? result.agendas : newMeet.agendas,
          decisions: guaranteedDecisions,
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
      const transcriptToUse =
        activeMeeting.transcript && activeMeeting.transcript.length > 0
          ? activeMeeting.transcript
          : [
              {
                id: 'seg-synthetic-1',
                speaker: 'Pimpinan Sidang',
                startTime: '00:00',
                endTime: '01:00',
                text: `Rapat resmi ${activeMeeting.title}. Pokok agenda: ${activeMeeting.agendas.map((a) => a.title).join(', ')}. Arahan notulis: ${notesToUse || 'Perumusan ketetapan formal dan penugasan sidang.'}`,
              },
            ];

      const result = await synthesizeNotulenApi(
        activeMeeting.title,
        transcriptToUse,
        activeMeeting.organizer,
        notesToUse
      );

      const updatedMeeting: Meeting = {
        ...activeMeeting,
        status: 'FINALIZED',
        secretaryNotes: notesToUse,
        executiveSummary: result.executiveSummary,
        mostImportant:
          activeMeeting.mostImportant ||
          result.decisions[0]?.decisionText ||
          'Ketetapan dan pokok penugasan sidang disahkan secara sah berstandar MPK SMK Negeri 13 Bandung.',
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
      date: formatIndonesianDateTime(new Date(), '09:00', '11:30'),
      location: 'Ruang Sidang Majelis / Multimedia SMK Negeri 13 Bandung',
      organizer: 'MPK SMK Negeri 13 Bandung',
      status: 'FINALIZED',
      durationSeconds: 0,
      secretaryNotes: '',
      mostImportant: '',
      formatStandard: 'TATA_NASKAH_DINAS',
      lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      attendees: [
        { id: 'att-1', name: 'Pimpinan Sidang', role: 'Leader', present: true },
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
    const updatedLogs = addHistoryLog(
      'CREATE',
      'Pembuatan Sesi Baru',
      `Membuat sesi sidang baru '${newMeet.title}'.`
    );
    setHistoryLogs(updatedLogs);
    return newMeet.id;
  };

  const handleCreateTemplateMeeting = (templateId: string): string => {
    const matched = OFFICIAL_MEETING_TEMPLATES.find((t) => t.id === templateId);
    const targetMeet = matched ? matched.create() : createMplsMeetingTemplate();
    setMeetings((prev) => [targetMeet, ...prev.filter((m) => m.id !== targetMeet.id)]);
    setActiveMeetingId(targetMeet.id);
    const updatedLogs = addHistoryLog(
      'CREATE',
      'Pembuatan Risalah Sidang Template',
      `Membuat agenda resmi dari template '${targetMeet.title}'.`
    );
    setHistoryLogs(updatedLogs);
    return targetMeet.id;
  };

  const handleCreateMplsMeeting = (): string => {
    return handleCreateTemplateMeeting('panitia-mpls');
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
        { id: 'att-1', name: 'Pimpinan Sidang', role: 'Leader', present: true },
        { id: 'att-2', name: 'Notulis Sidang', role: 'Note Taker', present: true },
        { id: 'att-3', name: 'Peserta Sidang', role: 'Member', present: true },
      ],
      transcript: [
        {
          id: `seg-${Date.now()}`,
          speaker: 'Speaker 1 (Pimpinan Sidang)',
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
    const updatedLogs = addHistoryLog(
      'CREATE',
      'Peluncuran Studio Sidang',
      `Meluncurkan sesi '${newMeet.title}' dari Craft Studio.`
    );
    setHistoryLogs(updatedLogs);
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
        handleArchiveMeeting,
        handleUnarchiveMeeting,
        handleRestoreBackup,
        handleSaveDraft,
        handleDiarizationComplete,
        handleSynthesizeNotulen,
        handleCreateNewMeeting,
        handleCreateMplsMeeting,
        handleCreateTemplateMeeting,
        handleStartCraftSession,
        isRecording,
        isSynthesizing,
        isAutoSyncing,
        lastAutoSyncStatus,
        isHydrated,
        historyLogs,
        googleAccount,
        setGoogleAccount,
        refreshHistoryLogs,
        handleToggleAutoSync,
        handleTriggerManualSync,
        handleLoginGoogle,
        handleLoginWithEmail,
        handleLogoutGoogle,
        handleExportGoogleDoc,
        isBeginnerGuideOpen,
        setIsBeginnerGuideOpen,
        openBeginnerGuide,
        closeBeginnerGuide,
        isBeginnerMode,
        setIsBeginnerMode,
        isAdmin,
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
