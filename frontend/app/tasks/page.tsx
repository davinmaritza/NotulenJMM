'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMeetings } from '../../context/MeetingContext';
import { Decision, ActionItem, Meeting } from '../../lib/types';
import {
  CheckSquare,
  Scale,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  ArrowRight,
  FileText,
  AlertCircle,
  Tag,
  Trash2,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const {
    meetings,
    activeMeeting,
    activeMeetingId,
    setActiveMeetingId,
    handleUpdateActiveMeeting,
    handleCreateNewMeeting,
  } = useMeetings();

  const [activeTab, setActiveTab] = useState<'actions' | 'decisions'>('actions');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [filterAssignee, setFilterAssignee] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // New Action Item Modal / Form State
  const [isAddingAction, setIsAddingAction] = useState<boolean>(false);
  const [newTaskDesc, setNewTaskDesc] = useState<string>('');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');

  // New Decision Modal / Form State
  const [isAddingDecision, setIsAddingDecision] = useState<boolean>(false);
  const [newDecText, setNewDecText] = useState<string>('');
  const [newDecCategory, setNewDecCategory] = useState<Decision['category']>('Program Kerja');
  const [newDecRationale, setNewDecRationale] = useState<string>('');

  // Current session or fallback to first session
  const currentMeeting: Meeting | null =
    activeMeeting || (meetings.length > 0 ? meetings[0] : null);

  // All action items from current session
  const actionItems: ActionItem[] = currentMeeting ? currentMeeting.actionItems : [];
  const decisions: Decision[] = currentMeeting ? currentMeeting.decisions : [];

  // Toggle Action Item completion
  const handleToggleTask = (taskId: string) => {
    if (!currentMeeting) return;
    const updatedActions = currentMeeting.actionItems.map((item) => {
      if (item.id === taskId) {
        return {
          ...item,
          status: item.status === 'COMPLETED' ? ('PENDING' as const) : ('COMPLETED' as const),
        };
      }
      return item;
    });

    handleUpdateActiveMeeting({
      ...currentMeeting,
      actionItems: updatedActions,
      lastSavedAt:
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    });
  };

  // Delete Action Item
  const handleDeleteTask = (taskId: string) => {
    if (!currentMeeting) return;
    const updatedActions = currentMeeting.actionItems.filter((item) => item.id !== taskId);
    handleUpdateActiveMeeting({
      ...currentMeeting,
      actionItems: updatedActions,
      lastSavedAt:
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    });
  };

  // Submit New Action Item
  const handleCreateActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMeeting || !newTaskDesc.trim() || !newTaskAssignee.trim()) return;

    const newItem: ActionItem = {
      id: `act-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      description: newTaskDesc.trim(),
      assignee: newTaskAssignee.trim(),
      dueDate: newTaskDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'PENDING',
    };

    handleUpdateActiveMeeting({
      ...currentMeeting,
      actionItems: [...currentMeeting.actionItems, newItem],
      lastSavedAt:
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    });

    setNewTaskDesc('');
    setNewTaskAssignee('');
    setNewTaskDueDate('');
    setIsAddingAction(false);
  };

  // Submit New Decision / TAP
  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMeeting || !newDecText.trim()) return;

    const newDec: Decision = {
      id: `dec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      number: `KEP/${String(currentMeeting.decisions.length + 1).padStart(3, '0')}/MPK-13/${new Date().getFullYear()}`,
      decisionText: newDecText.trim(),
      rationale:
        newDecRationale.trim() ||
        'Ketetapan resmi hasil musyawarah dan mufakat sidang pleno MPK 13.',
      category: newDecCategory,
      status: 'DISAHKAN',
      date: new Date().toISOString().split('T')[0],
    };

    handleUpdateActiveMeeting({
      ...currentMeeting,
      decisions: [...currentMeeting.decisions, newDec],
      lastSavedAt:
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    });

    setNewDecText('');
    setNewDecRationale('');
    setIsAddingDecision(false);
  };

  // Metrics
  const totalTasks = actionItems.length;
  const completedTasks = actionItems.filter((a) => a.status === 'COMPLETED').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filtered Action Items
  const filteredActions = actionItems.filter((act) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q || act.description.toLowerCase().includes(q) || act.assignee.toLowerCase().includes(q);
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'COMPLETED' && act.status === 'COMPLETED') ||
      (filterStatus === 'PENDING' && act.status !== 'COMPLETED');
    const matchesAssignee =
      filterAssignee === 'ALL' ||
      act.assignee.toLowerCase().includes(filterAssignee.toLowerCase());

    return matchesQuery && matchesStatus && matchesAssignee;
  });

  // Filtered Decisions
  const filteredDecisions = decisions.filter((dec) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      dec.decisionText.toLowerCase().includes(q) ||
      dec.number.toLowerCase().includes(q) ||
      (dec.rationale && dec.rationale.toLowerCase().includes(q));
    const matchesCat = filterCategory === 'ALL' || dec.category === filterCategory;

    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Session Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-black rounded-3xl p-6 sm:p-7 shadow-[5px_5px_0px_0px_#000]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FFE600] text-black border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              TINDAK LANJUT &amp; KETETAPAN
            </span>
            <span className="text-[10px] font-mono text-zinc-600 font-bold">
              MPK Nawadasha Bhakti Amita Paramartha
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight">
            Ketetapan TAP &amp; Tugas Komisi
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 font-medium">
            Pemantauan realisasi instruksi sidang, penanggung jawab (PIC), dan buku ketetapan majelis.
          </p>
        </div>

        {/* Sesi Sidang Aktif Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0">
          {meetings.length > 0 ? (
            <div className="space-y-1 text-right">
              <label htmlFor="session-picker" className="text-[10px] font-mono font-black uppercase text-zinc-500 block">
                Sesi Sidang Aktif:
              </label>
              <select
                id="session-picker"
                value={currentMeeting?.id || ''}
                onChange={(e) => setActiveMeetingId(e.target.value)}
                className="bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none cursor-pointer max-w-[240px] truncate"
              >
                {meetings.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <button
              onClick={() => {
                handleCreateNewMeeting();
                router.push('/record');
              }}
              className="px-4 py-2.5 bg-[#FFE600] text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              + Buat Sesi Sidang Baru
            </button>
          )}

          {currentMeeting && (
            <button
              type="button"
              onClick={() => router.push('/notulen')}
              className="px-3.5 py-2.5 bg-white hover:bg-zinc-100 text-black border-2 border-black rounded-xl text-xs font-bold shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 cursor-pointer mt-auto"
              title="Buka naskah risalah lengkap di Editor"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Editor</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Tugas */}
        <div className="bg-[#FFFDF5] border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[3.5px_3.5px_0px_0px_#000] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black uppercase text-zinc-600">Total Tugas</span>
            <CheckSquare className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-black">{totalTasks}</p>
          <p className="text-[10px] font-medium text-zinc-500">Penugasan dari forum</p>
        </div>

        {/* Card 2: Selesai */}
        <div className="bg-[#A7F3D0] border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[3.5px_3.5px_0px_0px_#000] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black uppercase text-emerald-950">Terealisasi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-950">{completedTasks}</p>
          <p className="text-[10px] font-medium text-emerald-900 font-mono">Tugas selesai diverifikasi</p>
        </div>

        {/* Card 3: Menunggu (Pending) */}
        <div className="bg-[#FEF08A] border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[3.5px_3.5px_0px_0px_#000] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black uppercase text-amber-950">Dalam Proses</span>
            <Clock className="w-4 h-4 text-amber-800 stroke-[2.5]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-amber-950">{pendingTasks}</p>
          <p className="text-[10px] font-medium text-amber-900 font-mono">Menunggu tindak lanjut</p>
        </div>

        {/* Card 4: Ketetapan TAP */}
        <div className="bg-[#C4B5FD] border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[3.5px_3.5px_0px_0px_#000] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black uppercase text-purple-950">Ketetapan TAP</span>
            <Scale className="w-4 h-4 text-purple-900 stroke-[2.5]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-purple-950">{decisions.length}</p>
          <p className="text-[10px] font-medium text-purple-900 font-mono">Keputusan hukum sah</p>
        </div>
      </div>

      {/* Main Tab Controller & Search Filter */}
      <div className="bg-white border-2 border-black rounded-3xl p-5 sm:p-7 shadow-[5px_5px_0px_0px_#000] space-y-6">
        {/* Navigation Tabs & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('actions')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'actions'
                  ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_0px_#000]'
                  : 'bg-white text-zinc-700 hover:bg-[#FFFDF5]'
              }`}
            >
              <CheckSquare className="w-4 h-4 stroke-[2.5]" />
              <span>Penugasan Komisi ({totalTasks})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('decisions')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'decisions'
                  ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_0px_#000]'
                  : 'bg-white text-zinc-700 hover:bg-[#FFFDF5]'
              }`}
            >
              <Scale className="w-4 h-4 stroke-[2.5]" />
              <span>Buku Ketetapan TAP ({decisions.length})</span>
            </button>
          </div>

          <div>
            {activeTab === 'actions' ? (
              <button
                type="button"
                onClick={() => setIsAddingAction(true)}
                disabled={!currentMeeting}
                className="w-full sm:w-auto px-4 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-black border-2 border-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,0.3)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Tambah Tugas Komisi</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingDecision(true)}
                disabled={!currentMeeting}
                className="w-full sm:w-auto px-4 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-black border-2 border-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,0.3)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Tambah Ketetapan TAP</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'actions'
                  ? 'Cari nama tugas, PIC / Komisi, tenggat waktu...'
                  : 'Cari nomor ketetapan, isi keputusan, pertimbangan...'
              }
              className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-black placeholder:text-zinc-400 focus:outline-none"
            />
          </div>

          {activeTab === 'actions' ? (
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs font-bold text-black focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING">Perlu Dikerjakan (Pending)</option>
                <option value="COMPLETED">Selesai (Completed)</option>
              </select>

              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs font-bold text-black focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Komisi / PIC</option>
                <option value="Komisi A">Komisi A (Pengawasan OSIS)</option>
                <option value="Komisi B">Komisi B (Ekskul & Lapangan)</option>
                <option value="Komisi C">Komisi C (Aspirasi & LSM)</option>
                <option value="Presidium">Presidium Majelis</option>
                <option value="Notulis">Sekretaris / Notulis</option>
                <option value="OSIS">Pengurus OSIS</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs font-bold text-black focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Kategori TAP</option>
                <option value="Program Kerja">Program Kerja</option>
                <option value="Kebijakan Internal">Kebijakan Internal</option>
                <option value="Anggaran Kas">Anggaran Kas</option>
                <option value="Tata Tertib">Tata Tertib</option>
                <option value="Sanksi & Disiplin">Sanksi &amp; Disiplin</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB CONTENT: ACTION ITEMS */}
        {activeTab === 'actions' && (
          <div className="space-y-3">
            {filteredActions.length === 0 ? (
              <div className="p-8 text-center bg-[#FFFDF5] border-2 border-dashed border-black/30 rounded-2xl space-y-2">
                <CheckSquare className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-xs font-bold text-zinc-600">Tidak ada penugasan komisi yang cocok dengan pencarian.</p>
                <p className="text-[11px] text-zinc-500">Klik tombol "Tambah Tugas Komisi" di atas untuk menambahkan tugas baru.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredActions.map((task) => {
                  const isDone = task.status === 'COMPLETED';
                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3.5 ${
                        isDone
                          ? 'bg-zinc-50/80 border-black/20 opacity-75'
                          : 'bg-[#FFFDF5] border-2 border-black shadow-[3px_3px_0px_0px_#000]'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => handleToggleTask(task.id)}
                          className={`w-6 h-6 rounded-lg border-2 border-black flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                            isDone ? 'bg-emerald-400 text-black shadow-[1px_1px_0px_0px_#000]' : 'bg-white hover:bg-yellow-100 shadow-[1.5px_1.5px_0px_0px_#000]'
                          }`}
                          title={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
                        >
                          {isDone && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                        </button>

                        <div className="space-y-1 min-w-0 flex-1">
                          <p
                            className={`text-xs sm:text-sm font-black text-black leading-snug break-words ${
                              isDone ? 'line-through text-zinc-500' : ''
                            }`}
                          >
                            {task.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-600 font-sans">
                            <span className="flex items-center gap-1 font-bold text-black">
                              <User className="w-3.5 h-3.5 text-zinc-700" />
                              <span>{task.assignee}</span>
                            </span>

                            <span className="flex items-center gap-1 font-mono text-zinc-600">
                              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                              <span>Tenggat: {task.dueDate}</span>
                            </span>

                            <span
                              className={`px-2 py-0.2 rounded-md border text-[9px] font-mono font-black uppercase tracking-wider ${
                                isDone
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                  : 'bg-amber-100 text-amber-900 border-amber-400'
                              }`}
                            >
                              {isDone ? 'SELESAI' : 'MENUNGGU'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded-lg border border-black/20 hover:border-black hover:bg-rose-50 text-zinc-500 hover:text-rose-700 transition-colors cursor-pointer shrink-0"
                        title="Hapus tugas ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: DECISIONS & TAP */}
        {activeTab === 'decisions' && (
          <div className="space-y-3">
            {filteredDecisions.length === 0 ? (
              <div className="p-8 text-center bg-[#FFFDF5] border-2 border-dashed border-black/30 rounded-2xl space-y-2">
                <Scale className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-xs font-bold text-zinc-600">Tidak ada ketetapan sidang yang sesuai dengan kriteria.</p>
                <p className="text-[11px] text-zinc-500">Klik "Tambah Ketetapan TAP" di atas untuk menambahkan keputusan baru.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDecisions.map((dec) => (
                  <div
                    key={dec.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF5] border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-black bg-[#FFE600] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                          {dec.number}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-600 font-bold">
                          Kategori: {dec.category}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-400 font-mono text-[9px] font-black uppercase">
                        {dec.status}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-black text-black leading-relaxed">
                      {dec.decisionText}
                    </p>

                    {dec.rationale && (
                      <div className="p-2.5 bg-white border border-black/15 rounded-xl text-[11px] text-zinc-700 space-y-0.5">
                        <span className="font-mono font-bold text-zinc-500 uppercase text-[9px] block">
                          Konsiderans &amp; Dasar Pertimbangan:
                        </span>
                        <p className="leading-snug">{dec.rationale}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: ADD ACTION ITEM */}
      {isAddingAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white border-[3px] border-black rounded-3xl p-6 sm:p-7 shadow-[8px_8px_0px_0px_#000] space-y-4 animate-in zoom-in-95 text-left select-none">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-black stroke-[2.5]" />
                <h3 className="text-base font-black text-black">Tambah Penugasan Komisi</h3>
              </div>
              <button
                onClick={() => setIsAddingAction(false)}
                className="p-1 rounded-lg border border-black hover:bg-zinc-100 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActionItem} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-zinc-700 block">
                  Uraian Tugas / Tindak Lanjut:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Contoh: Mengirimkan surat pemberitahuan verifikasi LPJ ke seluruh Sekbid OSIS..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-sans font-medium bg-[#FFFDF5] border-2 border-black focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-zinc-700 block">
                    Penanggung Jawab (PIC):
                  </label>
                  <input
                    type="text"
                    required
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    placeholder="Contoh: Komisi A / Restu"
                    className="w-full px-3.5 py-2 rounded-xl text-xs font-sans font-medium bg-[#FFFDF5] border-2 border-black focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-zinc-700 block">
                    Tenggat Waktu:
                  </label>
                  <input
                    type="date"
                    required
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-[#FFFDF5] border-2 border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setIsAddingAction(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-black border-2 border-black hover:bg-zinc-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#ffd93d] cursor-pointer"
                >
                  Simpan Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DECISION */}
      {isAddingDecision && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white border-[3px] border-black rounded-3xl p-6 sm:p-7 shadow-[8px_8px_0px_0px_#000] space-y-4 animate-in zoom-in-95 text-left select-none">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-black stroke-[2.5]" />
                <h3 className="text-base font-black text-black">Tambah Ketetapan TAP Majelis</h3>
              </div>
              <button
                onClick={() => setIsAddingDecision(false)}
                className="p-1 rounded-lg border border-black hover:bg-zinc-100 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDecision} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-zinc-700 block">
                  Kategori Ketetapan TAP:
                </label>
                <select
                  value={newDecCategory}
                  onChange={(e) => setNewDecCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FFFDF5] border-2 border-black focus:outline-none cursor-pointer"
                >
                  <option value="Program Kerja">Program Kerja</option>
                  <option value="Kebijakan Internal">Kebijakan Internal</option>
                  <option value="Anggaran Kas">Anggaran Kas</option>
                  <option value="Tata Tertib">Tata Tertib</option>
                  <option value="Sanksi & Disiplin">Sanksi &amp; Disiplin</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-zinc-700 block">
                  Bunyi Diktum Putusan / Ketetapan:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDecText}
                  onChange={(e) => setNewDecText(e.target.value)}
                  placeholder="Contoh: Mengesahkan jadwal pemakaian lapangan sepak bola bagi 23 ekstrakurikuler..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-sans font-medium bg-[#FFFDF5] border-2 border-black focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-zinc-700 block">
                  Dasar Hukum &amp; Konsiderans:
                </label>
                <textarea
                  rows={2}
                  value={newDecRationale}
                  onChange={(e) => setNewDecRationale(e.target.value)}
                  placeholder="Dasar pertimbangan musyawarah pleno atau pasal AD/ART rujukan..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-sans font-medium bg-[#FFFDF5] border-2 border-black focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setIsAddingDecision(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-black border-2 border-black hover:bg-zinc-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#ffd93d] cursor-pointer"
                >
                  Sahkan Ketetapan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
