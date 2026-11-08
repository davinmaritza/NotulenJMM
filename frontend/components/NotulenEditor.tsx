'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Copy,
  Printer,
  Calendar,
  User,
  PlusCircle,
  Scale,
  Sparkles,
  Check,
  Download,
  Share2,
  X,
  ExternalLink,
  FileCode,
  MapPin,
  Clock,
} from 'lucide-react';
import { Meeting, Decision, ActionItem } from '../lib/types';

interface NotulenEditorProps {
  meeting?: Meeting | null;
  onUpdateMeeting: (updated: Meeting) => void;
}

export const NotulenEditor: React.FC<NotulenEditorProps> = ({ meeting, onUpdateMeeting }) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);
  const [showWaModal, setShowWaModal] = useState(false);
  const [newDecisionText, setNewDecisionText] = useState('');
  const [newDecisionCategory, setNewDecisionCategory] = useState<Decision['category']>('Program Kerja');
  const [newActionTask, setNewActionTask] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('');
  const [newActionDueDate, setNewActionDueDate] = useState('');

  if (!meeting) {
    return (
      <div className="bg-[#111318] border border-white/[0.08] rounded-3xl p-10 sm:p-14 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
          <FileText className="w-8 h-8 text-zinc-500" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h2 className="text-lg font-bold text-white tracking-tight">Belum Ada Sesi Rapat Aktif</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Silakan buat sesi rapat baru di Dashboard atau unggah rekaman audio sekretaris di tab &quot;Studio Rekam&quot; untuk menghasilkan notulensi resmi secara otomatis.
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

    onUpdateMeeting({ ...meeting, actionItems: updatedActions });
  };

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecisionText.trim()) return;

    const newDecision: Decision = {
      id: `dec-${Date.now()}`,
      number: `KEP/${String(meeting.decisions.length + 1).padStart(3, '0')}/MPK-13/XI/2026`,
      decisionText: newDecisionText.trim(),
      rationale: 'Keputusan hasil kesepakatan forum rapat pleno.',
      category: newDecisionCategory,
      status: 'DISAHKAN',
      date: new Date().toISOString().split('T')[0],
    };

    onUpdateMeeting({
      ...meeting,
      decisions: [...meeting.decisions, newDecision],
    });
    setNewDecisionText('');
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
    });
    setNewActionTask('');
    setNewActionAssignee('');
    setNewActionDueDate('');
  };

  // 1. Export Markdown (Clipboard)
  const exportMarkdown = () => {
    let md = `# NOTULENSI RESMI SIDANG / RAPAT\n`;
    md += `## MAJELIS PERWAKILAN KELAS (MPK) SMK NEGERI 13 BANDUNG\n\n`;
    md += `**Judul Rapat:** ${meeting.title}\n`;
    md += `**Tanggal:** ${meeting.date}\n`;
    md += `**Lokasi:** ${meeting.location}\n`;
    md += `**Penyelenggara:** ${meeting.organizer}\n`;
    md += `**Dibuat oleh:** Davin Maritza • Didukung oleh 9Router & VibeVoice\n\n`;

    if (meeting.secretaryNotes) {
      md += `**Arahan Susunan Kata (Notes Sekretaris):**\n> ${meeting.secretaryNotes}\n\n`;
    }

    md += `---\n\n`;
    md += `### I. RINGKASAN EKSEKUTIF\n${meeting.executiveSummary || 'Belum ada ringkasan eksekutif.'}\n\n`;

    md += `### II. AGENDA & PEMBAHASAN\n`;
    meeting.agendas.forEach((ag, idx) => {
      md += `#### ${idx + 1}. ${ag.title}\n`;
      ag.discussionPoints.forEach((pt) => {
        md += `- ${pt}\n`;
      });
      md += `\n`;
    });

    md += `### III. DAFTAR KEPUTUSAN RESMI\n`;
    if (meeting.decisions.length === 0) {
      md += `- Belum ada ketetapan keputusan resmi.\n\n`;
    } else {
      meeting.decisions.forEach((dec) => {
        md += `- **[${dec.number}]** ${dec.decisionText} (*Kategori: ${dec.category} | Status: ${dec.status}*)\n`;
      });
      md += `\n`;
    }

    md += `### IV. TINDAK LANJUT (ACTION ITEMS)\n`;
    if (meeting.actionItems.length === 0) {
      md += `- Belum ada penugasan tindak lanjut.\n\n`;
    } else {
      meeting.actionItems.forEach((act) => {
        md += `- [${act.status === 'COMPLETED' ? 'x' : ' '}] **${act.description}** — *Penanggung Jawab: ${act.assignee} (Batas Waktu: ${act.dueDate})*\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  // 2. Export Word Document (.doc)
  const exportWord = () => {
    const cleanTitle = meeting.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const dateFormatted = new Date().toISOString().split('T')[0];

    const agendasHtml = meeting.agendas
      .map(
        (ag, idx) => `
        <div style="margin-bottom: 10pt;">
          <h4 style="font-size: 11pt; font-weight: bold; margin: 4pt 0; color: #1e293b;">${idx + 1}. ${ag.title}</h4>
          <ul style="margin-top: 2pt; margin-bottom: 6pt; padding-left: 20pt;">
            ${ag.discussionPoints.map((pt) => `<li style="margin-bottom: 2pt;">${pt}</li>`).join('')}
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
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt; font-family: monospace;">${d.number}</td>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt;">${d.category}</td>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt;">${d.decisionText}</td>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt; text-align: center; font-weight: bold; color: #047857;">${d.status}</td>
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
              <th style="border: 1px solid #cbd5e1; padding: 6pt 8pt; font-size: 10pt; text-align: left; width: 50%;">Tugas / Tindak Lanjut</th>
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
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt;">${a.description}</td>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt; font-weight: bold;">${a.assignee}</td>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt; text-align: center;">${a.dueDate}</td>
                <td style="border: 1px solid #cbd5e1; padding: 5pt 8pt; font-size: 9.5pt; text-align: center;">${a.status}</td>
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
        <title>${meeting.title}</title>
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
          <tr><td class="lbl">Judul Agenda Sidang</td><td>: <strong>${meeting.title}</strong></td></tr>
          <tr><td class="lbl">Hari / Tanggal</td><td>: ${meeting.date}</td></tr>
          <tr><td class="lbl">Tempat Pelaksanaan</td><td>: ${meeting.location}</td></tr>
          <tr><td class="lbl">Penyelenggara</td><td>: ${meeting.organizer}</td></tr>
          <tr><td class="lbl">Notulis / Penyusun</td><td>: Davin Maritza • MPK SMK Negeri 13 Bandung</td></tr>
          ${
            meeting.secretaryNotes
              ? `<tr><td class="lbl">Arahan Catatan Khusus</td><td>: <em>${meeting.secretaryNotes}</em></td></tr>`
              : ''
          }
        </table>

        <h3>I. Ringkasan Eksekutif Hasil Sidang</h3>
        <div class="summary-box">
          ${meeting.executiveSummary || 'Belum ada ringkasan eksekutif.'}
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
              <u>(.......................................................)</u><br>
              NIS. MPK-13/2026
            </td>
            <td>
              Bandung, ${dateFormatted}<br>
              <strong>Sekretaris / Notulis Sidang</strong>
              <br><br><br><br>
              <u><strong>Davin Maritza</strong></u><br>
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
    link.download = `Notulen_${cleanTitle}_${dateFormatted}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 3. Export Plain Text (.txt)
  const exportTxt = () => {
    const cleanTitle = meeting.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const dateFormatted = new Date().toISOString().split('T')[0];
    const divider = '========================================================================\n';
    const subDivider = '------------------------------------------------------------------------\n';

    let txt = divider;
    txt += 'MAJELIS PERWAKILAN KELAS (MPK) SMK NEGERI 13 BANDUNG\n';
    txt += 'NOTULENSI RESMI SIDANG / RAPAT PLENO\n';
    txt += divider;
    txt += `Judul Rapat   : ${meeting.title}\n`;
    txt += `Tanggal       : ${meeting.date}\n`;
    txt += `Lokasi        : ${meeting.location}\n`;
    txt += `Penyelenggara : ${meeting.organizer}\n`;
    txt += `Durasi Rekam  : ${Math.floor(meeting.durationSeconds / 60)} Menit Audio\n`;
    txt += `Notulis       : Davin Maritza • MPK SMK Negeri 13 Bandung\n`;
    if (meeting.secretaryNotes) {
      txt += `Arahan Notes  : ${meeting.secretaryNotes}\n`;
    }
    txt += '\n' + subDivider;
    txt += 'I. RINGKASAN EKSEKUTIF\n';
    txt += subDivider;
    txt += (meeting.executiveSummary || 'Belum ada ringkasan eksekutif.') + '\n\n';

    txt += subDivider;
    txt += 'II. AGENDA & PEMBAHASAN\n';
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
    txt += `Disusun otomatis oleh NotulenJMM • Powered by 9Router & VibeVoice\n`;
    txt += divider;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Notulen_${cleanTitle}_${dateFormatted}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 4. Generate WhatsApp Formatted Text
  const generateWhatsAppText = () => {
    let wa = `*🏛️ NOTULENSI RESMI SIDANG / RAPAT PLENO*\n`;
    wa += `*MAJELIS PERWAKILAN KELAS (MPK) SMK NEGERI 13 BANDUNG*\n`;
    wa += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    wa += `📋 *Judul:* ${meeting.title}\n`;
    wa += `🗓️ *Tanggal:* ${meeting.date}\n`;
    wa += `📍 *Tempat:* ${meeting.location}\n`;
    wa += `👥 *Penyelenggara:* ${meeting.organizer}\n`;
    if (meeting.secretaryNotes) {
      wa += `✍️ *Catatan Sekretaris:* _${meeting.secretaryNotes}_\n`;
    }
    wa += `\n`;

    wa += `*I. 📌 RINGKASAN EKSEKUTIF*\n`;
    wa += `${meeting.executiveSummary || 'Belum ada ringkasan eksekutif.'}\n\n`;

    if (meeting.agendas.length > 0) {
      wa += `*II. 📝 AGENDA & HASIL PEMBAHASAN*\n`;
      meeting.agendas.forEach((ag, idx) => {
        wa += `*${idx + 1}. ${ag.title}*\n`;
        ag.discussionPoints.forEach((pt) => {
          wa += `   • ${pt}\n`;
        });
        wa += `\n`;
      });
    }

    if (meeting.decisions.length > 0) {
      wa += `*III. ⚖️ KETETAPAN & KEPUTUSAN RESMI*\n`;
      meeting.decisions.forEach((dec) => {
        wa += `▪️ *[${dec.number}]* ${dec.decisionText}\n`;
        wa += `   _Kategori: ${dec.category} | Status: ${dec.status}_\n`;
      });
      wa += `\n`;
    }

    if (meeting.actionItems.length > 0) {
      wa += `*IV. ✅ TINDAK LANJUT (ACTION ITEMS)*\n`;
      meeting.actionItems.forEach((act) => {
        const icon = act.status === 'COMPLETED' ? '☑️' : '◻️';
        wa += `${icon} *${act.description}*\n`;
        wa += `   👤 PJ: *${act.assignee}* | ⏱️ Batas Waktu: *${act.dueDate}*\n`;
      });
      wa += `\n`;
    }

    wa += `━━━━━━━━━━━━━━━━━━━━━\n`;
    wa += `_Dibuat otomatis via NotulenJMM (9Router & VibeVoice)_\n`;
    wa += `_Davin Maritza • MPK SMK Negeri 13 Bandung_`;

    return wa;
  };

  const copyWhatsApp = () => {
    const waText = generateWhatsAppText();
    navigator.clipboard.writeText(waText);
    setCopiedWa(true);
    setTimeout(() => setCopiedWa(false), 2000);
  };

  const openWhatsAppWeb = () => {
    const waText = generateWhatsAppText();
    const url = `https://web.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Printable Letterhead & Official Styling (Print-Only) */}
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
            Nomor: BA/{new Date().toISOString().split('T')[0]}/MPK-13/XI/2026
          </p>
        </div>

        <table className="w-full text-xs mb-6 border-collapse">
          <tbody>
            <tr>
              <td className="w-40 font-bold py-1 text-zinc-800">Judul Agenda</td>
              <td className="py-1">: <strong>{meeting.title}</strong></td>
            </tr>
            <tr>
              <td className="font-bold py-1 text-zinc-800">Hari / Tanggal</td>
              <td className="py-1">: {meeting.date}</td>
            </tr>
            <tr>
              <td className="font-bold py-1 text-zinc-800">Tempat Pelaksanaan</td>
              <td className="py-1">: {meeting.location}</td>
            </tr>
            <tr>
              <td className="font-bold py-1 text-zinc-800">Penyelenggara</td>
              <td className="py-1">: {meeting.organizer}</td>
            </tr>
            <tr>
              <td className="font-bold py-1 text-zinc-800">Notulis / Penyusun</td>
              <td className="py-1">: Davin Maritza • MPK SMK Negeri 13 Bandung</td>
            </tr>
          </tbody>
        </table>

        <div className="space-y-5 text-xs text-black">
          <div>
            <h4 className="font-bold uppercase border-b border-black pb-1 mb-2">I. Ringkasan Eksekutif</h4>
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
            <h4 className="font-bold uppercase border-b border-black pb-1 mb-2">III. Ketetapan &amp; Keputusan Resmi</h4>
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
            <h4 className="font-bold uppercase border-b border-black pb-1 mb-2">IV. Tindak Lanjut &amp; Penugasan</h4>
            {meeting.actionItems.length === 0 ? (
              <p className="italic text-zinc-500">(Belum ada penugasan)</p>
            ) : (
              <table className="w-full border border-black border-collapse mt-2">
                <thead>
                  <tr className="bg-zinc-100 border-b border-black">
                    <th className="border border-black p-2 text-left">Tugas</th>
                    <th className="border border-black p-2 text-left">PJ</th>
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
              <p className="underline font-bold">(.......................................................)</p>
              <p className="text-[10px] text-zinc-600">NIS. MPK-13/2026</p>
            </div>
            <div>
              <p>Bandung, {new Date().toISOString().split('T')[0]}</p>
              <p className="font-bold">Sekretaris / Notulis Sidang</p>
              <div className="h-16"></div>
              <p className="underline font-bold">Davin Maritza</p>
              <p className="text-[10px] text-zinc-600">Notulis Pleno Majelis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Screen View: Official Header Card */}
      <div className="bg-[#111318] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-white/[0.06] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] text-zinc-300 border border-white/[0.08]">
                DOKUMEN NOTULEN RESMI
              </span>
              <span className="text-[10px] font-mono text-zinc-500">FORMAT KEPUTUSAN MAJELIS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{meeting.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-mono text-[11px] pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                {meeting.date}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                {meeting.location}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                {meeting.organizer}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                {Math.floor(meeting.durationSeconds / 60)} Menit Audio
              </span>
            </div>
          </div>

          {/* 4 Multi-Format Export Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Format 1: Cetak PDF */}
            <button
              onClick={() => window.print()}
              title="Cetak langsung atau simpan sebagai dokumen PDF resmi ber-kop sekolah"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-zinc-950 font-semibold rounded-xl text-xs shadow-md hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak PDF</span>
            </button>

            {/* Format 2: Unduh Dokumen Word (.doc) */}
            <button
              onClick={exportWord}
              title="Unduh dokumen Microsoft Word (.doc) lengkap dengan kop dan tabel keputusan"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1c202d] hover:bg-[#252b3d] text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Unduh Word</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono">.DOC</span>
            </button>

            {/* Format 3: Unduh Dokumen Plain Text (.txt) */}
            <button
              onClick={exportTxt}
              title="Unduh format teks polos terstruktur (.txt)"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] rounded-xl text-xs font-semibold active:scale-[0.98] transition-all cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-zinc-400" />
              <span>Unduh TXT</span>
            </button>

            {/* Format 4: Pesan Versi WhatsApp (WA) */}
            <button
              onClick={() => setShowWaModal(true)}
              title="Buka pratinjau pesan teks format WhatsApp dengan tombol 1-klik salin"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold active:scale-[0.98] transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pesan Versi WA</span>
            </button>

            {/* Salin Markdown Cepat */}
            <button
              onClick={exportMarkdown}
              title="Salin sintaks Markdown mentah ke clipboard"
              className="flex items-center gap-1.5 px-3 py-2 bg-black/40 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-white/[0.05] rounded-xl text-xs font-mono active:scale-[0.98] transition-all cursor-pointer"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMd ? 'Disalin' : 'MD'}</span>
            </button>
          </div>
        </div>

        {/* Secretary Notes Indicator (If specified) */}
        {meeting.secretaryNotes && (
          <div className="p-4 bg-sky-950/20 border border-sky-500/20 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-semibold block">
                Arahan Susunan Kata AI oleh Sekretaris (Notes)
              </span>
              <p className="text-xs text-sky-200/90 leading-relaxed font-sans">{meeting.secretaryNotes}</p>
            </div>
          </div>
        )}

        {/* Section 1: Ringkasan Eksekutif (9Router AI) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
              Ringkasan Eksekutif (9Router AI)
            </h2>
          </div>
          <div className="p-4 bg-black/40 border border-white/[0.05] rounded-2xl">
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {meeting.executiveSummary ||
                'Belum ada ringkasan. Tekan "Sintesis Notulen Cerdas" pada tab transkripsi untuk merumuskan risalah otomatis.'}
            </p>
          </div>
        </div>

        {/* Section 2: Agenda & Hasil Pembahasan */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
              Agenda & Hasil Pembahasan ({meeting.agendas.length})
            </h2>
          </div>
          <div className="space-y-3">
            {meeting.agendas.map((ag, idx) => (
              <div key={idx} className="p-4 bg-[#14161f] border border-white/[0.06] rounded-2xl space-y-2">
                <h3 className="text-xs sm:text-sm font-semibold text-white">
                  {idx + 1}. {ag.title}
                </h3>
                <ul className="space-y-1.5 pl-4 list-disc text-xs text-zinc-300 marker:text-zinc-500">
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

        {/* Section 3: Keputusan Resmi (Legal Decision Log) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                Ketetapan & Keputusan Resmi Majelis ({meeting.decisions.length})
              </h2>
            </div>
          </div>

          <div className="space-y-2.5">
            {meeting.decisions.map((dec) => (
              <div
                key={dec.id}
                className="p-4 bg-[#14161f] border border-white/[0.06] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/15 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-zinc-400 font-semibold">[{dec.number}]</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/[0.06]">
                      {dec.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      {dec.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-white">{dec.decisionText}</p>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono shrink-0">{dec.date}</span>
              </div>
            ))}

            {/* Quick Add Decision Input */}
            <form onSubmit={handleAddDecision} className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                placeholder="Tambah rumusan keputusan resmi baru..."
                value={newDecisionText}
                onChange={(e) => setNewDecisionText(e.target.value)}
                className="flex-1 bg-black/50 border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
              />
              <select
                value={newDecisionCategory}
                onChange={(e) => setNewDecisionCategory(e.target.value as Decision['category'])}
                className="bg-zinc-900 border border-white/[0.08] text-xs text-zinc-300 rounded-xl px-3 py-2 font-mono focus:outline-none"
              >
                <option value="Organisasi">Organisasi</option>
                <option value="Keuangan">Keuangan</option>
                <option value="Program Kerja">Program Kerja</option>
                <option value="Disiplin">Disiplin</option>
                <option value="Umum">Umum</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Sahkan</span>
              </button>
            </form>
          </div>
        </div>

        {/* Section 4: Action Items (Tindak Lanjut) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
              Tindak Lanjut & Penugasan (Action Items) ({meeting.actionItems.length})
            </h2>
          </div>

          <div className="space-y-2">
            {meeting.actionItems.map((act) => {
              const isDone = act.status === 'COMPLETED';
              return (
                <div
                  key={act.id}
                  onClick={() => toggleActionStatus(act.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-black/30 border-white/[0.04] text-zinc-500 line-through'
                      : 'bg-[#14161f] border-white/[0.06] hover:border-white/15 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-white/20 bg-zinc-900 accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-medium">{act.description}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono text-[11px] shrink-0">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06]">
                      PJ: {act.assignee}
                    </span>
                    <span className="text-zinc-500">Tenggat: {act.dueDate}</span>
                  </div>
                </div>
              );
            })}

            {/* Quick Add Action Item */}
            <form onSubmit={handleAddActionItem} className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                placeholder="Nama tugas atau aksi..."
                value={newActionTask}
                onChange={(e) => setNewActionTask(e.target.value)}
                className="flex-1 bg-black/50 border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
              />
              <input
                type="text"
                placeholder="Penanggung Jawab"
                value={newActionAssignee}
                onChange={(e) => setNewActionAssignee(e.target.value)}
                className="w-full sm:w-44 bg-black/50 border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
              />
              <input
                type="date"
                value={newActionDueDate}
                onChange={(e) => setNewActionDueDate(e.target.value)}
                className="bg-zinc-900 border border-white/[0.08] text-xs text-zinc-300 rounded-xl px-3 py-2 font-mono focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MODAL: Pratinjau Format Pesan WhatsApp */}
      {showWaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111318] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Pesan Format WhatsApp (WA)
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Siap kirim ke grup WhatsApp pengurus MPK / OSIS SMK Negeri 13 Bandung
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWaModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* WA Text Preview Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-black/60 border border-white/[0.08] rounded-2xl font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed selection:bg-emerald-500/30">
              {generateWhatsAppText()}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-zinc-500 font-mono">
                Format otomatis: bold (*), bullet (▪️/•), icon status
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={copyWhatsApp}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer active:scale-[0.98]"
                >
                  {copiedWa ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedWa ? 'Tersalin ke Clipboard!' : 'Salin Pesan WA'}</span>
                </button>

                <button
                  onClick={openWhatsAppWeb}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold border border-white/10 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Buka WA Web</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
