'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  Calendar,
  User,
  PlusCircle,
  Tag,
  Scale,
  Sparkles,
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

  const copyMarkdown = () => {
    const md = `
# NOTULEN RESMI RAPAT MPK SMK NEGERI 13 BANDUNG
**Judul Rapat**: ${meeting.title}
**Waktu & Lokasi**: ${meeting.date} | ${meeting.location}
**Penyelenggara**: ${meeting.organizer}

---

## 1. RINGKASAN EKSEKUTIF (9Router AI Synthesizer)
${meeting.executiveSummary || 'Belum ada ringkasan eksekutif.'}

---

## 2. AGENDA & PEMBAHASAN
${meeting.agendas.map((a, i) => `### Agenda ${i + 1}: ${a.title}\n${a.discussionPoints.map((p) => `- ${p}`).join('\n')}`).join('\n\n')}

---

## 3. ARSIP KEPUTUSAN RESMI (DECISION LOG)
${meeting.decisions.map((d) => `- **[${d.status}] ${d.number}**: ${d.decisionText} (Kategori: ${d.category})\n  *Pertimbangan*: ${d.rationale}`).join('\n')}

---

## 4. DAFTAR TINDAK LANJUT (ACTION ITEMS)
${meeting.actionItems.map((act) => `- [${act.status === 'COMPLETED' ? 'x' : ' '}] **${act.description}** | PIC: ${act.assignee} | Tenggat: ${act.dueDate}`).join('\n')}

---
*Dibuat oleh Davin Maritza | Lisensi MPK SMK Negeri 13 Bandung*
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
            Dokumen Notulen Resmi
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-2">{meeting.title}</h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {meeting.date}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-500" />
              {meeting.organizer}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyMarkdown}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold active:scale-95 transition-all"
          >
            <Copy className="w-3.5 h-3.5 text-indigo-400" />
            {copied ? 'Tersalin ke Clipboard!' : 'Salin Markdown'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak PDF
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Ringkasan Eksekutif (9Router AI)
          </h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
          {meeting.executiveSummary || 'Belum ada ringkasan. Tekan "Sintesis Notulen Cerdas via 9Router" pada tab transkripsi untuk merumuskan ringkasan otomatis.'}
        </p>
      </div>

      {/* Agendas Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Agenda & Hasil Pembahasan
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meeting.agendas.map((agenda, idx) => (
            <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-indigo-400 block">Agenda {idx + 1}</span>
              <h4 className="text-sm font-bold text-slate-200">{agenda.title}</h4>
              <ul className="space-y-1.5 pt-1">
                {agenda.discussionPoints.map((pt, pIdx) => (
                  <li key={pIdx} className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Formal Decisions Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Arsip Keputusan Resmi (Decision Log)
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {meeting.decisions.length} Keputusan Disahkan
          </span>
        </div>

        <div className="space-y-3">
          {meeting.decisions.map((dec) => (
            <div
              key={dec.id}
              className="p-4 bg-slate-950/70 border border-slate-800/90 rounded-xl space-y-2 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 font-mono font-bold text-[11px] border border-emerald-500/30">
                    {dec.number}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px]">
                    {dec.category}
                  </span>
                </div>
                <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {dec.status}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-100">{dec.decisionText}</p>
              <p className="text-xs text-slate-400 italic">Pertimbangan: {dec.rationale}</p>
            </div>
          ))}
        </div>

        {/* Form Add Decision */}
        <form onSubmit={handleAddDecision} className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newDecisionText}
            onChange={(e) => setNewDecisionText(e.target.value)}
            placeholder="Tambah butir keputusan resmi baru..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
          />
          <select
            value={newDecisionCategory}
            onChange={(e) => setNewDecisionCategory(e.target.value as Decision['category'])}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-hidden focus:border-indigo-500"
          >
            <option value="Program Kerja">Program Kerja</option>
            <option value="Organisasi">Organisasi</option>
            <option value="Keuangan">Keuangan</option>
            <option value="Disiplin">Disiplin</option>
            <option value="Umum">Umum</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-all"
          >
            Simpan Keputusan
          </button>
        </form>
      </div>

      {/* Action Items Tracking */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Tindak Lanjut & Penugasan (Action Items)
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {meeting.actionItems.filter((a) => a.status === 'COMPLETED').length} dari {meeting.actionItems.length} Selesai
          </span>
        </div>

        <div className="space-y-2.5">
          {meeting.actionItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleActionStatus(item.id)}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer select-none transition-all ${
                item.status === 'COMPLETED'
                  ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                  : item.status === 'IN_PROGRESS'
                  ? 'bg-slate-950/80 border-indigo-500/40 shadow-xs'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.status === 'COMPLETED'}
                  onChange={() => {}} // handled by parent onClick
                  className="w-4 h-4 rounded-md accent-indigo-600 bg-slate-900 border-slate-700"
                />
                <div>
                  <p
                    className={`text-xs font-medium ${
                      item.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {item.description}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    PIC: <span className="text-indigo-300 font-sans">{item.assignee}</span> • Batas: {item.dueDate}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                  item.status === 'COMPLETED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : item.status === 'IN_PROGRESS'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {item.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>

        {/* Form Add Action Item */}
        <form onSubmit={handleAddActionItem} className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            value={newActionTask}
            onChange={(e) => setNewActionTask(e.target.value)}
            placeholder="Deskripsi tugas baru..."
            className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
          />
          <input
            type="text"
            value={newActionAssignee}
            onChange={(e) => setNewActionAssignee(e.target.value)}
            placeholder="Penanggung Jawab (PIC)"
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Tambah Tugas
          </button>
        </form>
      </div>
    </div>
  );
};
