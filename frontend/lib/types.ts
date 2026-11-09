// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.

export interface Attendee {
  id: string;
  name: string;
  role: 'Leader' | 'Note Taker' | 'Member' | 'Guest';
  present: boolean;
}

export interface AudioSegment {
  id: string;
  speaker: string;
  startTime: string;
  endTime: string;
  text: string;
}

export interface Decision {
  id: string;
  number: string;
  decisionText: string;
  rationale: string;
  category: 'Organisasi' | 'Keuangan' | 'Program Kerja' | 'Disiplin' | 'Umum';
  status: 'DISAHKAN' | 'DITUNDA' | 'DITOLAK';
  date: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface MeetingAgenda {
  title: string;
  discussionPoints: string[];
}

export type MeetingFormatStandard =
  | 'TATA_NASKAH_DINAS'
  | 'PEMBENTUKAN_PANITIA_MPLS'
  | 'RISALAH_PADAT'
  | 'RAPAT_KERJA_ANGGARAN'
  | 'LPJ_EVALUASI';

export interface Meeting {
  id: string;
  title: string;
  date: string;
  location: string;
  organizer: string;
  status: 'DRAFT' | 'RECORDING' | 'TRANSCRIBING' | 'FINALIZED';
  durationSeconds: number;
  attendees: Attendee[];
  transcript: AudioSegment[];
  executiveSummary?: string;
  mostImportant?: string;
  agendas: MeetingAgenda[];
  decisions: Decision[];
  actionItems: ActionItem[];
  secretaryNotes?: string;
  formatStandard?: MeetingFormatStandard;
  lastSavedAt?: string;
  leaderName?: string;
  noteTakerName?: string;
  audioUrl?: string;
  isArchived?: boolean;
  archivedAt?: string;
  archiveNumber?: string;
}

export interface HistoryLog {
  id: string;
  timestamp: string;
  action: 'CREATE' | 'EDIT' | 'ARCHIVE' | 'BACKUP_CLOUD' | 'RESTORE' | 'DELETE';
  title: string;
  details: string;
}

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'PRESIDIUM' | 'NOTULIS' | 'GUEST';

export const ADMIN_EMAILS: string[] = [
  'alfarrezald@gmail.com',
  'davinmaritza@gmail.com',
];

export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adm) => adm.toLowerCase() === normalized);
}

export interface GoogleDriveAccount {
  connected: boolean;
  email?: string;
  name?: string;
  photoUrl?: string;
  lastSyncTime?: string;
  accessToken?: string;
  tokenExpiresAt?: number;
  autoSyncEnabled?: boolean;
  role?: UserRole;
  isAdmin?: boolean;
}


