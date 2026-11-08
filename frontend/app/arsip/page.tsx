'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMeetings } from '../../context/MeetingContext';
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
  Compass,
  FileCheck,
  Trash2,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function ArsipPage() {
  const router = useRouter();
  const {
    meetings,
    activeMeetingId,
    setActiveMeetingId,
    handleCreateNewMeeting,
    handleDeleteMeeting,
  } = useMeetings();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'DRAFT' | 'FINALIZED'>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // Metrics
  const totalDecisions = meetings.reduce((acc, m) => acc + m.decisions.length, 0);
  const totalActionItems = meetings.reduce((acc, m) => acc + m.actionItems.length, 0);
  const completedActionItems = meetings.reduce(
    (acc, m) => acc + m.actionItems.filter((a) => a.status === 'COMPLETED').length,
    0
  );

  const draftCount = meetings.filter((m) => m.status === 'DRAFT').length;
  const finalizedCount = meetings.filter((m) => m.status === 'FINALIZED').length;

  // Search & Filter
  const filteredMeetings = meetings.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.date.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q) ||
      (m.leaderName && m.leaderName.toLowerCase().includes(q)) ||
      (m.noteTakerName && m.noteTakerName.toLowerCase().includes(q)) ||
      m.id.toLowerCase().includes(q);

    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'DRAFT' && m.status === 'DRAFT') ||
      (filterStatus === 'FINALIZED' && m.status === 'FINALIZED');

    return matchesSearch && matchesFilter;
  });

  // Pagination calculation
  const totalItems = filteredMeetings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedMeetings = filteredMeetings.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (status: 'ALL' | 'DRAFT' | 'FINALIZED') => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Linear-Tier Editorial KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#0e0f14] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">
              Total Sesi Sidang
            </span>
            <FileText className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold font-mono text-white tracking-tight">
            {meetings.length}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">Terdokumentasi resmi</p>
        </div>

        <div className="bg-[#0e0f14] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">
              Ketetapan Pleno
            </span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold font-mono text-white tracking-tight">
            {totalDecisions}
          </p>
          <p className="text-[11px] text-emerald-400/90 font-mono">100% Disahkan Forum</p>
        </div>

        <div className="bg-[#0e0f14] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">
              Penugasan Komisi
            </span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold font-mono text-white tracking-tight">
            {completedActionItems}{' '}
            <span className="text-base text-zinc-500 font-normal">/ {totalActionItems}</span>
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">Komitmen terealisasi</p>
        </div>

        <div className="bg-[#0e0f14] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">
              Format Risalah
            </span>
            <FileCheck className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-base sm:text-lg font-semibold text-white tracking-tight truncate">
            Tata Naskah Dinas
          </p>
          <p className="text-[11px] text-zinc-500 font-mono truncate">Berita Acara &amp; Salinan SK</p>
        </div>
      </div>

      {/* Meeting List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            Arsip Notulen &amp; Draf Sidang
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans">
            Dokumen resmi persidangan &amp; draf aktif Majelis Perwakilan Kelas SMK Negeri 13 Bandung
          </p>
        </div>

        <button
          onClick={() => {
            handleCreateNewMeeting();
            router.push('/record');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 rounded-xl text-xs font-semibold shadow-md hover:bg-zinc-200 active:scale-[0.985] transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          Buat Sesi Sidang Baru
        </button>
      </div>

      {/* Friendly Search, Filter & Per-Page Controls */}
      {meetings.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#0d0e13] border border-white/[0.06] rounded-2xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari judul rapat, kata kunci, pimpinan, atau notulis..."
              className="w-full bg-[#12141c] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white p-1"
                title="Hapus Pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills & Page Size Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => handleFilterChange('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  filterStatus === 'ALL'
                    ? 'bg-zinc-800 text-white border border-white/10 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Semua ({meetings.length})
              </button>
              <button
                onClick={() => handleFilterChange('DRAFT')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  filterStatus === 'DRAFT'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Draf ({draftCount})</span>
              </button>
              <button
                onClick={() => handleFilterChange('FINALIZED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  filterStatus === 'FINALIZED'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Disahkan ({finalizedCount})</span>
              </button>
            </div>

            {/* Per-Page Selector */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/[0.08] text-xs text-zinc-400 font-mono">
              <span className="text-[11px] hidden md:inline">Baris:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="bg-[#12141c] border border-white/[0.08] text-zinc-300 rounded-lg px-2 py-1 text-xs focus:outline-none cursor-pointer"
              >
                <option value={5}>5 / hal</option>
                <option value={10}>10 / hal</option>
                <option value={20}>20 / hal</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Empty State vs Meeting Cards List */}
      {meetings.length === 0 ? (
        <div className="bg-[#0e0f14] border border-dashed border-white/[0.12] rounded-3xl p-10 sm:p-14 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Belum Ada Sesi Sidang Tersimpan
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Sistem siap merekam voice note sekretaris dan merumuskan risalah sidang. Silakan rekam suara sidang atau unggah berkas audio di Studio.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.push('/record')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-950 rounded-xl text-xs font-bold shadow-md hover:bg-zinc-200 active:scale-[0.985] transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 text-rose-500" />
              <span>Rekam Voice Note Sidang</span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#14161f] hover:bg-zinc-800 text-zinc-200 border border-white/10 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Buka Studio Agenda</span>
            </button>
          </div>
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="bg-[#0e0f14] border border-white/[0.08] rounded-3xl p-10 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-sm font-semibold text-white">Tidak Ada Sesi yang Cocok</h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Tidak ditemukan berkas rapat dengan kata kunci &quot;{searchQuery}&quot; pada filter terpilih.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('ALL');
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-[#141620] hover:bg-zinc-800 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter &amp; Pencarian</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Card List */}
          <div className="space-y-3">
            {paginatedMeetings.map((meet) => (
              <div
                key={meet.id}
                onClick={() => {
                  setActiveMeetingId(meet.id);
                  router.push('/notulen');
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer bg-[#0e0f14] active:scale-[0.99] ${
                  meet.id === activeMeetingId
                    ? 'border-sky-500/80 shadow-[0_4px_20px_-4px_rgba(14,165,233,0.12)] ring-1 ring-sky-500/30'
                    : 'border-white/[0.06] hover:border-white/15 hover:bg-[#14161f]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                          meet.status === 'FINALIZED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : meet.status === 'DRAFT'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/25 font-semibold'
                            : meet.status === 'TRANSCRIBING'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            : 'bg-zinc-900 text-zinc-400 border-white/[0.06]'
                        }`}
                      >
                        {meet.status === 'DRAFT' ? 'DRAF ONLINE' : meet.status}
                      </span>
                      {meet.lastSavedAt && (
                        <span className="text-[10px] font-mono text-zinc-400">
                          Disimpan: {meet.lastSavedAt}
                        </span>
                      )}
                      <span className="text-[11px] text-zinc-600 font-mono">ID: {meet.id}</span>
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
                        router.push('/record');
                      }}
                      className="px-3 py-1.5 bg-[#14161f] hover:bg-zinc-800 text-zinc-300 border border-white/[0.06] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5 text-rose-400" />
                      Rekam
                    </button>
                    <button className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/10 cursor-pointer">
                      <span>{meet.status === 'DRAFT' ? 'Lanjutkan Draf' : 'Buka Risalah'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteMeeting(meet.id, e)}
                      title="Hapus Sesi / Draf Sidang"
                      className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Navigation Footer */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs">
              <span className="text-zinc-400 font-mono text-[11px]">
                Menampilkan <strong className="text-white">{startIndex + 1}</strong> –{' '}
                <strong className="text-white">{endIndex}</strong> dari{' '}
                <strong className="text-white">{totalItems}</strong> berkas sidang
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage <= 1}
                  className="px-2.5 py-1.5 rounded-lg bg-[#141620] hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        p === safeCurrentPage
                          ? 'bg-white text-zinc-950 shadow-sm'
                          : 'bg-[#141620] text-zinc-400 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage >= totalPages}
                  className="px-2.5 py-1.5 rounded-lg bg-[#141620] hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 text-xs"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
