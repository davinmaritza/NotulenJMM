'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMeetings } from '../../context/MeetingContext';
import { CloudBackupModal } from '../../components/CloudBackupModal';
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
  X,
  Cloud,
  Archive,
  RefreshCw,
} from 'lucide-react';

export default function ArsipPage() {
  const router = useRouter();
  const {
    meetings,
    activeMeetingId,
    setActiveMeetingId,
    handleCreateNewMeeting,
    handleDeleteMeeting,
    handleArchiveMeeting,
    handleUnarchiveMeeting,
    googleAccount,
    isAutoSyncing,
  } = useMeetings();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'DRAFT' | 'FINALIZED' | 'ARCHIVED'>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);

  // Metrics
  const totalDecisions = meetings.reduce((acc, m) => acc + m.decisions.length, 0);
  const totalActionItems = meetings.reduce((acc, m) => acc + m.actionItems.length, 0);
  const completedActionItems = meetings.reduce(
    (acc, m) => acc + m.actionItems.filter((a) => a.status === 'COMPLETED').length,
    0
  );

  const draftCount = meetings.filter((m) => m.status === 'DRAFT').length;
  const finalizedCount = meetings.filter((m) => m.status === 'FINALIZED' && !m.isArchived).length;
  const archivedCount = meetings.filter((m) => m.isArchived).length;

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
      (m.archiveNumber && m.archiveNumber.toLowerCase().includes(q)) ||
      m.id.toLowerCase().includes(q);

    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'DRAFT' && m.status === 'DRAFT') ||
      (filterStatus === 'FINALIZED' && m.status === 'FINALIZED' && !m.isArchived) ||
      (filterStatus === 'ARCHIVED' && m.isArchived);

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

  const handleFilterChange = (status: 'ALL' | 'DRAFT' | 'FINALIZED' | 'ARCHIVED') => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Neo-Brutalist Pop-Art KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sesi */}
        <div className="bg-[#FEF08A] border-2 border-black rounded-2xl p-4 sm:p-5 space-y-1.5 shadow-[4px_4px_0px_0px_#000] text-black">
          <div className="flex items-center justify-between text-black">
            <span className="text-[11px] font-mono uppercase font-black tracking-wider">
              Total Sesi Sidang
            </span>
            <div className="w-7 h-7 rounded-lg bg-black text-[#FEF08A] flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
              <FileText className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-black">
            {meetings.length}
          </p>
          <p className="text-[11px] font-bold text-black/75 font-mono">Terdokumentasi resmi</p>
        </div>

        {/* Ketetapan Pleno */}
        <div className="bg-[#FECDD3] border-2 border-black rounded-2xl p-4 sm:p-5 space-y-1.5 shadow-[4px_4px_0px_0px_#000] text-black">
          <div className="flex items-center justify-between text-black">
            <span className="text-[11px] font-mono uppercase font-black tracking-wider">
              Ketetapan Pleno
            </span>
            <div className="w-7 h-7 rounded-lg bg-black text-[#FECDD3] flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
              <Scale className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-black">
            {totalDecisions}
          </p>
          <p className="text-[11px] font-bold text-black/75 font-mono">100% Disahkan Forum</p>
        </div>

        {/* Penugasan Komisi */}
        <div className="bg-[#A7F3D0] border-2 border-black rounded-2xl p-4 sm:p-5 space-y-1.5 shadow-[4px_4px_0px_0px_#000] text-black">
          <div className="flex items-center justify-between text-black">
            <span className="text-[11px] font-mono uppercase font-black tracking-wider">
              Penugasan Komisi
            </span>
            <div className="w-7 h-7 rounded-lg bg-black text-[#A7F3D0] flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-black">
            {completedActionItems}{' '}
            <span className="text-base text-black/70 font-bold">/ {totalActionItems}</span>
          </p>
          <p className="text-[11px] font-bold text-black/75 font-mono">Komitmen terealisasi</p>
        </div>

        {/* Format Risalah */}
        <div className="bg-[#DDD6FE] border-2 border-black rounded-2xl p-4 sm:p-5 space-y-1.5 shadow-[4px_4px_0px_0px_#000] text-black">
          <div className="flex items-center justify-between text-black">
            <span className="text-[11px] font-mono uppercase font-black tracking-wider">
              Format Risalah
            </span>
            <div className="w-7 h-7 rounded-lg bg-black text-[#DDD6FE] flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
              <FileCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-black tracking-tight truncate pt-1">
            Tata Naskah Dinas
          </p>
          <p className="text-[11px] font-bold text-black/75 font-mono truncate">Berita Acara &amp; SK MPK</p>
        </div>
      </div>

      {/* Meeting List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">
            Arsip Notulen Sidang Resmi
          </h2>
          <p className="text-xs text-black/75 mt-0.5 font-bold">
            Dokumen resmi persidangan &amp; ketetapan pleno Majelis Perwakilan Kelas SMK Negeri 13 Bandung
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Cloud Backup & Google Drive Trigger */}
          <button
            onClick={() => setIsBackupModalOpen(true)}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-[#E0F2FE] hover:bg-sky-200 text-black rounded-xl text-xs font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all shrink-0 cursor-pointer"
            title="Cadangkan data ke Google Drive atau pulihkan dari cadangan"
          >
            {isAutoSyncing ? (
              <RefreshCw className="w-4 h-4 stroke-[2.5] text-sky-800 animate-spin" />
            ) : (
              <Cloud className="w-4 h-4 stroke-[2.5] text-sky-800" />
            )}
            <span>Cadangan Cloud &amp; Google</span>
            {googleAccount.connected &&
              (isAutoSyncing ? (
                <span className="hidden sm:inline-flex text-[9px] font-mono font-bold bg-[#FEF08A] px-1.5 py-0.5 rounded border border-black shadow-[0.5px_0.5px_0px_0px_#000]">
                  Menyinkronkan...
                </span>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 border border-black animate-pulse" />
                  <span className="hidden md:inline-flex text-[9px] font-mono font-bold bg-[#A7F3D0] px-1.5 py-0.5 rounded border border-black shadow-[0.5px_0.5px_0px_0px_#000]">
                    Auto
                  </span>
                </div>
              ))}
          </button>

          <button
            onClick={() => {
              handleCreateNewMeeting();
              router.push('/record');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FFE600] text-black rounded-xl text-xs font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Buat Sesi Sidang Baru
          </button>
        </div>
      </div>

      {/* Search, Filter & Per-Page Controls */}
      {meetings.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000]">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
            <label htmlFor="search-meetings" className="sr-only">
              Cari judul rapat, kata kunci, pimpinan, atau notulis
            </label>
            <input
              id="search-meetings"
              name="search-meetings"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari judul rapat, nomor arsip, kata kunci, atau pimpinan..."
              aria-label="Cari judul rapat, nomor arsip, kata kunci, atau pimpinan"
              className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-black placeholder:text-black/50 focus:outline-none focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-rose-600 p-1 font-bold"
                title="Hapus Pencarian"
                aria-label="Hapus Pencarian"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Filter Pills & Page Size Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => handleFilterChange('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer border-2 border-black ${
                  filterStatus === 'ALL'
                    ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-black hover:bg-[#FFFDF5]'
                }`}
              >
                Semua ({meetings.length})
              </button>
              <button
                onClick={() => handleFilterChange('DRAFT')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer border-2 border-black flex items-center gap-1.5 ${
                  filterStatus === 'DRAFT'
                    ? 'bg-[#FECDD3] text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-black hover:bg-[#FFFDF5]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 border border-black" />
                <span>Draf ({draftCount})</span>
              </button>
              <button
                onClick={() => handleFilterChange('FINALIZED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer border-2 border-black flex items-center gap-1.5 ${
                  filterStatus === 'FINALIZED'
                    ? 'bg-[#A7F3D0] text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-black hover:bg-[#FFFDF5]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 border border-black" />
                <span>Disahkan ({finalizedCount})</span>
              </button>
              <button
                onClick={() => handleFilterChange('ARCHIVED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer border-2 border-black flex items-center gap-1.5 ${
                  filterStatus === 'ARCHIVED'
                    ? 'bg-[#FEF08A] text-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-black hover:bg-[#FFFDF5]'
                }`}
              >
                <Archive className="w-3 h-3 stroke-[2.5]" />
                <span>Arsip Resmi ({archivedCount})</span>
              </button>
            </div>

            {/* Per-Page Selector */}
            <div className="flex items-center gap-1.5 pl-2 border-l-2 border-black text-xs font-bold font-mono">
              <label htmlFor="page-size-select" className="text-[11px] hidden md:inline text-black font-black">
                Baris:
              </label>
              <select
                id="page-size-select"
                name="page-size-select"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                aria-label="Jumlah baris per halaman"
                className="bg-[#FFFDF5] border-2 border-black text-black font-black rounded-xl px-2.5 py-1 text-xs focus:outline-none cursor-pointer shadow-[2px_2px_0px_0px_#000]"
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
        <div className="bg-white border-3 border-dashed border-black rounded-3xl p-10 sm:p-14 text-center space-y-5 shadow-[6px_6px_0px_0px_#000]">
          <div className="w-16 h-16 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center mx-auto text-black shadow-[3px_3px_0px_0px_#000]">
            <FileText className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-black text-black tracking-tight">
              Belum Ada Sesi Sidang Tersimpan
            </h3>
            <p className="text-xs text-black/75 font-bold leading-relaxed">
              Sistem siap merekam voice note sekretaris dan merumuskan risalah sidang. Silakan rekam suara sidang atau unggah berkas audio di Studio.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.push('/record')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B6B] text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Rekam Voice Note Sidang</span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#38BDF8] text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Buka Studio Agenda</span>
            </button>
          </div>
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="bg-white border-2 border-black rounded-2xl p-10 text-center space-y-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF08A] border-2 border-black flex items-center justify-center mx-auto text-black shadow-[3px_3px_0px_0px_#000]">
            <Search className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-sm font-black text-black">Tidak Ada Sesi yang Cocok</h3>
            <p className="text-xs text-black/75 font-bold leading-relaxed">
              Tidak ditemukan berkas rapat dengan kata kunci &quot;{searchQuery}&quot; pada filter terpilih.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('ALL');
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-[#FFE600] text-black border-2 border-black rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Reset Filter &amp; Pencarian</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Card List */}
          <div className="space-y-3.5">
            {paginatedMeetings.map((meet) => (
              <div
                key={meet.id}
                onClick={() => {
                  setActiveMeetingId(meet.id);
                  router.push('/notulen');
                }}
                className={`p-5 rounded-2xl border-2 border-black transition-all cursor-pointer bg-white shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] ${
                  meet.id === activeMeetingId
                    ? 'bg-[#FFFDF5] ring-2 ring-black'
                    : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {meet.status === 'FINALIZED' && !meet.isArchived && (
                        <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border-2 border-black bg-[#A7F3D0] text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                          DISAHKAN
                        </span>
                      )}
                      {meet.status === 'DRAFT' && !meet.isArchived && (
                        <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border-2 border-black bg-[#FECDD3] text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                          DRAF ONLINE
                        </span>
                      )}
                      {meet.isArchived && (
                        <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border-2 border-black bg-[#FEF08A] text-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1">
                          <Archive className="w-3 h-3 stroke-[2.5]" />
                          <span>{meet.archiveNumber || 'ARSIP RESMI'}</span>
                        </span>
                      )}
                      {meet.lastSavedAt && (
                        <span className="text-[10px] font-mono font-bold text-black/70">
                          Disimpan: {meet.lastSavedAt}
                        </span>
                      )}
                      <span className="text-[11px] text-black/60 font-mono font-bold">ID: {meet.id}</span>
                    </div>

                    <h3 className="text-base font-black text-black tracking-tight">{meet.title}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-black/80 font-mono font-bold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                        {meet.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                        {meet.attendees.length} Peserta
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                        {Math.floor(meet.durationSeconds / 60)} Menit Audio
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-2.5 self-end md:self-center flex-wrap justify-end">
                    {/* Action: Archive / Unarchive */}
                    {meet.isArchived ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnarchiveMeeting(meet.id);
                        }}
                        title="Batalkan status arsip dan kembalikan ke daftar aktif"
                        className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1 transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
                      >
                        <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="hidden sm:inline">Batal Arsip</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchiveMeeting(meet.id);
                        }}
                        title="Kunci dan daftarkan sesi ini sebagai Arsip Resmi MPK 13"
                        className="px-3 py-1.5 bg-[#FEF08A] hover:bg-[#FFE600] text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1 transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
                      >
                        <Archive className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="hidden sm:inline">Jadikan Arsip</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMeetingId(meet.id);
                        router.push('/record');
                      }}
                      className="px-3.5 py-1.5 bg-[#FFFDF5] hover:bg-[#FFE600] text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
                    >
                      <Mic className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
                      Rekam
                    </button>
                    <button className="px-4 py-1.5 bg-[#FFE600] hover:bg-[#FFD93D] text-black rounded-xl text-xs font-black flex items-center gap-1.5 transition-all border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]">
                      <span>{meet.status === 'DRAFT' && !meet.isArchived ? 'Lanjutkan Draf' : 'Buka Risalah'}</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteMeeting(meet.id, e)}
                      title="Hapus Sesi / Draf Sidang"
                      className="p-2 bg-[#FECDD3] hover:bg-[#FF6B6B] text-black border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
                    >
                      <Trash2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Navigation Footer */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t-2 border-black text-xs font-bold">
              <span className="text-black/80 font-mono text-[11px]">
                Menampilkan <strong className="text-black font-black">{startIndex + 1}</strong> –{' '}
                <strong className="text-black font-black">{endIndex}</strong> dari{' '}
                <strong className="text-black font-black">{totalItems}</strong> berkas sidang
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage <= 1}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFFDF5] text-black border-2 border-black font-black shadow-[2px_2px_0px_0px_#000] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 text-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
                >
                  <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Sebelumnya</span>
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-7 h-7 rounded-xl text-xs font-mono transition-all cursor-pointer border-2 border-black ${
                        p === safeCurrentPage
                          ? 'bg-[#FFE600] text-black font-black shadow-[2px_2px_0px_0px_#000]'
                          : 'bg-white text-black font-bold hover:bg-[#FFFDF5] shadow-[1.5px_1.5px_0px_0px_#000]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage >= totalPages}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFFDF5] text-black border-2 border-black font-black shadow-[2px_2px_0px_0px_#000] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 text-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cloud Backup Modal */}
      <CloudBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />
    </div>
  );
}
