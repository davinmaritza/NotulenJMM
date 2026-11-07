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
  agendas: MeetingAgenda[];
  decisions: Decision[];
  actionItems: ActionItem[];
}
