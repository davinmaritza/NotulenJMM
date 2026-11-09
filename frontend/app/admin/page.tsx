'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMeetings } from '../../context/MeetingContext';
import { checkBackendHealth, HealthCheckResult } from '../../lib/api';
import { downloadBackupFile, parseAndValidateBackup } from '../../lib/googleDriveBackup';
import {
  Shield,
  Users,
  FileCheck,
  CheckSquare,
  Scale,
  Cloud,
  Database,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  LogOut,
  UserCheck,
  Settings2,
  BarChart3,
  Award,
} from 'lucide-react';
import { Decision, Meeting, ActionItem } from '../../lib/types';

interface CommissionInfo {
  id: string;
  name: string;
  code: string;
  coordinator: string;
  classGrade: string;
  memberCount: number;
  focus: string;
  color: string;
  activePrograms: string[];
}

const DEFAULT_COMMISSIONS: CommissionInfo[] = [
  {
    id: 'komisi-a',
    name: 'Komisi A (Organisasi, Hukum & Kaderisasi)',
    code: 'KOM-A',
    coordinator: 'Siti Rahmawati',
    classGrade: 'XI RPL 1',
    memberCount: 6,
    focus: 'Verifikasi kuorum sidang, tata tertib musyawarah, penyelarasan AD/ART, dan sertijab pengurus.',
    color: '#FFE600',
    activePrograms: ['Sosialisasi Tata Naskah Dinas', 'Uji Kelayakan Calon Pengurus MPK', 'Sidang Pleno Evaluasi'],
  },
  {
    id: 'komisi-b',
    name: 'Komisi B (Aspirasi, Advokasi & Humas)',
    code: 'KOM-B',
    coordinator: 'Dimas Pratama',
    classGrade: 'XI TKJ 2',
    memberCount: 8,
    focus: 'Penjaringan suara perwakilan kelas, advokasi aspirasi siswa ke sekolah, dan publikasi transparansi.',
    color: '#38BDF8',
    activePrograms: ['Kotak Aspirasi Digital', 'Buletin Suara Majelis', 'Forum Dialog Terbuka Siswa'],
  },
  {
    id: 'komisi-c',
    name: 'Komisi C (Anggaran, Keuangan & Aset)',
    code: 'KOM-C',
    coordinator: 'Alya Zahra',
    classGrade: 'XI AKL 1',
    memberCount: 5,
    focus: 'Pengawasan rancangan anggaran OSIS & Ekskul, audit SPJ kegiatan, dan inventarisasi fasilitas majelis.',
    color: '#A7F3D0',
    activePrograms: ['Audit Transparansi SPJ LDKS', 'Verifikasi RAPB Tahunan', 'Standarisasi Format Kwitansi'],
  },
  {
    id: 'komisi-d',
    name: 'Komisi D (Pengawasan Ekstrakurikuler & Disiplin)',
    code: 'KOM-D',
    coordinator: 'Farhan Malik',
    classGrade: 'XI DKV 1',
    memberCount: 7,
    focus: 'Monitoring keterlaksanaan program kerja 23 ekstrakurikuler, evaluasi pembina, dan disiplin anggota.',
    color: '#FF6B6B',
    activePrograms: ['Monitoring Latihan Gabungan Ekskul', 'Evaluasi Keterlaksanaan Proker', 'Pemberian Rekomendasi'],
  },
];

export default function AdminPage() {
  const router = useRouter();
  const {
    meetings,
    activeMeetingId,
    setActiveMeetingId,
    handleRestoreBackup,
    handleTriggerManualSync,
    googleAccount,
    historyLogs,
    isAutoSyncing,
    handleLogoutGoogle,
    handleLoginWithEmail,
    isAdmin,
  } = useMeetings();

  const [activeTab, setActiveTab] = useState<'overview' | 'commissions' | 'decisions' | 'audit' | 'system'>('overview');
  const [commissions, setCommissions] = useState<CommissionInfo[]>(DEFAULT_COMMISSIONS);
  const [backendHealth, setBackendHealth] = useState<HealthCheckResult | null>(null);
  const [isPingingBackend, setIsPingingBackend] = useState<boolean>(false);
  const [searchDecision, setSearchDecision] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Load backend health
  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((res) => {
      if (isMounted) setBackendHealth(res);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshBackendStatus = async () => {
    setIsPingingBackend(true);
    const res = await checkBackendHealth();
    setBackendHealth(res);
    setIsPingingBackend(false);
    showNotice(`Status backend diperbarui: ${res.online ? 'Online (HTTP 200)' : 'Offline / Standalone'}`);
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Aggregated Data Calculations
  const allDecisions: { decision: Decision; meetingTitle: string; meetingDate: string; meetingId: string }[] = [];
  const allActionItems: { item: ActionItem; meetingTitle: string }[] = [];

  meetings.forEach((m) => {
    m.decisions?.forEach((d) => {
      allDecisions.push({
        decision: d,
        meetingTitle: m.title,
        meetingDate: m.date,
        meetingId: m.id,
      });
    });
    m.actionItems?.forEach((a) => {
      allActionItems.push({
        item: a,
        meetingTitle: m.title,
      });
    });
  });

  const totalDecisionsCount = allDecisions.length;
  const approvedDecisionsCount = allDecisions.filter((d) => d.decision.status === 'DISAHKAN').length;
  const totalTasksCount = allActionItems.length;
  const completedTasksCount = allActionItems.filter((a) => a.item.status === 'COMPLETED').length;
  const taskProgressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Filtered decisions for the ledger tab
  const filteredDecisions = allDecisions.filter((d) => {
    const matchCategory = filterCategory === 'ALL' || d.decision.category === filterCategory;
    const matchSearch =
      !searchDecision ||
      d.decision.number.toLowerCase().includes(searchDecision.toLowerCase()) ||
      d.decision.decisionText.toLowerCase().includes(searchDecision.toLowerCase()) ||
      d.meetingTitle.toLowerCase().includes(searchDecision.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Export Full JSON Backup
  const handleExportBackup = () => {
    try {
      const filename = downloadBackupFile(meetings);
      showNotice(`Cadangan data ${filename} (${meetings.length} sidang) berhasil diunduh!`);
    } catch {
      showNotice('Gagal mengekspor data cadangan.');
    }
  };

  // Import JSON Backup File
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = parseAndValidateBackup(content);
        if (result.success && result.meetings && result.meetings.length > 0) {
          handleRestoreBackup(result.meetings);
          showNotice(`Berhasil memulihkan ${result.meetings.length} risalah sidang dari berkas cadangan!`);
        } else {
          showNotice(result.message || 'Format berkas tidak valid atau data kosong.');
        }
      } catch {
        showNotice('Gagal memproses berkas cadangan.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-7xl mx-auto">
      {/* 1. Admin Institutional Banner */}
      <div className="bg-white border-[3px] border-black rounded-3xl p-5 sm:p-7 shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center p-2 shadow-[3px_3px_0px_0px_#000] shrink-0">
              <Shield className="w-8 h-8 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-black text-[#FFE600] font-mono text-[10px] font-black uppercase tracking-wider">
                  Panel Administrator
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-black border border-black font-mono text-[10px] font-bold">
                  MPK SMK Negeri 13 Bandung
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#A7F3D0] text-black border border-black font-mono text-[10px] font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Presidium Aktif
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFE600] text-black border border-black font-mono text-[10px] font-black shadow-[1px_1px_0px_0px_#000]">
                  <Shield className="w-3 h-3 text-black stroke-[3]" />
                  Admin: alfarrezald@gmail.com
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                Pusat Tata Kelola &amp; Integritas Majelis
              </h1>
              <p className="text-xs text-zinc-700 font-sans font-medium mt-0.5">
                Monitoring kuorum sidang, manajemen 4 komisi kerja, buku induk ketetapan TAP, dan pemeliharaan arsip cloud.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FFFDF5] hover:bg-yellow-100 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Unduh seluruh database rapat ke JSON"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Ekspor JSON</span>
            </button>

            <label className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-zinc-100 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Impor Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            <button
              onClick={handleTriggerManualSync}
              disabled={isAutoSyncing || !googleAccount.connected}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FFE600] hover:bg-[#ffd93d] disabled:opacity-50 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Sinkronisasi manual ke Google Drive"
            >
              <Cloud className={`w-3.5 h-3.5 stroke-[2.5] ${isAutoSyncing ? 'animate-spin' : ''}`} />
              <span>{isAutoSyncing ? 'Sinkronisasi...' : 'Sync Cloud'}</span>
            </button>
          </div>
        </div>

        {/* Action Notice Alert if Triggered */}
        {actionNotice && (
          <div className="mt-4 p-3 rounded-xl bg-[#E0F2FE] border-2 border-black text-xs font-bold text-black flex items-center justify-between shadow-[2px_2px_0px_0px_#000] animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-700" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-xs font-black text-zinc-600 hover:text-black"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* 2. Bento Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Sidang */}
        <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-zinc-600 uppercase tracking-wider">
              Total Sidang
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FFE600] border border-black flex items-center justify-center">
              <FileText className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black">
            {meetings.length}
          </div>
          <p className="text-[10px] text-zinc-600 font-medium">
            {meetings.filter((m) => m.status === 'FINALIZED').length} Disahkan • {meetings.filter((m) => m.status === 'DRAFT').length} Draf
          </p>
        </div>

        {/* Card 2: Ketetapan Disahkan */}
        <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-zinc-600 uppercase tracking-wider">
              Ketetapan TAP
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#A7F3D0] border border-black flex items-center justify-center">
              <Scale className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black">
            {approvedDecisionsCount}
            <span className="text-xs text-zinc-500 font-mono font-normal ml-1">/ {totalDecisionsCount}</span>
          </div>
          <p className="text-[10px] text-zinc-600 font-medium">
            Ketetapan resmi majelis berkekuatan hukum
          </p>
        </div>

        {/* Card 3: Penugasan PIC & Keterlaksanaan */}
        <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-zinc-600 uppercase tracking-wider">
              Penugasan PIC
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#38BDF8] border border-black flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black">
            {taskProgressPercent}%
            <span className="text-xs text-zinc-500 font-mono font-normal ml-1">selesai</span>
          </div>
          <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden border border-black/30">
            <div
              className="bg-[#38BDF8] h-full transition-all duration-500"
              style={{ width: `${taskProgressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-600 font-medium">
            {completedTasksCount} dari {totalTasksCount} tugas dituntaskan
          </p>
        </div>

        {/* Card 4: Sesi & Cloud Sync */}
        <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-zinc-600 uppercase tracking-wider">
              Status Sinkron
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FFD93D] border border-black flex items-center justify-center">
              <Cloud className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
          </div>
          <div className="text-sm font-black text-black truncate">
            {googleAccount.connected ? 'Google Drive' : 'Mode Offline'}
          </div>
          <p className="text-[10px] text-zinc-600 font-mono truncate">
            {googleAccount.connected && googleAccount.email ? googleAccount.email : 'Sesi Tamu Terproteksi'}
          </p>
          <div className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Penyimpanan Aman</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b-2 border-black/15 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white text-zinc-700 border-2 border-black/20 hover:border-black hover:text-black'
          }`}
        >
          <BarChart3 className="w-4 h-4 stroke-[2.5]" />
          <span>Ringkasan Eksekutif</span>
        </button>

        <button
          onClick={() => setActiveTab('commissions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'commissions'
              ? 'bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white text-zinc-700 border-2 border-black/20 hover:border-black hover:text-black'
          }`}
        >
          <Users className="w-4 h-4 stroke-[2.5]" />
          <span>Tata Kelola 4 Komisi</span>
        </button>

        <button
          onClick={() => setActiveTab('decisions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'decisions'
              ? 'bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white text-zinc-700 border-2 border-black/20 hover:border-black hover:text-black'
          }`}
        >
          <Scale className="w-4 h-4 stroke-[2.5]" />
          <span>Buku Induk Ketetapan TAP ({allDecisions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white text-zinc-700 border-2 border-black/20 hover:border-black hover:text-black'
          }`}
        >
          <Clock className="w-4 h-4 stroke-[2.5]" />
          <span>Audit Log Notulis ({historyLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'system'
              ? 'bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]'
              : 'bg-white text-zinc-700 border-2 border-black/20 hover:border-black hover:text-black'
          }`}
        >
          <Settings2 className="w-4 h-4 stroke-[2.5]" />
          <span>Diagnostik &amp; Pemeliharaan</span>
        </button>
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Administrator Utama Card */}
          <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600 stroke-[2.5]" />
                <h2 className="text-base font-black text-black">Administrator Sistem Utama &amp; Dewan Pengawas</h2>
              </div>
              <span className="text-[10px] font-mono font-black text-amber-950 bg-[#FFE600] px-2.5 py-1 rounded-full border border-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]">
                ROOT SUPERADMIN ACCESS
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDF5] border-2 border-black flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-black text-[#FFE600] border-2 border-black flex items-center justify-center font-black text-lg shrink-0 shadow-[2px_2px_0px_0px_#000]">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-black">alfarrezald@gmail.com</span>
                    <span className="px-2 py-0.5 bg-black text-[#FFE600] text-[9px] font-mono font-black rounded-full uppercase">
                      SUPERADMIN
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-black text-[9px] font-mono font-black rounded-full">
                      HAK AKSES PENUH
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">
                    Otoritas tertinggi pengesahan risalah sidang, kontrol tata kelola 4 komisi kerja, buku induk ketetapan TAP, audit log notulis, dan manajemen master cloud.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                {googleAccount.email?.toLowerCase() === 'alfarrezald@gmail.com' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-900 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                    Sesi Aktif
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      handleLoginWithEmail('alfarrezald@gmail.com', 'Alfarrezald (Administrator Utama)');
                      showNotice('Sesi Administrator alfarrezald@gmail.com berhasil diaktifkan!');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FFE600] hover:bg-yellow-300 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Aktifkan Sesi Admin</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Presidium Card */}
          <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600 stroke-[2.5]" />
                <h2 className="text-base font-black text-black">Presidium Sidang Utama • MPK Periode 2026/2027</h2>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-black">
                SK Kepala SMKN 13 Bandung
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#FFFDF5] border-2 border-black space-y-1">
                <span className="text-[10px] font-mono uppercase font-black text-zinc-600 block">Ketua MPK</span>
                <p className="text-sm font-black text-black">Davin Maritza</p>
                <p className="text-[11px] text-zinc-600">Pimpinan Sidang Pleno I</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFFDF5] border-2 border-black space-y-1">
                <span className="text-[10px] font-mono uppercase font-black text-zinc-600 block">Wakil Ketua MPK</span>
                <p className="text-sm font-black text-black">M. Rizky Pratama</p>
                <p className="text-[11px] text-zinc-600">Pimpinan Sidang Pleno II</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFFDF5] border-2 border-black space-y-1">
                <span className="text-[10px] font-mono uppercase font-black text-zinc-600 block">Sekretaris Jenderal</span>
                <p className="text-sm font-black text-black">Nadhira Putri</p>
                <p className="text-[11px] text-zinc-600">Penanggung Jawab Notulensi</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFFDF5] border-2 border-black space-y-1">
                <span className="text-[10px] font-mono uppercase font-black text-zinc-600 block">Bendahara Umum</span>
                <p className="text-sm font-black text-black">Kayla Anindya</p>
                <p className="text-[11px] text-zinc-600">Verifikator Anggaran Sidang</p>
              </div>
            </div>
          </div>

          {/* Recent Meetings Table */}
          <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-black stroke-[2.5]" />
                <h2 className="text-base font-black text-black">Daftar Sidang Terdaftar ({meetings.length})</h2>
              </div>
              <button
                onClick={() => router.push('/arsip')}
                className="text-xs font-black text-black hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Buka Pusat Arsip</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {meetings.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">Belum ada risalah sidang tercatat.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-black bg-[#FFFDF5] font-mono text-[10px] uppercase text-zinc-700">
                      <th className="py-2.5 px-3">Judul Sidang</th>
                      <th className="py-2.5 px-3">Tanggal</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-center">Keputusan</th>
                      <th className="py-2.5 px-3 text-center">Penugasan</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 font-sans">
                    {meetings.slice(0, 5).map((m) => (
                      <tr key={m.id} className="hover:bg-yellow-50/50 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-black max-w-xs truncate">
                          {m.title}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-600 font-mono text-[11px]">
                          {m.date}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-black border border-black ${
                              m.status === 'FINALIZED'
                                ? 'bg-[#A7F3D0] text-black'
                                : 'bg-[#FFE600] text-black'
                            }`}
                          >
                            {m.status === 'FINALIZED' ? 'DISAHKAN' : 'DRAF'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          {m.decisions?.length || 0}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          {m.actionItems?.length || 0}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setActiveMeetingId(m.id);
                              router.push('/notulen');
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-yellow-100 text-black border border-black rounded text-[11px] font-bold shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                          >
                            Buka
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: 4 COMMISSIONS MANAGEMENT */}
      {activeTab === 'commissions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commissions.map((comm) => (
              <div
                key={comm.id}
                className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] space-y-3.5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2 border-b-2 border-black/10 pb-3">
                  <div>
                    <span
                      className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-black border border-black mb-1.5 shadow-[1px_1px_0px_0px_#000]"
                      style={{ backgroundColor: comm.color }}
                    >
                      {comm.code}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-black">
                      {comm.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 block">Koordinator</span>
                    <span className="text-xs font-black text-black">{comm.coordinator}</span>
                    <span className="text-[10px] text-zinc-600 block">{comm.classGrade}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-700 leading-relaxed">
                  {comm.focus}
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase font-black text-zinc-600 block">
                    Fokus Program Kerja Utama:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {comm.activePrograms.map((prog, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-[#FFFDF5] text-black border border-black rounded-md text-[10px] font-bold shadow-[1px_1px_0px_0px_#000]"
                      >
                        • {prog}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/10 text-[11px] font-mono text-zinc-600">
                  <span>Kekuatan Komisi: {comm.memberCount} Anggota MPK</span>
                  <span className="font-bold text-emerald-700">Aktif Berjalan</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DECISIONS LEDGER (BUKU INDUK KETETAPAN TAP) */}
      {activeTab === 'decisions' && (
        <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-black/10 pb-3">
            <div>
              <h2 className="text-base font-black text-black">Buku Induk Registri Ketetapan Sidang</h2>
              <p className="text-xs text-zinc-600">Daftar seluruh TAP dan KEP yang disahkan dalam forum sidang pleno majelis.</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Cari nomor / judul ketetapan..."
                  value={searchDecision}
                  onChange={(e) => setSearchDecision(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#FFFDF5] border border-black text-xs font-medium rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-1.5 px-2 bg-[#FFFDF5] border border-black text-xs font-bold rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Organisasi">Organisasi</option>
                <option value="Keuangan">Keuangan</option>
                <option value="Program Kerja">Program Kerja</option>
                <option value="Disiplin">Disiplin</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
          </div>

          {filteredDecisions.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-bold text-zinc-600">Tidak ada ketetapan yang cocok.</p>
              <p className="text-xs text-zinc-500">Ketetapan akan otomatis tercatat setiap kali notulen disahkan di Editor Risalah.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDecisions.map(({ decision, meetingTitle, meetingDate, meetingId }) => (
                <div
                  key={decision.id}
                  className="p-4 rounded-xl bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black bg-[#FFE600] px-2 py-0.5 rounded border border-black">
                        {decision.number}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-black/40">
                        {decision.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
                      <span>Sidang: {meetingTitle}</span>
                      <span>•</span>
                      <span>{decision.date || meetingDate}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-black leading-snug">
                    {decision.decisionText}
                  </p>

                  {decision.rationale && (
                    <p className="text-[11px] text-zinc-700 italic bg-white p-2 rounded-lg border border-black/20">
                      Pertimbangan: {decision.rationale}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border border-black ${
                        decision.status === 'DISAHKAN' ? 'bg-[#A7F3D0] text-black' : 'bg-[#FFD93D] text-black'
                      }`}
                    >
                      {decision.status}
                    </span>

                    <button
                      onClick={() => {
                        setActiveMeetingId(meetingId);
                        router.push('/notulen');
                      }}
                      className="text-[11px] font-black text-black hover:underline cursor-pointer"
                    >
                      Lihat Naskah Lengkap ➜
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT LOG NOTULIS */}
      {activeTab === 'audit' && (
        <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-base font-black text-black">Audit Trail Aktivitas Notulensi</h2>
              <p className="text-xs text-zinc-600">Catatan riwayat perubahan data, sinkronisasi, dan aksi pengguna terverifikasi.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-[#FFE600] px-2 py-0.5 rounded border border-black text-black shadow-[1px_1px_0px_0px_#000]">
                Supervisor: alfarrezald@gmail.com
              </span>
              <span className="text-xs font-mono font-bold bg-[#E0F2FE] px-2 py-0.5 rounded border border-black">
                {historyLogs.length} Entri Tercatat
              </span>
            </div>
          </div>

          {historyLogs.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-8">Belum ada riwayat aktivitas yang tercatat.</p>
          ) : (
            <div className="space-y-2">
              {historyLogs.slice(0, 15).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#FFFDF5] border border-black flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[9px] font-black border border-black shrink-0 ${
                        log.action === 'CREATE'
                          ? 'bg-[#A7F3D0]'
                          : log.action === 'BACKUP_CLOUD'
                          ? 'bg-[#38BDF8]'
                          : log.action === 'ARCHIVE'
                          ? 'bg-[#FFE600]'
                          : 'bg-white'
                      }`}
                    >
                      {log.action}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-black">{log.title}</span>
                      <p className="text-[10px] text-zinc-600 truncate">{log.details}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SYSTEM DIAGNOSTICS & MAINTENANCE */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Diagnostic Status Cards */}
          <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-black stroke-[2.5]" />
                <h2 className="text-base font-black text-black">Diagnostik Mesin &amp; Integrasi</h2>
              </div>
              <button
                onClick={refreshBackendStatus}
                disabled={isPingingBackend}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#FFFDF5] hover:bg-yellow-100 text-black border border-black rounded-lg text-xs font-bold shadow-[1px_1px_0px_0px_#000] cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isPingingBackend ? 'animate-spin' : ''}`} />
                <span>Tes Ulang Koneksi</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Superadmin Operator */}
              <div className="p-3.5 rounded-xl bg-[#FFFDF5] border-2 border-black space-y-1">
                <span className="text-[10px] font-mono uppercase font-black text-amber-700 block">Root Administrator</span>
                <p className="text-xs font-black text-black truncate" title="alfarrezald@gmail.com">
                  alfarrezald@gmail.com
                </p>
                <p className="text-[10px] text-emerald-800 font-bold font-mono">
                  {googleAccount.email?.toLowerCase() === 'alfarrezald@gmail.com' ? '● Sesi Aktif' : '○ Hak Akses Terdaftar'}
                </p>
              </div>

              {/* Backend API */}
              <div className="p-3.5 rounded-xl bg-[#FFFDF5] border-2 border-black space-y-1">
                <span className="text-[10px] font-mono uppercase font-black text-zinc-600 block">FastAPI Backend</span>
                <p className="text-sm font-black text-black">
                  {backendHealth?.online ? 'Online (Port 8000)' : 'Mode Standalone'}
                </p>
                <p className="text-[10px] text-zinc-600 font-mono">
                  {backendHealth?.router_gateway || 'client-simulation ready'}
                </p>
              </div>

              {/* VibeVoice STT */}
              <div className="p-3.5 rounded-xl bg-[#FFFDF5] border-2 border-black space-y-1">
                <span className="text-[10px] font-mono uppercase font-black text-zinc-600 block">Mesin Transkripsi (STT)</span>
                <p className="text-sm font-black text-black">
                  Web Speech API + Google STT
                </p>
                <p className="text-[10px] text-zinc-600 font-mono">
                  Transkripsi Suara Nyata (Bebas Mock)
                </p>
              </div>

              {/* Cloud Otorisasi */}
              <div className="p-3.5 rounded-xl bg-[#FFFDF5] border-2 border-black space-y-1">
                <span className="text-[10px] font-mono uppercase font-black text-zinc-600 block">Google Drive Cloud</span>
                <p className="text-sm font-black text-black">
                  {googleAccount.connected ? 'Terhubung' : 'Offline / Tamu'}
                </p>
                <p className="text-[10px] text-zinc-600 font-mono truncate">
                  {googleAccount.lastSyncTime ? `Sinkron: ${new Date(googleAccount.lastSyncTime).toLocaleTimeString('id-ID')}` : 'Belum sinkron'}
                </p>
              </div>
            </div>
          </div>

          {/* Data Maintenance Tools */}
          <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <h2 className="text-base font-black text-black border-b-2 border-black/10 pb-3">
              Tindakan Pemeliharaan Data
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FFFDF5] border-2 border-black space-y-2">
                <h3 className="text-xs font-black text-black">Cadangkan Seluruh Arsip (Full Export)</h3>
                <p className="text-[11px] text-zinc-600">
                  Mengunduh seluruh file notulen, transkripsi audio, dan ketetapan ke dalam 1 file JSON terenkripsi mandiri.
                </p>
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2 bg-[#FFE600] text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-[#ffd93d]"
                >
                  Unduh Arsip Master JSON
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFDF5] border-2 border-black space-y-2">
                <h3 className="text-xs font-black text-black">Pulihkan dari Berkas Cadangan (Restore)</h3>
                <p className="text-[11px] text-zinc-600">
                  Memulihkan seluruh risalah sidang dari file JSON cadangan tanpa menimpa data yang sedang aktif.
                </p>
                <label className="inline-block px-4 py-2 bg-white text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-zinc-100">
                  Pilih Berkas JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
