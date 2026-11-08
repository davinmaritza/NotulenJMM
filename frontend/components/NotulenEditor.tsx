'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Printer,
  Calendar,
  User,
  PlusCircle,
  Check,
  Download,
  Share2,
  X,
  FileCode,
  MapPin,
  Clock,
  Sparkles,
  FileSpreadsheet,
  SlidersHorizontal,
  Save,
  Trash2,
  Send,
  Plus,
  RefreshCw,
  CheckCircle2,
  Archive,
  Cloud,
} from 'lucide-react';
import { Meeting, Decision, ActionItem, MeetingAgenda, MeetingFormatStandard } from '../lib/types';
import { synthesizeNotulenApi } from '../lib/api';
import { useMeetings } from '../context/MeetingContext';

interface NotulenEditorProps {
  meeting?: Meeting | null;
  onUpdateMeeting: (updated: Meeting) => void;
}

// XSS Prevention: Sanitize text variables for HTML document generation
const escapeHtml = (text: string | null | undefined): string => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const NotulenEditor: React.FC<NotulenEditorProps> = ({ meeting, onUpdateMeeting }) => {
  const { googleAccount, isAutoSyncing } = useMeetings();
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);
  const [showWaModal, setShowWaModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Inline Adders
  const [newDecisionText, setNewDecisionText] = useState('');
  const [newDecisionCategory, setNewDecisionCategory] = useState<Decision['category']>('Program Kerja');
  const [newActionTask, setNewActionTask] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('');
  const [newActionDueDate, setNewActionDueDate] = useState('');

  // Modification Drawer / Modal State
  const [isModifying, setIsModifying] = useState(false);
  const [isAiReformatting, setIsAiReformatting] = useState(false);

  // Temporary Edit State for Modification Modal
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editOrganizer, setEditOrganizer] = useState('');
  const [editLeaderName, setEditLeaderName] = useState('');
  const [editNoteTakerName, setEditNoteTakerName] = useState('');
  const [editFormatStandard, setEditFormatStandard] = useState<MeetingFormatStandard>('TATA_NASKAH_DINAS');
  const [editSecretaryNotes, setEditSecretaryNotes] = useState('');
  const [editExecutiveSummary, setEditExecutiveSummary] = useState('');
  const [editAgendas, setEditAgendas] = useState<MeetingAgenda[]>([]);
  const [editDecisions, setEditDecisions] = useState<Decision[]>([]);
  const [editActionItems, setEditActionItems] = useState<ActionItem[]>([]);

  // Initialize edit form when user opens the modification modal
  const openModificationModal = () => {
    if (meeting) {
      setEditTitle(meeting.title || '');
      setEditDate(meeting.date || '');
      setEditLocation(meeting.location || '');
      setEditOrganizer(meeting.organizer || 'MPK SMK Negeri 13 Bandung');
      setEditLeaderName(meeting.leaderName || 'Presidium Sidang MPK 13');
      setEditNoteTakerName(meeting.noteTakerName || 'Notulis Sidang');
      setEditFormatStandard(meeting.formatStandard || 'TATA_NASKAH_DINAS');
      setEditSecretaryNotes(meeting.secretaryNotes || '');
      setEditExecutiveSummary(meeting.executiveSummary || '');
      setEditAgendas(JSON.parse(JSON.stringify(meeting.agendas || [])));
      setEditDecisions(JSON.parse(JSON.stringify(meeting.decisions || [])));
      setEditActionItems(JSON.parse(JSON.stringify(meeting.actionItems || [])));
    }
    setIsModifying(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!meeting) {
    return (
      <div className="bg-white border-[2.5px] border-black rounded-2xl p-10 sm:p-14 text-center space-y-4 shadow-[6px_6px_0px_0px_#000]">
        <div className="w-16 h-16 rounded-2xl bg-[#FFD93D] border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center mx-auto text-black">
          <FileText className="w-8 h-8 stroke-[2.5]" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h2 className="text-base sm:text-lg font-black text-black tracking-tight">Belum Ada Sesi Sidang Terpilih</h2>
          <p className="text-xs text-zinc-700 leading-relaxed font-sans font-medium">
            Pilih sesi dari arsip sidang atau mulai perekaman audio/voice note sekretaris untuk menyusun risalah dan keputusan resmi.
          </p>
        </div>
      </div>
    );
  }

  const toggleActionStatus = (actionId: string) => {
    const updatedActions: ActionItem[] = meeting.actionItems.map((item) => {
      if (item.id === actionId) {
        const nextStatus: ActionItem['status'] =
          item.status === 'COMPLETED'
            ? 'PENDING'
            : item.status === 'PENDING'
            ? 'IN_PROGRESS'
            : 'COMPLETED';
        return { ...item, status: nextStatus };
      }
      return item;
    });

    onUpdateMeeting({
      ...meeting,
      actionItems: updatedActions,
      lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    });
  };

  const handleManualSaveDraft = () => {
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    onUpdateMeeting({
      ...meeting,
      lastSavedAt: timestamp,
    });
    showToast(`Draf sidang "${meeting.title}" berhasil disimpan secara online (${timestamp})`);
  };

  const handleToggleArchive = () => {
    if (!meeting) return;
    const isNowArchived = !meeting.isArchived;
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const seq = meeting.id.slice(-4).toUpperCase();
    const archiveNumber = meeting.archiveNumber || `REG-MPK13/ARSIP/${year}/${month}/${seq}`;

    const updated: Meeting = {
      ...meeting,
      status: isNowArchived ? 'FINALIZED' : meeting.status,
      isArchived: isNowArchived,
      archivedAt: isNowArchived ? new Date().toISOString() : undefined,
      archiveNumber: isNowArchived ? archiveNumber : undefined,
    };
    onUpdateMeeting(updated);
    showToast(
      isNowArchived
        ? `Sesi resmi didaftarkan sebagai Arsip MPK 13 (${archiveNumber})!`
        : 'Status arsip resmi dibatalkan.'
    );
  };

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecisionText.trim()) return;

    const newDecision: Decision = {
      id: `dec-${Date.now()}`,
      number: `KEP/${String(meeting.decisions.length + 1).padStart(3, '0')}/MPK-13/XI/2026`,
      decisionText: newDecisionText.trim(),
      rationale: 'Ketetapan hasil musyawarah dan pemungutan suara forum sidang pleno.',
      category: newDecisionCategory,
      status: 'DISAHKAN',
      date: new Date().toISOString().split('T')[0],
    };

    onUpdateMeeting({
      ...meeting,
      decisions: [...meeting.decisions, newDecision],
      lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    });
    setNewDecisionText('');
    showToast('Ketetapan keputusan sidang baru berhasil disahkan!');
  };

  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTask.trim() || !newActionAssignee.trim()) return;

    const newItem: ActionItem = {
      id: `act-${Date.now()}`,
      description: newActionTask.trim(),
      assignee: newActionAssignee.trim(),
      dueDate: newActionDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'PENDING',
    };

    onUpdateMeeting({
      ...meeting,
      actionItems: [...meeting.actionItems, newItem],
      lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    });
    setNewActionTask('');
    setNewActionAssignee('');
    setNewActionDueDate('');
    showToast('Penugasan komisi baru berhasil ditambahkan!');
  };

  // 1. Export Markdown (Clipboard)
  const exportMarkdown = () => {
    let md = `# RISALAH & NOTULENSI RESMI SIDANG\n`;
    md += `## MAJELIS PERWAKILAN KELAS (MPK) SMK NEGERI 13 BANDUNG\n\n`;
    md += `**Judul Sidang:** ${meeting.title}\n`;
    md += `**Waktu & Tanggal:** ${meeting.date}\n`;
    md += `**Tempat Sidang:** ${meeting.location}\n`;
    md += `**Penyelenggara:** ${meeting.organizer}\n`;
    md += `**Pimpinan Sidang:** ${meeting.leaderName || 'Presidium Sidang MPK 13'}\n`;
    md += `**Notulis Sidang:** ${meeting.noteTakerName || 'Notulis Sidang'}\n\n`;

    if (meeting.secretaryNotes) {
      md += `**Arahan Notulis:**\n> ${meeting.secretaryNotes}\n\n`;
    }

    md += `---\n\n`;
    md += `### I. RINGKASAN EKSEKUTIF\n${meeting.executiveSummary || 'Belum ada ringkasan eksekutif.'}\n\n`;

    md += `### II. POKOK BAHASAN & AGENDA\n`;
    meeting.agendas.forEach((ag, idx) => {
      md += `#### ${idx + 1}. ${ag.title}\n`;
      ag.discussionPoints.forEach((pt) => {
        md += `- ${pt}\n`;
      });
      md += `\n`;
    });

    md += `### III. DAFTAR KETETAPAN & KEPUTUSAN RESMI\n`;
    if (meeting.decisions.length === 0) {
      md += `- Belum ada ketetapan resmi yang disahkan.\n\n`;
    } else {
      meeting.decisions.forEach((dec) => {
        md += `- **[${dec.number}]** ${dec.decisionText} (*Kategori: ${dec.category} | Status: ${dec.status}*)\n`;
      });
      md += `\n`;
    }

    md += `### IV. TINDAK LANJUT & PENUGASAN (ACTION ITEMS)\n`;
    if (meeting.actionItems.length === 0) {
      md += `- Belum ada penugasan tindak lanjut.\n\n`;
    } else {
      meeting.actionItems.forEach((act) => {
        md += `- [${act.status === 'COMPLETED' ? 'x' : ' '}] **${act.description}** — *Penanggung Jawab: ${act.assignee} (Tenggat: ${act.dueDate})*\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  // 2. Export Word Document (.doc) with strict HTML entity escaping
  const exportWord = () => {
    const cleanTitle = meeting.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const dateFormatted = new Date().toISOString().split('T')[0];

    const agendasHtml = meeting.agendas
      .map(
        (ag, idx) => `
        <div style="margin-bottom: 10pt;">
          <h4 style="font-size: 11pt; font-weight: bold; margin: 4pt 0; color: #1e293b;">${idx + 1}. ${escapeHtml(ag.title)}</h4>
          <ul style="margin-top: 2pt; margin-bottom: 6pt; padding-left: 20pt;">
            ${ag.discussionPoints.map((pt) => `<li style="margin-bottom: 2pt;">${escapeHtml(pt)}</li>`).join('')}
          </ul>
        </div>
      `
      )
      .join('');

    const decisionsHtml =
      meeting.decisions.length === 0
        ? '<p style="font-style: italic; color: #64748b;">(Belum ada keputusan resmi yang disahkan)</p>'
        : `
        <table style="width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 12pt;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 6pt 8pt; font-size: 10pt; text-align: left; width: 22%;">Nomor Ketetapan</th>
              <th style="border: 1px solid #cbd5e1; padding: 6pt 8pt; font-size: 10pt; text-align: left; width: 18%;">Kategori</th>
              <th style="border: 1px solid #cbd5e1; padding: 6pt 8pt; font-size: 10pt; text-align: left; width: 45%;">Isi Keputusan</th>
              <th style="border: 1px solid #cbd5e1; padding: 6pt 8pt; font-size: 10pt; text-align: center; width: 15%;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${meeting.decisions
              .map(
                (d) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt; font-family: monospace;">${escapeHtml(d.number)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt;">${escapeHtml(d.category)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt;">${escapeHtml(d.decisionText)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt; text-align: center; font-weight: bold; color: #047857;">${escapeHtml(d.status)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `;

    const actionsHtml =
      meeting.actionItems.length === 0
        ? '<p style="font-style: italic; color: #64748b;">(Belum ada penugasan tindak lanjut)</p>'
        : `
        <table style="width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 12pt;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 6pt 8pt; font-size: 10pt; text-align: left; width: 50%;">Uraian Tugas</th>
              <th style="border: 1px solid #cbd5e1; padding: 6pt 8pt; font-size: 10pt; text-align: left; width: 25%;">Penanggung Jawab (PIC)</th>
              <th style="border: 1px solid #cbd5e1; padding: 6pt 8pt; font-size: 10pt; text-align: center; width: 15%;">Batas Waktu</th>
              <th style="border: 1px solid #cbd5e1; padding: 6pt 8pt; font-size: 10pt; text-align: center; width: 10%;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${meeting.actionItems
              .map(
                (a) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt;">${escapeHtml(a.description)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt; font-weight: bold;">${escapeHtml(a.assignee)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt; text-align: center;">${escapeHtml(a.dueDate)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt; text-align: center;">${escapeHtml(a.status)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `;

    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(meeting.title)}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #0f172a; margin: 20pt 30pt; }
          .kop-header { text-align: center; border-bottom: 3px double #000000; padding-bottom: 8pt; margin-bottom: 16pt; }
          .kop-sub { font-size: 10pt; text-transform: uppercase; letter-spacing: 1.5pt; margin: 0; color: #334155; }
          .kop-main { font-size: 15pt; font-weight: bold; margin: 2pt 0; text-transform: uppercase; color: #000000; }
          .kop-school { font-size: 13pt; font-weight: bold; margin: 0 0 4pt; color: #000000; }
          .kop-address { font-size: 8.5pt; color: #475569; margin: 0; }
          .doc-title { text-align: center; font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 16pt 0 4pt; text-decoration: underline; }
          .doc-number { text-align: center; font-size: 10pt; font-family: monospace; color: #475569; margin-bottom: 16pt; }
          .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 16pt; }
          .meta-table td { padding: 3pt 6pt; font-size: 10.5pt; vertical-align: top; }
          .meta-table td.lbl { width: 140pt; font-weight: bold; color: #1e293b; }
          h3 { font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1.5pt solid #0f172a; padding-bottom: 3pt; margin-top: 16pt; margin-bottom: 6pt; color: #0f172a; }
          .summary-box { background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 8pt 12pt; margin: 6pt 0 12pt; font-size: 10.5pt; line-height: 1.6; }
          .sig-table { width: 100%; margin-top: 35pt; border-collapse: collapse; page-break-inside: avoid; }
          .sig-table td { width: 50%; text-align: center; vertical-align: top; font-size: 10.5pt; }
        </style>
      </head>
      <body>
        <div class="kop-header">
          <p class="kop-sub">PEMERINTAH DAERAH PROVINSI JAWA BARAT - DINAS PENDIDIKAN</p>
          <p class="kop-main">MAJELIS PERWAKILAN KELAS (MPK)</p>
          <p class="kop-school">SMK NEGERI 13 BANDUNG</p>
          <p class="kop-address">Jl. Soekarno-Hatta Km. 10 Bandung 40286 | Surel: mpk@smkn13bdg.sch.id</p>
        </div>

        <div class="doc-title">RISALAH &amp; NOTULENSI RESMI SIDANG</div>
        <div class="doc-number">Nomor Berita Acara: BA/${dateFormatted}/MPK-13/XI/2026</div>

        <table class="meta-table">
          <tr><td class="lbl">Agenda Sidang</td><td>: <strong>${escapeHtml(meeting.title)}</strong></td></tr>
          <tr><td class="lbl">Hari / Tanggal</td><td>: ${escapeHtml(meeting.date)}</td></tr>
          <tr><td class="lbl">Tempat Sidang</td><td>: ${escapeHtml(meeting.location)}</td></tr>
          <tr><td class="lbl">Penyelenggara</td><td>: ${escapeHtml(meeting.organizer)}</td></tr>
          <tr><td class="lbl">Pimpinan Sidang</td><td>: ${escapeHtml(meeting.leaderName || 'Presidium Sidang MPK 13')}</td></tr>
          <tr><td class="lbl">Notulis Sidang</td><td>: ${escapeHtml(meeting.noteTakerName || 'Notulis Sidang')}</td></tr>
          ${
            meeting.secretaryNotes
              ? `<tr><td class="lbl">Catatan Pengarah</td><td>: <em>${escapeHtml(meeting.secretaryNotes)}</em></td></tr>`
              : ''
          }
        </table>

        <h3>I. Ringkasan Eksekutif Hasil Sidang</h3>
        <div class="summary-box">
          ${escapeHtml(meeting.executiveSummary) || 'Belum ada ringkasan eksekutif.'}
        </div>

        <h3>II. Pokok Bahasan &amp; Agenda Pleno</h3>
        ${agendasHtml}

        <h3>III. Ketetapan &amp; Keputusan Resmi Majelis</h3>
        ${decisionsHtml}

        <h3>IV. Tindak Lanjut &amp; Penugasan (Action Items)</h3>
        ${actionsHtml}

        <table class="sig-table">
          <tr>
            <td>
              Mengetahui,<br>
              <strong>Ketua MPK SMK Negeri 13 Bandung</strong>
              <br><br><br><br>
              <u>(${escapeHtml(meeting.leaderName || 'Presidium Sidang')})</u><br>
              NIS. MPK-13/2026
            </td>
            <td>
              Bandung, ${dateFormatted}<br>
              <strong>Notulis / Sekretaris Sidang</strong>
              <br><br><br><br>
              <u><strong>${escapeHtml(meeting.noteTakerName || 'Notulis Sidang')}</strong></u><br>
              Notulis Pleno Majelis
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([wordContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Risalah_${cleanTitle}_${dateFormatted}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Dokumen Microsoft Word (.DOC) berhasil diunduh!');
  };

  // 3. Export Excel Spreadsheet (.xls)
  const exportExcel = () => {
    const cleanTitle = meeting.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const dateFormatted = new Date().toISOString().split('T')[0];

    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
        <style>
          table { border-collapse: collapse; width: 100%; font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
          th { background-color: #1e293b; color: #ffffff; font-weight: bold; border: 1px solid #94a3b8; padding: 8px; text-align: left; }
          td { border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: top; }
          .header-title { font-size: 15pt; font-weight: bold; text-align: center; color: #000000; }
          .header-sub { font-size: 10pt; text-align: center; color: #475569; }
          .section-banner { background-color: #334155; color: #ffffff; font-weight: bold; font-size: 11.5pt; padding: 7px 10px; }
          .meta-label { font-weight: bold; background-color: #f1f5f9; width: 160px; }
          .status-disahkan { color: #15803d; font-weight: bold; }
          .status-pending { color: #b45309; }
          .status-completed { color: #15803d; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="5" class="header-title">MAJELIS PERWAKILAN KELAS (MPK) SMK NEGERI 13 BANDUNG</td></tr>
          <tr><td colspan="5" class="header-sub">REKAPITULASI RISALAH, KETETAPAN &amp; PENUGASAN SIDANG PLENO</td></tr>
          <tr><td colspan="5" style="border: none; height: 8px;"></td></tr>
          <tr><td class="meta-label">Agenda / Judul Sidang</td><td colspan="4"><b>${escapeHtml(meeting.title)}</b></td></tr>
          <tr><td class="meta-label">Hari / Tanggal</td><td colspan="4">${escapeHtml(meeting.date)}</td></tr>
          <tr><td class="meta-label">Tempat Sidang</td><td colspan="4">${escapeHtml(meeting.location)}</td></tr>
          <tr><td class="meta-label">Penyelenggara</td><td colspan="4">${escapeHtml(meeting.organizer)}</td></tr>
          <tr><td class="meta-label">Pimpinan Sidang</td><td colspan="4">${escapeHtml(meeting.leaderName || 'Presidium Sidang MPK 13')}</td></tr>
          <tr><td class="meta-label">Notulis Sidang</td><td colspan="4">${escapeHtml(meeting.noteTakerName || 'Notulis Sidang')}</td></tr>
          <tr><td class="meta-label">Standar Format</td><td colspan="4">${escapeHtml(meeting.formatStandard || 'TATA_NASKAH_DINAS')}</td></tr>
          <tr><td colspan="5" style="border: none; height: 12px;"></td></tr>

          <!-- Section 1: Ringkasan Eksekutif -->
          <tr><td colspan="5" class="section-banner">I. RINGKASAN EKSEKUTIF</td></tr>
          <tr><td colspan="5" style="background-color: #f8fafc; padding: 10px;">${escapeHtml(meeting.executiveSummary || 'Belum ada ringkasan eksekutif.')}</td></tr>
          <tr><td colspan="5" style="border: none; height: 12px;"></td></tr>

          <!-- Section 2: Pokok Bahasan & Agenda -->
          <tr><td colspan="5" class="section-banner">II. POKOK BAHASAN &amp; AGENDA PLENO</td></tr>
          <tr>
            <th style="width: 45px; text-align: center;">No</th>
            <th colspan="2" style="width: 250px;">Pokok Bahasan / Topik</th>
            <th colspan="2">Poin-Poin Pembahasan &amp; Fakta Persidangan</th>
          </tr>
          ${meeting.agendas
            .map(
              (ag, idx) => `
            <tr>
              <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
              <td colspan="2"><b>${escapeHtml(ag.title)}</b></td>
              <td colspan="2">${ag.discussionPoints.map((p) => `• ${escapeHtml(p)}`).join('<br>')}</td>
            </tr>
          `
            )
            .join('')}
          <tr><td colspan="5" style="border: none; height: 12px;"></td></tr>

          <!-- Section 3: Ketetapan & Keputusan -->
          <tr><td colspan="5" class="section-banner">III. KETETAPAN &amp; KEPUTUSAN RESMI MAJELIS</td></tr>
          <tr>
            <th style="width: 140px;">Nomor Ketetapan</th>
            <th style="width: 120px;">Kategori</th>
            <th colspan="2">Isi Ketetapan / Keputusan</th>
            <th style="width: 110px; text-align: center;">Status</th>
          </tr>
          ${
            meeting.decisions.length === 0
              ? `<tr><td colspan="5" style="text-align: center; font-style: italic; color: #64748b;">(Belum ada ketetapan resmi)</td></tr>`
              : meeting.decisions
                  .map(
                    (d) => `
            <tr>
              <td style="font-family: monospace;">${escapeHtml(d.number)}</td>
              <td>${escapeHtml(d.category)}</td>
              <td colspan="2"><b>${escapeHtml(d.decisionText)}</b><br><small style="color: #64748b;">Pertimbangan: ${escapeHtml(d.rationale)}</small></td>
              <td style="text-align: center;" class="status-disahkan">${escapeHtml(d.status)}</td>
            </tr>
          `
                  )
                  .join('')
          }
          <tr><td colspan="5" style="border: none; height: 12px;"></td></tr>

          <!-- Section 4: Action Items / Penugasan -->
          <tr><td colspan="5" class="section-banner">IV. TINDAK LANJUT &amp; PENUGASAN (ACTION ITEMS)</td></tr>
          <tr>
            <th style="width: 45px; text-align: center;">No</th>
            <th colspan="2">Uraian Tugas / Komitmen</th>
            <th style="width: 150px;">Penanggung Jawab (PIC)</th>
            <th style="width: 110px; text-align: center;">Batas Waktu</th>
            <th style="width: 100px; text-align: center;">Status</th>
          </tr>
          ${
            meeting.actionItems.length === 0
              ? `<tr><td colspan="5" style="text-align: center; font-style: italic; color: #64748b;">(Belum ada penugasan)</td></tr>`
              : meeting.actionItems
                  .map(
                    (act, idx) => `
            <tr>
              <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
              <td colspan="2"><b>${escapeHtml(act.description)}</b></td>
              <td>${escapeHtml(act.assignee)}</td>
              <td style="text-align: center;">${escapeHtml(act.dueDate)}</td>
              <td style="text-align: center;" class="${act.status === 'COMPLETED' ? 'status-completed' : 'status-pending'}">${escapeHtml(act.status)}</td>
            </tr>
          `
                  )
                  .join('')
          }
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Risalah_${cleanTitle}_${dateFormatted}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Tabel Rekapitulasi Sidang Excel (.XLS) berhasil diunduh!');
  };

  // 4. Export Plain Text (.txt)
  const exportTxt = () => {
    const cleanTitle = meeting.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const dateFormatted = new Date().toISOString().split('T')[0];
    const divider = '========================================================================\n';
    const subDivider = '------------------------------------------------------------------------\n';

    let txt = divider;
    txt += 'MAJELIS PERWAKILAN KELAS (MPK) SMK NEGERI 13 BANDUNG\n';
    txt += 'RISALAH & NOTULENSI RESMI SIDANG PLENO\n';
    txt += divider;
    txt += `Agenda Sidang : ${meeting.title}\n`;
    txt += `Waktu/Tanggal : ${meeting.date}\n`;
    txt += `Tempat Sidang : ${meeting.location}\n`;
    txt += `Penyelenggara : ${meeting.organizer}\n`;
    txt += `Pimpinan      : ${meeting.leaderName || 'Presidium Sidang MPK 13'}\n`;
    txt += `Notulis Sidang: ${meeting.noteTakerName || 'Notulis Sidang'}\n`;
    txt += `Durasi Rekam  : ${Math.floor(meeting.durationSeconds / 60)} Menit Audio\n`;
    if (meeting.secretaryNotes) {
      txt += `Arahan Notulis: ${meeting.secretaryNotes}\n`;
    }
    txt += '\n' + subDivider;
    txt += 'I. RINGKASAN EKSEKUTIF\n';
    txt += subDivider;
    txt += (meeting.executiveSummary || 'Belum ada ringkasan eksekutif.') + '\n\n';

    txt += subDivider;
    txt += 'II. POKOK BAHASAN & AGENDA\n';
    txt += subDivider;
    meeting.agendas.forEach((ag, idx) => {
      txt += `${idx + 1}. ${ag.title}\n`;
      ag.discussionPoints.forEach((pt) => {
        txt += `   - ${pt}\n`;
      });
      txt += '\n';
    });

    txt += subDivider;
    txt += 'III. KETETAPAN & KEPUTUSAN RESMI MAJELIS\n';
    txt += subDivider;
    if (meeting.decisions.length === 0) {
      txt += '(Belum ada ketetapan resmi yang disahkan)\n\n';
    } else {
      meeting.decisions.forEach((dec) => {
        txt += `[${dec.number}] (${dec.status})\n`;
        txt += `Kategori  : ${dec.category}\n`;
        txt += `Keputusan : ${dec.decisionText}\n`;
        txt += `Alasan    : ${dec.rationale}\n\n`;
      });
    }

    txt += subDivider;
    txt += 'IV. TINDAK LANJUT & PENUGASAN (ACTION ITEMS)\n';
    txt += subDivider;
    if (meeting.actionItems.length === 0) {
      txt += '(Belum ada penugasan tindak lanjut)\n\n';
    } else {
      meeting.actionItems.forEach((act, idx) => {
        const mark = act.status === 'COMPLETED' ? '[X]' : '[ ]';
        txt += `${idx + 1}. ${mark} ${act.description}\n`;
        txt += `   Penanggung Jawab : ${act.assignee}\n`;
        txt += `   Batas Waktu      : ${act.dueDate}\n`;
        txt += `   Status           : ${act.status}\n\n`;
      });
    }

    txt += divider;
    txt += `Disusun melalui NotulenJMM • Tata Naskah Dinas MPK SMK Negeri 13 Bandung\n`;
    txt += divider;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Risalah_${cleanTitle}_${dateFormatted}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Naskah Plain Text (.TXT) berhasil diunduh!');
  };

  // 5. Generate WhatsApp Formatted Text
  const generateWhatsAppText = () => {
    let wa = `*RISALAH & NOTULENSI RESMI SIDANG*\n`;
    wa += `*MAJELIS PERWAKILAN KELAS (MPK) SMK NEGERI 13 BANDUNG*\n`;
    wa += `──────────────────────────────────────\n\n`;
    wa += `*Agenda:* ${meeting.title}\n`;
    wa += `*Hari/Tanggal:* ${meeting.date}\n`;
    wa += `*Tempat:* ${meeting.location}\n`;
    wa += `*Penyelenggara:* ${meeting.organizer}\n`;
    wa += `*Pimpinan Sidang:* ${meeting.leaderName || 'Presidium Sidang MPK 13'}\n`;
    wa += `*Notulis Sidang:* ${meeting.noteTakerName || 'Notulis Sidang'}\n`;
    if (meeting.secretaryNotes) {
      wa += `*Catatan Pengarah:* _${meeting.secretaryNotes}_\n`;
    }
    wa += `\n`;

    wa += `*I. RINGKASAN EKSEKUTIF*\n`;
    wa += `${meeting.executiveSummary || 'Belum ada ringkasan eksekutif.'}\n\n`;

    if (meeting.agendas.length > 0) {
      wa += `*II. AGENDA & POKOK BAHASAN*\n`;
      meeting.agendas.forEach((ag, idx) => {
        wa += `*${idx + 1}. ${ag.title}*\n`;
        ag.discussionPoints.forEach((pt) => {
          wa += `   - ${pt}\n`;
        });
        wa += `\n`;
      });
    }

    if (meeting.decisions.length > 0) {
      wa += `*III. KETETAPAN & KEPUTUSAN RESMI*\n`;
      meeting.decisions.forEach((dec) => {
        wa += `[${dec.number}] ${dec.decisionText}\n`;
        wa += `   Kategori: ${dec.category} | Status: ${dec.status}\n`;
      });
      wa += `\n`;
    }

    if (meeting.actionItems.length > 0) {
      wa += `*IV. TINDAK LANJUT & PENUGASAN (ACTION ITEMS)*\n`;
      meeting.actionItems.forEach((act) => {
        const marker = act.status === 'COMPLETED' ? '[SELESAI]' : '[TERTUNDA]';
        wa += `${marker} *${act.description}*\n`;
        wa += `   Penanggung Jawab: *${act.assignee}* | Batas Waktu: *${act.dueDate}*\n`;
      });
      wa += `\n`;
    }

    wa += `──────────────────────────────────────\n`;
    wa += `Diverifikasi resmi oleh ${meeting.noteTakerName || 'Notulis Sidang'}\n`;
    wa += `Majelis Perwakilan Kelas SMK Negeri 13 Bandung`;

    return wa;
  };

  const copyWhatsApp = () => {
    const waText = generateWhatsAppText();
    navigator.clipboard.writeText(waText);
    setCopiedWa(true);
    setTimeout(() => setCopiedWa(false), 2000);
    showToast('Teks pesan WhatsApp berhasil disalin ke clipboard!');
  };

  const shareToWhatsAppDirect = () => {
    const waText = generateWhatsAppText();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(url, '_blank');
  };

  // Modification Modal Handlers
  const handleApplyModifications = () => {
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const updated: Meeting = {
      ...meeting,
      title: editTitle.trim() || meeting.title,
      date: editDate.trim() || meeting.date,
      location: editLocation.trim() || meeting.location,
      organizer: editOrganizer.trim() || meeting.organizer,
      leaderName: editLeaderName.trim(),
      noteTakerName: editNoteTakerName.trim(),
      formatStandard: editFormatStandard,
      secretaryNotes: editSecretaryNotes,
      executiveSummary: editExecutiveSummary,
      agendas: editAgendas,
      decisions: editDecisions,
      actionItems: editActionItems,
      lastSavedAt: timestamp,
    };

    onUpdateMeeting(updated);
    setIsModifying(false);
    showToast(`Format naskah & modifikasi risalah sidang berhasil diterapkan secara online (${timestamp})!`);
  };

  const handleAiReformat = async () => {
    if (!meeting.transcript || meeting.transcript.length === 0) {
      showToast('Tidak ada transkrip audio untuk dianalisis ulang oleh AI.');
      return;
    }

    setIsAiReformatting(true);
    try {
      const formatPrompts: Record<MeetingFormatStandard, string> = {
        TATA_NASKAH_DINAS:
          'Tata Naskah Dinas Resmi MPK 13. Susun konsiderans hukum, pasal ketetapan pleno, dan bahasa yuridis resmi.',
        RISALAH_PADAT:
          'Format Risalah Padat & Ketetapan Inti. Ringkasan maksimal 2 paragraf tajam, langsung ke inti keputusan rapat dan PIC tanpa basa-basi.',
        RAPAT_KERJA_ANGGARAN:
          'Format Rapat Kerja & Anggaran Kas. Fokuskan secara mendalam pada alokasi pos anggaran kas, rincian biaya pengadaan, dan verifikasi bendahara.',
        LPJ_EVALUASI:
          'Format Laporan Pertanggungjawaban (LPJ) & Evaluasi. Fokuskan pada persentase ketercapaian program kerja, kendala lapangan, serta rekomendasi komisi.',
      };

      const steeringPrompt = `${formatPrompts[editFormatStandard]}\n${editSecretaryNotes}`;
      const res = await synthesizeNotulenApi(
        editTitle || meeting.title,
        meeting.transcript,
        editOrganizer || meeting.organizer,
        steeringPrompt
      );

      setEditExecutiveSummary(res.executiveSummary);
      setEditAgendas(res.agendas);
      setEditDecisions(res.decisions);
      setEditActionItems(res.actionItems);
      showToast('Risalah berhasil diformat ulang otomatis oleh AI sesuai format pilihan!');
    } catch (err) {
      console.error('AI Reformat failed:', err);
      showToast('Gagal memformat ulang via AI. Silakan periksa koneksi server.');
    } finally {
      setIsAiReformatting(false);
    }
  };

  // Agenda list mutation helpers
  const handleAddAgenda = () => {
    setEditAgendas([
      ...editAgendas,
      {
        title: `Pokok Bahasan ${editAgendas.length + 1}`,
        discussionPoints: ['Poin pembahasan baru...'],
      },
    ]);
  };

  const handleRemoveAgenda = (idx: number) => {
    setEditAgendas(editAgendas.filter((_, i) => i !== idx));
  };

  const handleAddDiscussionPoint = (agendaIdx: number) => {
    const updated = [...editAgendas];
    updated[agendaIdx].discussionPoints.push('Poin pembahasan...');
    setEditAgendas(updated);
  };

  const handleRemoveDiscussionPoint = (agendaIdx: number, ptIdx: number) => {
    const updated = [...editAgendas];
    updated[agendaIdx].discussionPoints = updated[agendaIdx].discussionPoints.filter((_, i) => i !== ptIdx);
    setEditAgendas(updated);
  };

  // Decision mutation helpers
  const handleAddModalDecision = () => {
    const newDec: Decision = {
      id: `dec-${Date.now()}`,
      number: `KEP/${String(editDecisions.length + 1).padStart(3, '0')}/MPK-13/XI/2026`,
      decisionText: 'Rumusan ketetapan baru...',
      rationale: 'Hasil musyawarah forum.',
      category: 'Program Kerja',
      status: 'DISAHKAN',
      date: new Date().toISOString().split('T')[0],
    };
    setEditDecisions([...editDecisions, newDec]);
  };

  const handleRemoveModalDecision = (id: string) => {
    setEditDecisions(editDecisions.filter((d) => d.id !== id));
  };

  // Action item mutation helpers
  const handleAddModalActionItem = () => {
    const newItem: ActionItem = {
      id: `act-${Date.now()}`,
      description: 'Penugasan baru...',
      assignee: 'Koordinator Komisi',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'PENDING',
    };
    setEditActionItems([...editActionItems, newItem]);
  };

  const handleRemoveModalActionItem = (id: string) => {
    setEditActionItems(editActionItems.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 rounded-2xl flex items-center gap-3 text-xs animate-in slide-in-from-bottom-3 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Official Print Letterhead Layout (@media print) */}
      <div className="print-only hidden p-8 bg-white text-black font-sans leading-relaxed">
        <div className="text-center border-b-4 border-double border-black pb-4 mb-6">
          <p className="text-xs uppercase tracking-widest font-semibold text-zinc-600 m-0">
            PEMERINTAH DAERAH PROVINSI JAWA BARAT — DINAS PENDIDIKAN
          </p>
          <h2 className="text-xl font-bold uppercase m-0 text-black">MAJELIS PERWAKILAN KELAS (MPK)</h2>
          <h1 className="text-2xl font-black uppercase m-0 text-black">SMK NEGERI 13 BANDUNG</h1>
          <p className="text-[11px] text-zinc-600 mt-1">
            Jl. Soekarno-Hatta Km. 10 Bandung, Jawa Barat 40286 | Surel: mpk@smkn13bdg.sch.id
          </p>
        </div>

        <div className="text-center my-6">
          <h3 className="text-lg font-bold uppercase underline tracking-wide">RISALAH &amp; NOTULENSI RESMI SIDANG</h3>
          <p className="text-xs font-mono text-zinc-600 mt-0.5">
            Nomor Berita Acara: BA/{new Date().toISOString().split('T')[0]}/MPK-13/XI/2026
          </p>
        </div>

        <table className="w-full text-xs mb-6 border-collapse">
          <tbody>
            <tr>
              <td className="w-40 font-bold py-1 text-zinc-800">Agenda Sidang</td>
              <td className="py-1">: <strong>{meeting.title}</strong></td>
            </tr>
            <tr>
              <td className="font-bold py-1 text-zinc-800">Hari / Tanggal</td>
              <td className="py-1">: {meeting.date}</td>
            </tr>
            <tr>
              <td className="font-bold py-1 text-zinc-800">Tempat Sidang</td>
              <td className="py-1">: {meeting.location}</td>
            </tr>
            <tr>
              <td className="font-bold py-1 text-zinc-800">Penyelenggara</td>
              <td className="py-1">: {meeting.organizer}</td>
            </tr>
            <tr>
              <td className="font-bold py-1 text-zinc-800">Pimpinan Sidang</td>
              <td className="py-1">: {meeting.leaderName || 'Presidium Sidang MPK 13'}</td>
            </tr>
            <tr>
              <td className="font-bold py-1 text-zinc-800">Notulis / Sekretaris</td>
              <td className="py-1">: {meeting.noteTakerName || 'Notulis Sidang'}</td>
            </tr>
          </tbody>
        </table>

        <div className="space-y-5 text-xs text-black">
          <div>
            <h4 className="font-bold uppercase border-b border-black pb-1 mb-2">I. Ringkasan Eksekutif Hasil Sidang</h4>
            <p className="leading-relaxed bg-zinc-50 p-3 border-l-4 border-black">
              {meeting.executiveSummary || 'Belum ada ringkasan eksekutif.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase border-b border-black pb-1 mb-2">II. Pokok Bahasan &amp; Agenda Pleno</h4>
            <div className="space-y-3">
              {meeting.agendas.map((ag, idx) => (
                <div key={idx} className="pl-2">
                  <p className="font-bold">{idx + 1}. {ag.title}</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {ag.discussionPoints.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase border-b border-black pb-1 mb-2">III. Ketetapan &amp; Keputusan Resmi Majelis</h4>
            {meeting.decisions.length === 0 ? (
              <p className="italic text-zinc-500">(Belum ada keputusan resmi yang disahkan)</p>
            ) : (
              <table className="w-full border border-black border-collapse mt-2">
                <thead>
                  <tr className="bg-zinc-100 border-b border-black">
                    <th className="border border-black p-2 text-left">Nomor</th>
                    <th className="border border-black p-2 text-left">Kategori</th>
                    <th className="border border-black p-2 text-left">Isi Ketetapan</th>
                    <th className="border border-black p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {meeting.decisions.map((d) => (
                    <tr key={d.id} className="border-b border-black">
                      <td className="border border-black p-2 font-mono">{d.number}</td>
                      <td className="border border-black p-2">{d.category}</td>
                      <td className="border border-black p-2">{d.decisionText}</td>
                      <td className="border border-black p-2 text-center font-bold">{d.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div>
            <h4 className="font-bold uppercase border-b border-black pb-1 mb-2">IV. Tindak Lanjut &amp; Penugasan (Action Items)</h4>
            {meeting.actionItems.length === 0 ? (
              <p className="italic text-zinc-500">(Belum ada penugasan)</p>
            ) : (
              <table className="w-full border border-black border-collapse mt-2">
                <thead>
                  <tr className="bg-zinc-100 border-b border-black">
                    <th className="border border-black p-2 text-left">Uraian Tugas</th>
                    <th className="border border-black p-2 text-left">Penanggung Jawab</th>
                    <th className="border border-black p-2 text-center">Tenggat</th>
                    <th className="border border-black p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {meeting.actionItems.map((a) => (
                    <tr key={a.id} className="border-b border-black">
                      <td className="border border-black p-2">{a.description}</td>
                      <td className="border border-black p-2 font-bold">{a.assignee}</td>
                      <td className="border border-black p-2 text-center">{a.dueDate}</td>
                      <td className="border border-black p-2 text-center">{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="grid grid-cols-2 text-center pt-12 gap-8">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Ketua MPK SMK Negeri 13 Bandung</p>
              <div className="h-16"></div>
              <p className="underline font-bold">({meeting.leaderName || 'Presidium Sidang'})</p>
              <p className="text-[10px] text-zinc-600">NIS. MPK-13/2026</p>
            </div>
            <div>
              <p>Bandung, {new Date().toISOString().split('T')[0]}</p>
              <p className="font-bold">Notulis / Sekretaris Sidang</p>
              <div className="h-16"></div>
              <p className="underline font-bold">{meeting.noteTakerName || 'Notulis Sidang'}</p>
              <p className="text-[10px] text-zinc-600">Notulis Pleno Majelis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Screen View: Executive Document Surface */}
      <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-8 space-y-7 shadow-[6px_6px_0px_0px_#000]">
        {/* Header & Control Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b-2 border-black/10 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full bg-[#FFD93D] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                DOKUMEN SIDANG RESMI
              </span>
              <span className="text-[11px] font-black text-black px-2.5 py-0.5 rounded bg-[#FFFDF5] border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                {meeting.formatStandard === 'RISALAH_PADAT'
                  ? 'Risalah Padat & Ketetapan Inti'
                  : meeting.formatStandard === 'RAPAT_KERJA_ANGGARAN'
                  ? 'Format Anggaran Kas & Belanja'
                  : meeting.formatStandard === 'LPJ_EVALUASI'
                  ? 'Format Evaluasi LPJ'
                  : 'Tata Naskah Dinas MPK 13'}
              </span>
              {meeting.lastSavedAt && (
                <span className="text-[10px] font-black text-black bg-[#A7F3D0] border-2 border-black px-2.5 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_0px_#000]">
                  Draf Tersimpan: {meeting.lastSavedAt}
                </span>
              )}
              {meeting.isArchived && (
                <span className="text-[10px] font-mono font-black text-black bg-[#FEF08A] border-2 border-black px-2.5 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1">
                  <Archive className="w-3 h-3 stroke-[2.5]" />
                  <span>{meeting.archiveNumber || 'ARSIP RESMI'}</span>
                </span>
              )}
              {googleAccount.connected && (
                <span
                  className={`text-[10px] font-mono font-black border-2 border-black px-2.5 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 ${
                    isAutoSyncing ? 'bg-[#FEF08A] text-black animate-pulse' : 'bg-[#E0F2FE] text-sky-950'
                  }`}
                  title={
                    isAutoSyncing
                      ? 'Sedang mencadangkan otomatis ke Google Drive...'
                      : `Tercadangkan otomatis ke Google Drive (${googleAccount.email || 'Cloud'})`
                  }
                >
                  {isAutoSyncing ? (
                    <>
                      <RefreshCw className="w-3 h-3 stroke-[2.5] animate-spin" />
                      <span>CLOUD SYNCING...</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-3 h-3 stroke-[2.5] text-sky-700" />
                      <span>CLOUD AUTO-SAVED</span>
                    </>
                  )}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-snug">
              {meeting.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-800 font-bold text-[11px] pt-0.5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-black stroke-[2.2]" />
                {meeting.date}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-black stroke-[2.2]" />
                {meeting.location}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-black stroke-[2.2]" />
                {meeting.organizer}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-black stroke-[2.2]" />
                {Math.floor(meeting.durationSeconds / 60)} Menit Audio
              </span>
            </div>
          </div>

          {/* Primary Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFDF5] border-2 border-black p-3 rounded-2xl shadow-[3px_3px_0px_0px_#000]">
            {/* Group 1: Draf & Format */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={openModificationModal}
                title="Buka panel modifikasi format tata naskah, pokok agenda, keputusan, dan penugasan sidang"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#C4B5FD] hover:bg-[#b5a3fc] text-black font-black rounded-xl text-xs border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>Modifikasi Format</span>
              </button>

              <button
                onClick={handleManualSaveDraft}
                title="Simpan status draf saat ini secara online ke penyimpanan lokal"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#A7F3D0] hover:bg-emerald-300 text-black font-black border-2 border-black rounded-xl text-xs shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>Simpan Draf</span>
              </button>

              {/* Action: Jadikan / Batal Arsip */}
              <button
                onClick={handleToggleArchive}
                title={
                  meeting.isArchived
                    ? 'Sesi ini telah terdaftar sebagai Arsip Resmi MPK 13. Klik untuk membatalkan status arsip.'
                    : 'Kunci dan daftarkan sesi ini sebagai Arsip Resmi MPK 13'
                }
                className={`flex items-center gap-1.5 px-3.5 py-2 font-black border-2 border-black rounded-xl text-xs shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                  meeting.isArchived
                    ? 'bg-[#FEF08A] text-black ring-2 ring-black'
                    : 'bg-[#FFE600] hover:bg-[#ffd93d] text-black'
                }`}
              >
                <Archive className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>{meeting.isArchived ? 'Arsip Terdaftar' : 'Jadikan Arsip'}</span>
              </button>
            </div>

            {/* Group 2: Ekspor Dokumen & Kirim WA */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden xl:inline text-[10px] font-black uppercase tracking-wider text-black mr-1">
                Ekspor:
              </span>

              {/* Export 1: Kirim ke WhatsApp Langsung (Super Prominent) */}
              <button
                onClick={shareToWhatsAppDirect}
                title="Kirim naskah risalah langsung ke aplikasi WhatsApp / WhatsApp Web"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#4ECDC4] hover:bg-teal-400 text-black font-black rounded-xl text-xs border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
                <span>Kirim WA</span>
              </button>

              {/* Export 2: Unduh Word (.doc) */}
              <button
                onClick={exportWord}
                title="Unduh dokumen Microsoft Word (.doc) lengkap dengan kop dan tabel keputusan"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#38BDF8] hover:bg-sky-400 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>Word</span>
              </button>

              {/* Export 3: Cetak PDF */}
              <button
                onClick={() => window.print()}
                title="Cetak langsung atau simpan dokumen PDF resmi ber-kop sekolah"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF6B6B] hover:bg-rose-500 text-black font-black border-2 border-black rounded-xl text-xs shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>PDF</span>
              </button>

              {/* Export 4: Unduh Excel (.xls) */}
              <button
                onClick={exportExcel}
                title="Unduh tabel rekapitulasi keputusan dan penugasan sidang dalam format Excel (.xls)"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#86EFAC] hover:bg-green-400 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>Excel</span>
              </button>

              {/* Export 5: Unduh TXT */}
              <button
                onClick={exportTxt}
                title="Unduh format teks polos terstruktur (.txt)"
                className="flex items-center gap-1.5 px-2.5 py-2 bg-[#FFFDF5] hover:bg-yellow-100 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>TXT</span>
              </button>

              {/* Pratinjau Pesan WA */}
              <button
                onClick={() => setShowWaModal(true)}
                title="Buka pratinjau pesan teks format WhatsApp"
                className="p-2 bg-[#FFFDF5] hover:bg-yellow-100 text-black border-2 border-black rounded-xl text-xs shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                aria-label="Buka pratinjau pesan WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              </button>

              {/* Salin MD */}
              <button
                onClick={exportMarkdown}
                title="Salin naskah Markdown"
                className="p-2 bg-[#FFFDF5] hover:bg-yellow-100 text-black border-2 border-black rounded-xl text-xs shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                aria-label="Salin naskah Markdown"
              >
                {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 text-black stroke-[2.5]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Secretary Notes Directive Indicator */}
        {meeting.secretaryNotes && (
          <div className="p-4 bg-[#FEF08A] border-2 border-black rounded-2xl flex items-start gap-3 shadow-[3px_3px_0px_0px_#000]">
            <Sparkles className="w-5 h-5 text-black stroke-[2.5] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-black font-black block">
                Catatan Pengarah Notulis / Sekretaris
              </span>
              <p className="text-xs text-zinc-900 leading-relaxed font-sans font-medium">{meeting.secretaryNotes}</p>
            </div>
          </div>
        )}

        {/* Section 1: Ringkasan Eksekutif */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-xs text-black bg-[#FFD93D] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">01</span>
            <h2 className="text-xs font-black uppercase tracking-[0.14em] text-black">
              Ringkasan Eksekutif Hasil Sidang
            </h2>
          </div>
          <div className="p-5 bg-[#FFFDF5] border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000]">
            <p className="text-xs sm:text-sm text-zinc-900 leading-relaxed font-sans font-medium">
              {meeting.executiveSummary ||
                'Belum ada ringkasan eksekutif. Anda dapat menambahkannya melalui tombol "Modifikasi Format" atau memproses transkrip audio.'}
            </p>
          </div>
        </div>

        {/* Section 2: Agenda & Pokok Bahasan */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-xs text-black bg-[#FFD93D] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">02</span>
            <h2 className="text-xs font-black uppercase tracking-[0.14em] text-black">
              Pokok Bahasan &amp; Agenda Pleno ({meeting.agendas.length})
            </h2>
          </div>
          <div className="space-y-3">
            {meeting.agendas.map((ag, idx) => (
              <div key={idx} className="p-4 sm:p-5 bg-[#FFFDF5] border-2 border-black rounded-2xl space-y-2.5 shadow-[3px_3px_0px_0px_#000]">
                <h3 className="text-xs sm:text-sm font-black text-black">
                  {idx + 1}. {ag.title}
                </h3>
                <ul className="space-y-1.5 pl-4 list-disc text-xs text-zinc-800 marker:text-black font-medium">
                  {ag.discussionPoints.map((pt, ptIdx) => (
                    <li key={ptIdx} className="leading-relaxed">
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Ketetapan & Keputusan Resmi */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-black text-xs text-black bg-[#FFD93D] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">03</span>
              <h2 className="text-xs font-black uppercase tracking-[0.14em] text-black">
                Ketetapan &amp; Keputusan Resmi Majelis ({meeting.decisions.length})
              </h2>
            </div>
          </div>

          <div className="space-y-2.5">
            {meeting.decisions.map((dec) => (
              <div
                key={dec.id}
                className="p-4 bg-[#FFFDF5] border-2 border-black rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-black font-black bg-yellow-100 border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">[{dec.number}]</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                      {dec.category}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#A7F3D0] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                      {dec.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-black text-black">{dec.decisionText}</p>
                  {dec.rationale && (
                    <p className="text-[11px] text-zinc-700 italic font-medium">Pertimbangan: {dec.rationale}</p>
                  )}
                </div>
                <span className="text-[10px] text-zinc-700 font-mono font-bold shrink-0">{dec.date}</span>
              </div>
            ))}

            {/* Quick Add Decision Input */}
            <form onSubmit={handleAddDecision} className="flex flex-col sm:flex-row gap-2 pt-2">
              <label htmlFor="quick-add-decision-text" className="sr-only">
                Rumuskan ketetapan keputusan sidang baru
              </label>
              <input
                id="quick-add-decision-text"
                name="quick-add-decision-text"
                type="text"
                placeholder="Rumuskan ketetapan keputusan sidang baru..."
                aria-label="Rumuskan ketetapan keputusan sidang baru"
                value={newDecisionText}
                onChange={(e) => setNewDecisionText(e.target.value)}
                className="flex-1 bg-[#FFFDF5] border-2 border-black rounded-xl px-3.5 py-2 text-xs text-black font-medium placeholder:text-zinc-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black"
              />
              <label htmlFor="quick-add-decision-category" className="sr-only">
                Kategori Keputusan Sidang
              </label>
              <select
                id="quick-add-decision-category"
                name="quick-add-decision-category"
                aria-label="Kategori Keputusan Sidang"
                value={newDecisionCategory}
                onChange={(e) => setNewDecisionCategory(e.target.value as Decision['category'])}
                className="bg-white border-2 border-black text-xs text-black font-black rounded-xl px-3 py-2 shadow-[2px_2px_0px_0px_#000] focus:outline-none cursor-pointer"
              >
                <option value="Organisasi">Organisasi</option>
                <option value="Keuangan">Keuangan</option>
                <option value="Program Kerja">Program Kerja</option>
                <option value="Disiplin">Disiplin</option>
                <option value="Umum">Umum</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-[#FFD93D] hover:bg-yellow-400 text-black rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Sahkan</span>
              </button>
            </form>
          </div>
        </div>

        {/* Section 4: Action Items (Tindak Lanjut) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-xs text-black bg-[#FFD93D] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">04</span>
            <h2 className="text-xs font-black uppercase tracking-[0.14em] text-black">
              Tindak Lanjut &amp; Penugasan Komisi ({meeting.actionItems.length})
            </h2>
          </div>

          <div className="space-y-2">
            {meeting.actionItems.map((act) => {
              const isDone = act.status === 'COMPLETED';
              return (
                <div
                  key={act.id}
                  onClick={() => toggleActionStatus(act.id)}
                  className={`p-3 sm:p-3.5 rounded-2xl border-2 border-black transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 select-none touch-manipulation ${
                    isDone
                      ? 'bg-zinc-100 text-zinc-500 line-through shadow-[1.5px_1.5px_0px_0px_#000]'
                      : 'bg-[#FFFDF5] hover:bg-white text-black shadow-[2.5px_2.5px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] sm:hover:-translate-x-0.5 sm:hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <label htmlFor={`action-status-checkbox-${act.id}`} className="sr-only">
                      Status penugasan: {act.description}
                    </label>
                    <input
                      id={`action-status-checkbox-${act.id}`}
                      name={`action-status-checkbox-${act.id}`}
                      type="checkbox"
                      aria-label={`Status penugasan: ${act.description}`}
                      checked={isDone}
                      onChange={() => toggleActionStatus(act.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-2 border-black accent-black cursor-pointer shrink-0"
                    />
                    <span className="text-xs sm:text-sm font-black">{act.description}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-zinc-800 font-bold text-[11px] shrink-0 self-end sm:self-auto">
                    <span className="px-2 py-0.5 rounded bg-white border border-black font-black shadow-[1px_1px_0px_0px_#000]">
                      PJ: {act.assignee}
                    </span>
                    <span className="text-zinc-700">Tenggat: {act.dueDate}</span>
                  </div>
                </div>
              );
            })}

            {/* Quick Add Action Item */}
            <form onSubmit={handleAddActionItem} className="flex flex-col sm:flex-row gap-2 pt-2">
              <label htmlFor="quick-add-action-task" className="sr-only">
                Rincian tugas atau komitmen aksi
              </label>
              <input
                id="quick-add-action-task"
                name="quick-add-action-task"
                type="text"
                placeholder="Rincian tugas atau komitmen aksi..."
                aria-label="Rincian tugas atau komitmen aksi"
                value={newActionTask}
                onChange={(e) => setNewActionTask(e.target.value)}
                className="flex-1 bg-[#FFFDF5] border-2 border-black rounded-xl px-3.5 py-2 text-xs text-black font-medium placeholder:text-zinc-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black"
              />
              <label htmlFor="quick-add-action-assignee" className="sr-only">
                Penanggung Jawab (PIC)
              </label>
              <input
                id="quick-add-action-assignee"
                name="quick-add-action-assignee"
                type="text"
                placeholder="Penanggung Jawab (PIC)"
                aria-label="Penanggung Jawab (PIC)"
                value={newActionAssignee}
                onChange={(e) => setNewActionAssignee(e.target.value)}
                className="w-full sm:w-44 bg-[#FFFDF5] border-2 border-black rounded-xl px-3.5 py-2 text-xs text-black font-medium placeholder:text-zinc-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black"
              />
              <label htmlFor="quick-add-action-duedate" className="sr-only">
                Tenggat Waktu Tugas
              </label>
              <input
                id="quick-add-action-duedate"
                name="quick-add-action-duedate"
                type="date"
                aria-label="Tenggat Waktu Tugas"
                value={newActionDueDate}
                onChange={(e) => setNewActionDueDate(e.target.value)}
                className="bg-white border-2 border-black text-xs text-black font-bold rounded-xl px-3 py-2 shadow-[2px_2px_0px_0px_#000] focus:outline-none cursor-pointer"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#FFD93D] hover:bg-yellow-400 text-black rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Tambah</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MODAL 1: Pratinjau Pesan WhatsApp */}
      {showWaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border-[3px] border-black rounded-2xl max-w-2xl w-full p-6 sm:p-7 space-y-5 flex flex-col max-h-[90vh] shadow-[8px_8px_0px_0px_#000]">
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#4ECDC4] border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                  <Share2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-black tracking-tight">
                    Format Pesan WhatsApp (WA)
                  </h3>
                  <p className="text-[11px] text-zinc-700 font-bold">
                    Siap disebarkan ke grup WhatsApp pengurus MPK / OSIS SMK Negeri 13 Bandung
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWaModal(false)}
                className="text-black hover:bg-yellow-100 p-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
                aria-label="Tutup Pratinjau WhatsApp"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* WA Text Preview Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#FFFDF5] border-2 border-black rounded-2xl font-mono text-xs text-black whitespace-pre-wrap leading-relaxed shadow-[3px_3px_0px_0px_#000] selection:bg-[#FFE600]">
              {generateWhatsAppText()}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-zinc-700 font-bold">
                Format otomatis: bold (*), bullet (- / •), penomoran resmi
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={copyWhatsApp}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#A7F3D0] hover:bg-emerald-300 text-black font-black border-2 border-black rounded-xl text-xs shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  {copiedWa ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                  <span>{copiedWa ? 'Tersalin ke Clipboard!' : 'Salin Pesan WA'}</span>
                </button>

                <button
                  onClick={shareToWhatsAppDirect}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFD93D] hover:bg-yellow-400 text-black font-black rounded-xl text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Kirim Langsung</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MODIFIKASI FORMAT & NASKAH SIDANG LENGKAP */}
      {isModifying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] flex flex-col my-auto shadow-[8px_8px_0px_0px_#000]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C4B5FD] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000]">
                  <SlidersHorizontal className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-black tracking-tight">
                    Modifikasi Format &amp; Naskah Risalah Sidang
                  </h3>
                  <p className="text-xs text-zinc-700 font-medium">
                    Sesuaikan standar tata naskah dinas, ubah rincian agenda, keputusan pleno, dan komitmen penugasan
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModifying(false)}
                className="text-black hover:bg-yellow-100 p-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
                aria-label="Tutup Modal Modifikasi"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Body: Scrollable Form */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {/* Standar Format Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-black block">
                  Pilih Standar Format Tata Naskah:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {[
                    {
                      key: 'TATA_NASKAH_DINAS' as MeetingFormatStandard,
                      title: 'Tata Naskah Dinas MPK 13',
                      desc: 'Format Berita Acara & SK Resmi lengkap',
                    },
                    {
                      key: 'RISALAH_PADAT' as MeetingFormatStandard,
                      title: 'Risalah Padat & Ketetapan',
                      desc: 'Format ringkas fokus keputusan cepat',
                    },
                    {
                      key: 'RAPAT_KERJA_ANGGARAN' as MeetingFormatStandard,
                      title: 'Rapat Kerja & Anggaran Kas',
                      desc: 'Fokus alokasi dana dan belanja',
                    },
                    {
                      key: 'LPJ_EVALUASI' as MeetingFormatStandard,
                      title: 'Evaluasi & Pertanggungjawaban',
                      desc: 'Fokus capaian dan kendala komisi',
                    },
                  ].map((fmt) => (
                    <button
                      key={fmt.key}
                      type="button"
                      onClick={() => setEditFormatStandard(fmt.key)}
                      className={`p-3 rounded-xl border-2 border-black text-left transition-all cursor-pointer ${
                        editFormatStandard === fmt.key
                          ? 'bg-[#FFD93D] shadow-[3px_3px_0px_0px_#000] text-black font-black'
                          : 'bg-[#FFFDF5] border-black/70 hover:border-black text-black font-bold shadow-[1.5px_1.5px_0px_0px_#000]'
                      }`}
                    >
                      <p className="text-xs font-black text-black">{fmt.title}</p>
                      <p className="text-[10px] text-zinc-700 font-medium mt-1">{fmt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* General Metadata Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label htmlFor="edit-modal-title" className="text-[11px] font-black text-black">Judul / Agenda Sidang:</label>
                  <input
                    id="edit-modal-title"
                    name="edit-modal-title"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    aria-label="Judul atau Agenda Sidang"
                    className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs text-black font-medium shadow-[1.5px_1.5px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-modal-date" className="text-[11px] font-black text-black">Waktu &amp; Tanggal:</label>
                  <input
                    id="edit-modal-date"
                    name="edit-modal-date"
                    type="text"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    aria-label="Waktu dan Tanggal Sidang"
                    className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs text-black font-medium shadow-[1.5px_1.5px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-modal-location" className="text-[11px] font-black text-black">Ruangan / Tempat:</label>
                  <input
                    id="edit-modal-location"
                    name="edit-modal-location"
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    aria-label="Ruangan atau Tempat Sidang"
                    className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs text-black font-medium shadow-[1.5px_1.5px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-modal-organizer" className="text-[11px] font-black text-black">Penyelenggara:</label>
                  <input
                    id="edit-modal-organizer"
                    name="edit-modal-organizer"
                    type="text"
                    value={editOrganizer}
                    onChange={(e) => setEditOrganizer(e.target.value)}
                    aria-label="Penyelenggara Sidang"
                    className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs text-black font-medium shadow-[1.5px_1.5px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-modal-leader" className="text-[11px] font-black text-black">Pimpinan Sidang (Presidium):</label>
                  <input
                    id="edit-modal-leader"
                    name="edit-modal-leader"
                    type="text"
                    value={editLeaderName}
                    onChange={(e) => setEditLeaderName(e.target.value)}
                    placeholder="Ketua MPK 13"
                    aria-label="Pimpinan Sidang (Presidium)"
                    className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs text-black font-medium shadow-[1.5px_1.5px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-modal-notetaker" className="text-[11px] font-black text-black">Notulis / Sekretaris Sidang:</label>
                  <input
                    id="edit-modal-notetaker"
                    name="edit-modal-notetaker"
                    type="text"
                    value={editNoteTakerName}
                    onChange={(e) => setEditNoteTakerName(e.target.value)}
                    placeholder="Nama Notulis / Sekretaris Sidang"
                    aria-label="Notulis atau Sekretaris Sidang"
                    className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs text-black font-medium shadow-[1.5px_1.5px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Catatan Pengarah Sekretaris */}
              <div className="space-y-1">
                <label htmlFor="edit-modal-secretary-notes" className="text-xs font-black text-black">
                  Catatan Pengarah Notulis (Arahan Format &amp; Diksi):
                </label>
                <textarea
                  id="edit-modal-secretary-notes"
                  name="edit-modal-secretary-notes"
                  value={editSecretaryNotes}
                  onChange={(e) => setEditSecretaryNotes(e.target.value)}
                  rows={2}
                  aria-label="Catatan Pengarah Notulis"
                  className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs text-black font-medium shadow-[1.5px_1.5px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black font-sans"
                />
              </div>

              {/* Ringkasan Eksekutif */}
              <div className="space-y-1">
                <label htmlFor="edit-modal-summary" className="text-xs font-black text-black">
                  Ringkasan Eksekutif Hasil Sidang:
                </label>
                <textarea
                  id="edit-modal-summary"
                  name="edit-modal-summary"
                  value={editExecutiveSummary}
                  onChange={(e) => setEditExecutiveSummary(e.target.value)}
                  rows={4}
                  aria-label="Ringkasan Eksekutif Hasil Sidang"
                  className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs text-black font-medium shadow-[1.5px_1.5px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black font-sans leading-relaxed"
                />
              </div>

              {/* Agendas Editor */}
              <div className="space-y-3 border-t-2 border-black/10 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-black">
                    Pokok Bahasan &amp; Agenda Pleno ({editAgendas.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddAgenda}
                    className="flex items-center gap-1 px-3 py-1 bg-[#FFD93D] hover:bg-yellow-400 text-black text-xs font-black rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Tambah Agenda</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {editAgendas.map((ag, agIdx) => (
                    <div key={agIdx} className="p-4 bg-[#FFFDF5] border-2 border-black rounded-2xl space-y-2 shadow-[3px_3px_0px_0px_#000]">
                      <div className="flex items-center justify-between gap-2">
                        <label htmlFor={`edit-agenda-title-${agIdx}`} className="sr-only">
                          Judul Agenda {agIdx + 1}
                        </label>
                        <input
                          id={`edit-agenda-title-${agIdx}`}
                          name={`edit-agenda-title-${agIdx}`}
                          type="text"
                          value={ag.title}
                          onChange={(e) => {
                            const updated = [...editAgendas];
                            updated[agIdx].title = e.target.value;
                            setEditAgendas(updated);
                          }}
                          aria-label={`Judul Agenda ${agIdx + 1}`}
                          className="flex-1 bg-white border-2 border-black rounded-lg px-2.5 py-1.5 text-xs text-black font-black"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAgenda(agIdx)}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                          aria-label="Hapus Agenda"
                        >
                          <Trash2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>

                      <div className="space-y-1.5 pl-2">
                        {ag.discussionPoints.map((pt, ptIdx) => (
                          <div key={ptIdx} className="flex items-center gap-2">
                            <span className="text-black font-black text-xs">•</span>
                            <label htmlFor={`edit-agenda-point-${agIdx}-${ptIdx}`} className="sr-only">
                              Poin Bahasan {ptIdx + 1} Agenda {agIdx + 1}
                            </label>
                            <input
                              id={`edit-agenda-point-${agIdx}-${ptIdx}`}
                              name={`edit-agenda-point-${agIdx}-${ptIdx}`}
                              type="text"
                              value={pt}
                              onChange={(e) => {
                                const updated = [...editAgendas];
                                updated[agIdx].discussionPoints[ptIdx] = e.target.value;
                                setEditAgendas(updated);
                              }}
                              aria-label={`Poin Bahasan ${ptIdx + 1} dari Agenda ${agIdx + 1}`}
                              className="flex-1 bg-white border-2 border-black rounded-lg px-2.5 py-1 text-xs text-black font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveDiscussionPoint(agIdx, ptIdx)}
                              className="text-rose-600 hover:text-rose-800 p-0.5 cursor-pointer"
                              aria-label="Hapus Poin Bahasan"
                            >
                              <X className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddDiscussionPoint(agIdx)}
                          className="text-xs text-black font-black hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                          <span>Tambah Poin Pembahasan</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decisions Editor */}
              <div className="space-y-3 border-t-2 border-black/10 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-black">
                    Ketetapan &amp; Keputusan Resmi Majelis ({editDecisions.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddModalDecision}
                    className="flex items-center gap-1 px-3 py-1 bg-[#FFD93D] hover:bg-yellow-400 text-black text-xs font-black rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Tambah Ketetapan</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editDecisions.map((dec, decIdx) => (
                    <div key={dec.id} className="p-3 bg-[#FFFDF5] border-2 border-black rounded-xl flex flex-col sm:flex-row gap-2 items-start sm:items-center shadow-[2px_2px_0px_0px_#000]">
                      <label htmlFor={`edit-decision-number-${dec.id}`} className="sr-only">
                        Nomor Ketetapan {decIdx + 1}
                      </label>
                      <input
                        id={`edit-decision-number-${dec.id}`}
                        name={`edit-decision-number-${dec.id}`}
                        type="text"
                        value={dec.number}
                        onChange={(e) => {
                          const updated = [...editDecisions];
                          updated[decIdx].number = e.target.value;
                          setEditDecisions(updated);
                        }}
                        aria-label={`Nomor Ketetapan ${decIdx + 1}`}
                        className="w-full sm:w-36 bg-white border-2 border-black rounded-lg px-2 py-1 text-xs font-mono font-bold text-black"
                      />
                      <label htmlFor={`edit-decision-text-${dec.id}`} className="sr-only">
                        Isi Ketetapan {decIdx + 1}
                      </label>
                      <input
                        id={`edit-decision-text-${dec.id}`}
                        name={`edit-decision-text-${dec.id}`}
                        type="text"
                        value={dec.decisionText}
                        onChange={(e) => {
                          const updated = [...editDecisions];
                          updated[decIdx].decisionText = e.target.value;
                          setEditDecisions(updated);
                        }}
                        aria-label={`Isi Ketetapan ${decIdx + 1}`}
                        className="flex-1 bg-white border-2 border-black rounded-lg px-2.5 py-1 text-xs text-black font-medium"
                      />
                      <label htmlFor={`edit-decision-status-${dec.id}`} className="sr-only">
                        Status Ketetapan {decIdx + 1}
                      </label>
                      <select
                        id={`edit-decision-status-${dec.id}`}
                        name={`edit-decision-status-${dec.id}`}
                        value={dec.status}
                        onChange={(e) => {
                          const updated = [...editDecisions];
                          updated[decIdx].status = e.target.value as Decision['status'];
                          setEditDecisions(updated);
                        }}
                        aria-label={`Status Ketetapan ${decIdx + 1}`}
                        className="bg-white border-2 border-black rounded-lg px-2 py-1 text-xs text-black font-bold font-mono"
                      >
                        <option value="DISAHKAN">DISAHKAN</option>
                        <option value="DITUNDA">DITUNDA</option>
                        <option value="DITOLAK">DITOLAK</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveModalDecision(dec.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer shrink-0"
                        aria-label="Hapus Ketetapan"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items Editor */}
              <div className="space-y-3 border-t-2 border-black/10 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-black">
                    Tindak Lanjut &amp; Penugasan Komisi ({editActionItems.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddModalActionItem}
                    className="flex items-center gap-1 px-3 py-1 bg-[#FFD93D] hover:bg-yellow-400 text-black text-xs font-black rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Tambah Tugas</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editActionItems.map((act, actIdx) => (
                    <div key={act.id} className="p-3 bg-[#FFFDF5] border-2 border-black rounded-xl flex flex-col sm:flex-row gap-2 items-start sm:items-center shadow-[2px_2px_0px_0px_#000]">
                      <label htmlFor={`edit-action-desc-${act.id}`} className="sr-only">
                        Rincian Tugas {actIdx + 1}
                      </label>
                      <input
                        id={`edit-action-desc-${act.id}`}
                        name={`edit-action-desc-${act.id}`}
                        type="text"
                        value={act.description}
                        onChange={(e) => {
                          const updated = [...editActionItems];
                          updated[actIdx].description = e.target.value;
                          setEditActionItems(updated);
                        }}
                        placeholder="Rincian tugas..."
                        aria-label={`Rincian Tugas ${actIdx + 1}`}
                        className="flex-1 bg-white border-2 border-black rounded-lg px-2.5 py-1 text-xs text-black font-medium"
                      />
                      <label htmlFor={`edit-action-assignee-${act.id}`} className="sr-only">
                        Penanggung Jawab PIC Tugas {actIdx + 1}
                      </label>
                      <input
                        id={`edit-action-assignee-${act.id}`}
                        name={`edit-action-assignee-${act.id}`}
                        type="text"
                        value={act.assignee}
                        onChange={(e) => {
                          const updated = [...editActionItems];
                          updated[actIdx].assignee = e.target.value;
                          setEditActionItems(updated);
                        }}
                        placeholder="PIC"
                        aria-label={`Penanggung Jawab PIC Tugas ${actIdx + 1}`}
                        className="w-full sm:w-32 bg-white border-2 border-black rounded-lg px-2 py-1 text-xs text-black font-bold font-mono"
                      />
                      <label htmlFor={`edit-action-duedate-${act.id}`} className="sr-only">
                        Tenggat Waktu Tugas {actIdx + 1}
                      </label>
                      <input
                        id={`edit-action-duedate-${act.id}`}
                        name={`edit-action-duedate-${act.id}`}
                        type="date"
                        value={act.dueDate}
                        onChange={(e) => {
                          const updated = [...editActionItems];
                          updated[actIdx].dueDate = e.target.value;
                          setEditActionItems(updated);
                        }}
                        aria-label={`Tenggat Waktu Tugas ${actIdx + 1}`}
                        className="bg-white border-2 border-black rounded-lg px-2 py-1 text-xs text-black font-bold font-mono"
                      />
                      <label htmlFor={`edit-action-status-${act.id}`} className="sr-only">
                        Status Tugas {actIdx + 1}
                      </label>
                      <select
                        id={`edit-action-status-${act.id}`}
                        name={`edit-action-status-${act.id}`}
                        value={act.status}
                        onChange={(e) => {
                          const updated = [...editActionItems];
                          updated[actIdx].status = e.target.value as ActionItem['status'];
                          setEditActionItems(updated);
                        }}
                        aria-label={`Status Tugas ${actIdx + 1}`}
                        className="bg-white border-2 border-black rounded-lg px-2 py-1 text-xs text-black font-bold font-mono"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">PROSES</option>
                        <option value="COMPLETED">SELESAI</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveModalActionItem(act.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer shrink-0"
                        aria-label="Hapus Tugas"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-black/10 pt-4">
              <button
                type="button"
                onClick={handleAiReformat}
                disabled={isAiReformatting || !meeting.transcript || meeting.transcript.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C4B5FD] hover:bg-[#b5a3fc] text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-40 cursor-pointer"
              >
                {isAiReformatting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-black stroke-[2.5]" />
                    <span>AI Sedang Menyusun Ulang Sesuai Format...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                    <span>Format Ulang Otomatis via AI</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsModifying(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-[#FFFDF5] hover:bg-yellow-100 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplyModifications}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#FFE600] hover:bg-[#ffd93d] text-black font-black rounded-xl text-xs border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  <span>Terapkan Perubahan Format &amp; Naskah</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
