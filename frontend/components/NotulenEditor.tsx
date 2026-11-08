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
} from 'lucide-react';
import { Meeting, Decision, ActionItem } from '../lib/types';

interface NotulenEditorProps {
  meeting: Meeting;
  onUpdateMeeting: (updated: Meeting) => void;
}

export const NotulenEditor: React.FC<NotulenEditorProps> = ({ meeting, onUpdateMeeting }) => {
  const [copied, setCopied] = useState(false);
  const [newDecisionText, setNewDecisionText] = useState('');
  const [newDecisionCategory, setNewDecisionCategory] = useState<Decision['category']>('Program Kerja');
  const [newActionTask, setNewActionTask] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('');
  const [newActionDueDate, setNewActionDueDate] = useState('');

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
      dueDate: newActionDueDate || '2026-11-15',
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

  const exportMarkdown = () => {
    let md = `# NOTULENSI RESMI SIDANG / RAPAT\n`;
    md += `## MAJELIS PERWAKILAN KELAS (MPK) SMK NEGERI 13 BANDUNG\n\n`;
    md += `**Judul Rapat:** ${meeting.title}\n`;
    md += `**Tanggal:** ${meeting.date}\n`;
    md += `**Lokasi:** ${meeting.location}\n`;
    md += `**Penyelenggara:** ${meeting.organizer}\n`;
    md += `**Dibuat oleh:** Davin Maritza • Didukung oleh 9Router & VibeVoice\n\n`;

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
    meeting.decisions.forEach((dec) => {
      md += `- **[${dec.number}]** ${dec.decisionText} (*Kategori: ${dec.category} | Status: ${dec.status}*)\n`;
    });
    md += `\n`;

    md += `### IV. TINDAK LANJUT (ACTION ITEMS)\n`;
    meeting.actionItems.forEach((act) => {
      md += `- [${act.status === 'COMPLETED' ? 'x' : ' '}] **${act.description}** — *Penanggung Jawab: ${act.assignee} (Batas Waktu: ${act.dueDate})*\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Official Header Card */}
      <div className="bg-[#111318] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
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
                <User className="w-3.5 h-3.5 text-zinc-500" />
                {meeting.organizer}
              </span>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] rounded-xl text-xs font-semibold active:scale-[0.98] transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copied ? 'Tersalin!' : 'Salin Markdown'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-zinc-950 font-semibold rounded-xl text-xs shadow-md hover:bg-zinc-200 active:scale-[0.98] transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak PDF</span>
            </button>
          </div>
        </div>

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
                'Belum ada ringkasan. Tekan "Sintesis Notulen Cerdas via 9Router" pada tab transkripsi untuk merumuskan ringkasan otomatis.'}
            </p>
          </div>
        </div>

        {/* Section 2: Agenda & Hasil Pembahasan */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
              Agenda & Hasil Pembahasan
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
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/10"
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
              Tindak Lanjut & Penugasan (Action Items)
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
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/10"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
