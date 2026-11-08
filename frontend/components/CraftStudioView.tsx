'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Smartphone,
  Gamepad2,
  Sparkles,
  Check,
  ArrowRight,
  RotateCcw,
  Plus,
  Trash2,
  FileText,
  Users,
  Briefcase,
  Building2,
  Scale,
  Pencil,
  Eye,
  Sliders,
  Shield,
  Trophy,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMeetings } from '../context/MeetingContext';

export interface CardConfig {
  id: string;
  iconName:
    | 'Globe'
    | 'Smartphone'
    | 'Gamepad2'
    | 'Sparkles'
    | 'FileText'
    | 'Users'
    | 'Briefcase'
    | 'Building2'
    | 'Scale'
    | 'Sliders'
    | 'Shield'
    | 'Trophy'
    | 'Plus';
  title: string;
  description: string;
  isCustom?: boolean;
}

export interface CraftStudioConfig {
  tab1Name: string;
  tab2Name: string;
  headerTitle: string;
  headerSubtitle: string;
  step1Title: string;
  step2Title: string;
  promptPlaceholder: string;
  cards: CardConfig[];
  ideaPills: string[];
}

export const PRESET_MPK: CraftStudioConfig = {
  tab1Name: 'Format Musyawarah',
  tab2Name: 'Bank Dokumen',
  headerTitle: 'Format Musyawarah & Penyusunan Risalah Sidang',
  headerSubtitle: 'Pilih format persidangan, susun pokok usulan komisi atau dewan pembina, dan rumuskan risalah resmi berstandar Majelis Perwakilan Kelas SMK Negeri 13 Bandung.',
  step1Title: 'Pilih format persidangan majelis',
  step2Title: 'Uraikan pokok bahasan & materi usulan',
  promptPlaceholder: 'Tuliskan pokok agenda sidang MPK SMK Negeri 13 Bandung, draf pasal ketetapan, usulan perwakilan kelas, atau alokasi anggaran yang akan diputuskan...',
  cards: [
    {
      id: 'pleno',
      iconName: 'Scale',
      title: 'Sidang Pleno',
      description: 'Tata tertib, ketetapan majelis, dan voting pengurus kelas',
    },
    {
      id: 'raker',
      iconName: 'Users',
      title: 'Rapat Kerja (Raker)',
      description: 'Penyusunan program kerja, koordinasi komisi & divisi OSIS',
    },
    {
      id: 'evaluasi',
      iconName: 'FileText',
      title: 'Evaluasi Program (LPJ)',
      description: 'Laporan pertanggungjawaban kegiatan & evaluasi kinerja siswa',
    },
    {
      id: 'kustom',
      iconName: 'Sliders',
      title: 'Agenda Kustom',
      description: 'Format terbuka untuk koordinasi darurat, komisi khusus, atau ide bebas',
      isCustom: true,
    },
  ],
  ideaPills: [
    'Evaluasi LPJ Porseni Semester Genap',
    'Perencanaan Anggaran Dana LDKS 2026',
    'Struktur Kepengurusan MPK Periode 2026/2027',
    'Penyusunan Aspirasi Siswa Terkait Fasilitas Sekolah',
  ],
};

export const PRESET_PANITIA_MPLS: CraftStudioConfig = {
  tab1Name: 'Kepanitiaan & Pokja',
  tab2Name: 'Bank Dokumen',
  headerTitle: 'Pembentukan Panitia & Pokja Khusus Sekolah',
  headerSubtitle: 'Susun susunan panitia pelaksana, rincian job description 6 divisi operasional, estimasi RAB, dan tata tertib ramah anak berstandar SMK Negeri 13 Bandung.',
  step1Title: 'Pilih agenda kepanitiaan',
  step2Title: 'Uraikan susunan tugas & divisi',
  promptPlaceholder: 'Tuliskan nama ketua pelaksana, koordinator divisi acara/tatib/logistik/humas/medis/konsumsi, pagu anggaran, serta jadwal gladi bersih...',
  cards: [
    {
      id: 'panitia-mpls',
      iconName: 'Users',
      title: 'Panitia MPLS 2026/2027',
      description: 'Struktur panitia masa pengenalan lingkungan sekolah, jobdesk divisi, & RAB',
    },
    {
      id: 'panitia-ldks',
      iconName: 'Shield',
      title: 'Panitia LDKS & Kaderisasi',
      description: 'Latihan dasar kepemimpinan siswa, kurikulum persidangan, & simulasi parlemen',
    },
    {
      id: 'panitia-porseni',
      iconName: 'Trophy',
      title: 'Panitia Porseni & Dies Natalis',
      description: 'Pekan olahraga & seni antarkelas, perizinan sarana prasarana, & jadwal pertandingan',
    },
    {
      id: 'panitia-kustom',
      iconName: 'Sliders',
      title: 'Kepanitiaan Terbuka / Ad-Hoc',
      description: 'Format fleksibel untuk kepanitiaan seminar, bakti sosial, atau proyek kejuruan',
      isCustom: true,
    },
  ],
  ideaPills: [
    'Struktur Panitia Inti & 6 Koordinator Divisi MPLS 2026/2027',
    'Pengesahan Pagu Rencana Anggaran Biaya (RAB) Operasional MPLS',
    'Penetapan SOP & Tata Tertib MPLS Ramah Anak Bebas Perpeloncoan',
    'Jadwal Sosialisasi Bersama Pembina Kesiswaan & Gladi Bersih H-2',
  ],
};

export const PRESET_ORGANISASI: CraftStudioConfig = {
  tab1Name: 'Format Musyawarah',
  tab2Name: 'Bank Dokumen',
  headerTitle: 'Musyawarah & Kepemimpinan Sekolah',
  headerSubtitle: 'Dokumentasikan setiap musyawarah mufakat secara presisi, akuntabel, dan transparan bagi seluruh civitas sekolah.',
  step1Title: 'Pilih agenda musyawarah',
  step2Title: 'Rincian pembahasan & usulan',
  promptPlaceholder: 'Tuliskan poin-poin usulan fraksi, perwakilan kelas, atau dewan guru yang perlu diputuskan...',
  cards: [
    {
      id: 'mubes',
      iconName: 'Building2',
      title: 'Musyawarah Besar',
      description: 'Pembahasan AD/ART dan pemilihan ketua umum MPK/OSIS',
    },
    {
      id: 'koordinasi',
      iconName: 'Briefcase',
      title: 'Koordinasi Pembina',
      description: 'Sinkronisasi kebijakan kurikulum, sarpras, dan kesiswaan',
    },
    {
      id: 'komisi',
      iconName: 'Scale',
      title: 'Sidang Komisi',
      description: 'Penegakan disiplin organisasi dan pengawasan tata tertib',
    },
    {
      id: 'umum',
      iconName: 'Sparkles',
      title: 'Forum Aspirasi',
      description: 'Rembug terbuka siswa untuk menjaring ide inovasi sekolah',
    },
    {
      id: 'kustom-organisasi',
      iconName: 'Sliders',
      title: 'Agenda Kustom',
      description: 'Format terbuka untuk koordinasi darurat atau agenda khusus kepengurusan',
      isCustom: true,
    },
  ],
  ideaPills: [
    'Revisi Tata Tertib Pemilihan Ketua OSIS',
    'Pengalokasian Dana Bantuan Program Kreativitas Siswa',
    'Evaluasi Sarana Ruang Belajar & Koneksi Internet Lab',
    'Standardisasi Format Notula Rapat Seluruh Ekskul',
  ],
};

const LOCAL_STORAGE_KEY = 'notulenjmm_craft_studio_config_v1';

interface CraftStudioViewProps {
  onStartSession: (session: {
    cardTitle: string;
    cardDescription: string;
    prompt: string;
    engine: string;
    destinationFolder: string;
    activeTab: string;
  }) => void;
}

export const CraftStudioView: React.FC<CraftStudioViewProps> = ({ onStartSession }) => {
  const router = useRouter();
  const { openBeginnerGuide, isBeginnerMode, handleCreateMplsMeeting } = useMeetings();
  const [config, setConfig] = useState<CraftStudioConfig>(PRESET_MPK);
  const [activePreset, setActivePreset] = useState<'mpk' | 'mpls' | 'organisasi' | 'custom'>('mpk');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleTryInstantExample = () => {
    handleCreateMplsMeeting();
    router.push('/notulen');
  };

  // Interactive selection states
  const [activeTabMode, setActiveTabMode] = useState<'tab1' | 'tab2'>('tab1');
  const [selectedCardId, setSelectedCardId] = useState<string>('pleno');
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  // Hydrate custom config from localStorage once on client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setConfig(parsed);
          if (parsed.cards && parsed.cards.length > 0) {
            setSelectedCardId(parsed.cards[0].id);
          }
        }
      } catch (e) {
        console.warn('Could not load custom craft config from localStorage', e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [promptText, setPromptText] = useState<string>('');
  const [selectedEngine, setSelectedEngine] = useState<string>(
    'Tata Naskah Dinas MPK 13 (Standar Utama)'
  );
  const [folderPath] = useState<string>('/home/suzirz/Documents/Project/NotulenJMM/notulen');
  const [newPillInput, setNewPillInput] = useState<string>('');
  const [showAddPill, setShowAddPill] = useState<boolean>(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Save to localStorage with debounce for fast typing without lag
  const saveConfig = (newConfig: CraftStudioConfig, immediate: boolean = false) => {
    setConfig(newConfig);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const persist = () => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
        setSaveStatus('Tersimpan');
        setTimeout(() => setSaveStatus(''), 1500);
      } catch (e) {
        console.warn('Failed to save to localStorage', e);
      }
    };

    if (immediate) {
      persist();
    } else {
      debounceTimerRef.current = setTimeout(persist, 350);
    }
  };

  const handleApplyPreset = (presetKey: 'mpk' | 'mpls' | 'organisasi') => {
    let target = PRESET_MPK;
    if (presetKey === 'mpls') target = PRESET_PANITIA_MPLS;
    if (presetKey === 'organisasi') target = PRESET_ORGANISASI;

    setActivePreset(presetKey);
    setSelectedCardId(target.cards[0].id);
    setEditingCardIndex(null);
    saveConfig(target, true);
  };

  const handleResetToPreset = () => {
    handleApplyPreset(activePreset === 'custom' ? 'mpk' : activePreset);
  };

  // Card update handler (debounced persistence for typing smoothness)
  const handleUpdateCard = (index: number, field: 'title' | 'description' | 'iconName', value: string) => {
    const updatedCards = [...config.cards];
    updatedCards[index] = {
      ...updatedCards[index],
      [field]: value,
    };
    saveConfig({ ...config, cards: updatedCards }, field === 'iconName');
    setActivePreset('custom');
  };

  const customIdSeedRef = useRef(1);

  // Add new custom card handler (immediate persistence)
  const handleAddNewCustomCard = () => {
    const nextSeed = customIdSeedRef.current + 1;
    customIdSeedRef.current = nextSeed;
    const newId = `custom-agenda-${nextSeed}-${config.cards.length + 1}`;
    const newCard: CardConfig = {
      id: newId,
      iconName: 'Sliders',
      title: 'Agenda Kustom Baru',
      description: 'Tentukan agenda sidang atau musyawarah sesuai kebutuhan Anda',
      isCustom: true,
    };
    const updatedCards = [...config.cards, newCard];
    saveConfig({ ...config, cards: updatedCards }, true);
    setSelectedCardId(newId);
    setEditingCardIndex(updatedCards.length - 1);
    setActivePreset('custom');
  };

  // Delete card handler (immediate persistence)
  const handleDeleteCard = (indexToDelete: number) => {
    if (config.cards.length <= 1) return;
    const cardToDelete = config.cards[indexToDelete];
    const updatedCards = config.cards.filter((_, idx) => idx !== indexToDelete);
    saveConfig({ ...config, cards: updatedCards }, true);
    if (selectedCardId === cardToDelete.id) {
      setSelectedCardId(updatedCards[0]?.id || '');
    }
    setEditingCardIndex(null);
    setActivePreset('custom');
  };

  // Idea Pill handlers
  const handleAddPill = () => {
    if (!newPillInput.trim()) return;
    const updated = [...config.ideaPills, newPillInput.trim()];
    saveConfig({ ...config, ideaPills: updated });
    setNewPillInput('');
    setShowAddPill(false);
    setActivePreset('custom');
  };

  const handleRemovePill = (indexToRemove: number) => {
    const updated = config.ideaPills.filter((_, idx) => idx !== indexToRemove);
    saveConfig({ ...config, ideaPills: updated });
    setActivePreset('custom');
  };

  const handleUpdatePill = (index: number, val: string) => {
    const updated = [...config.ideaPills];
    updated[index] = val;
    saveConfig({ ...config, ideaPills: updated });
    setActivePreset('custom');
  };

  // Icon component helper
  const renderIcon = (name: CardConfig['iconName'], className: string = 'w-5 h-5') => {
    switch (name) {
      case 'Globe':
        return <Globe className={className} />;
      case 'Smartphone':
        return <Smartphone className={className} />;
      case 'Gamepad2':
        return <Gamepad2 className={className} />;
      case 'FileText':
        return <FileText className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Building2':
        return <Building2 className={className} />;
      case 'Scale':
        return <Scale className={className} />;
      case 'Sliders':
        return <Sliders className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Plus':
        return <Plus className={className} />;
      case 'Sparkles':
      default:
        return <Sparkles className={className} />;
    }
  };

  const selectedCard = config.cards.find((c) => c.id === selectedCardId) || config.cards[0];

  const handleStart = () => {
    onStartSession({
      cardTitle: selectedCard ? selectedCard.title : 'Sesi Baru',
      cardDescription: selectedCard ? selectedCard.description : '',
      prompt: promptText.trim() || (selectedCard ? selectedCard.description : 'Diskusi Rapat MPK SMK Negeri 13 Bandung'),
      engine: selectedEngine,
      destinationFolder: folderPath,
      activeTab: activeTabMode === 'tab1' ? config.tab1Name : config.tab2Name,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 sm:space-y-6">
      {/* Beginner Welcome & Quick Start Banner */}
      {isBeginnerMode && (
        <div className="bg-[#FFFDF5] border-[2.5px] border-black rounded-3xl p-4 sm:p-5 shadow-[5px_5px_0px_0px_#000] relative overflow-hidden space-y-3.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000] shrink-0">
                <GraduationCap className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-black tracking-tight">
                    Baru Pertama Kali Membuat Notulen?
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#38BDF8] text-black border border-black text-[10px] font-mono font-black uppercase">
                    Mode Pemula
                  </span>
                </div>
                <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                  Ikuti 3 langkah mudah di bawah atau langsung coba contoh notulen yang sudah lengkap dengan 1 klik!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleTryInstantExample}
                className="flex-1 sm:flex-none px-4 py-2 bg-[#FFE600] hover:bg-[#ffd93d] text-black border-2 border-black rounded-xl text-xs font-black shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>1-Klik Coba Contoh MPLS</span>
              </button>

              <button
                type="button"
                onClick={openBeginnerGuide}
                className="px-3.5 py-2 bg-white hover:bg-zinc-100 text-black border-2 border-black rounded-xl text-xs font-bold shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1"
                title="Buka Panduan Lengkap Notulis"
              >
                <HelpCircle className="w-3.5 h-3.5 text-zinc-800" />
                <span>Panduan</span>
              </button>
            </div>
          </div>

          {/* 3 Guided Steps Indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t-2 border-black/10">
            <div className="p-2.5 rounded-xl bg-white border border-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#38BDF8] text-black font-black text-[10px] border border-black flex items-center justify-center shrink-0">
                1
              </span>
              <p className="text-[11px] font-bold text-black leading-tight">
                Langkah 1: Pilih jenis rapat (Sidang/MPLS)
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#FF6B6B] text-black font-black text-[10px] border border-black flex items-center justify-center shrink-0">
                2
              </span>
              <p className="text-[11px] font-bold text-black leading-tight">
                Langkah 2: Tentukan materi atau klik ide cepat
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#4ECDC4] text-black font-black text-[10px] border border-black flex items-center justify-center shrink-0">
                3
              </span>
              <p className="text-[11px] font-bold text-black leading-tight">
                Langkah 3: Klik tombol kuning &quot;Mulai Sesi Rapat&quot;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar: Pill Switcher, Presets & Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border-[2.5px] border-black rounded-2xl p-3 sm:px-4 shadow-[4px_4px_0px_0px_#000]">
        {/* Hardware-style Pill Tabs */}
        <div className="inline-flex items-center bg-[#FFFDF5] p-1 rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
          <button
            onClick={() => setActiveTabMode('tab1')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all active:scale-[0.98] ${
              activeTabMode === 'tab1'
                ? 'bg-[#FFD93D] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'text-zinc-700 hover:text-black font-bold'
            }`}
          >
            {isEditMode ? (
              <input
                id="tab1-name-input"
                name="tab1-name-input"
                aria-label="Nama Tab 1"
                type="text"
                value={config.tab1Name}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  saveConfig({ ...config, tab1Name: e.target.value });
                  setActivePreset('custom');
                }}
                className="bg-transparent border-b-2 border-black text-black font-black focus:outline-none w-28 text-center"
              />
            ) : (
              config.tab1Name
            )}
          </button>

          <button
            onClick={() => setActiveTabMode('tab2')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all active:scale-[0.98] ${
              activeTabMode === 'tab2'
                ? 'bg-[#FFD93D] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'text-zinc-700 hover:text-black font-bold'
            }`}
          >
            {isEditMode ? (
              <input
                id="tab2-name-input"
                name="tab2-name-input"
                aria-label="Nama Tab 2"
                type="text"
                value={config.tab2Name}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  saveConfig({ ...config, tab2Name: e.target.value });
                  setActivePreset('custom');
                }}
                className="bg-transparent border-b-2 border-black text-black font-black focus:outline-none w-28 text-center"
              />
            ) : (
              config.tab2Name
            )}
          </button>
        </div>

        {/* Action Controls & Preset Switcher */}
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-xs font-black text-black bg-[#A7F3D0] border-2 border-black px-2 py-0.5 rounded-lg shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" /> {saveStatus}
            </span>
          )}

          {/* Preset Buttons */}
          <div className="hidden sm:flex items-center gap-1 bg-[#FFFDF5] p-1 rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] text-[11px]">
            <span className="px-2 text-black font-black text-[10px] uppercase">PRESET:</span>
            <button
              onClick={() => handleApplyPreset('mpk')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activePreset === 'mpk' ? 'bg-[#FFD93D] text-black font-black border border-black shadow-[1px_1px_0px_0px_#000]' : 'text-zinc-700 hover:text-black font-bold'
              }`}
            >
              MPK 13
            </button>
            <button
              onClick={() => handleApplyPreset('mpls')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activePreset === 'mpls' ? 'bg-[#FFD93D] text-black font-black border border-black shadow-[1px_1px_0px_0px_#000]' : 'text-zinc-700 hover:text-black font-bold'
              }`}
            >
              Panitia MPLS
            </button>
            <button
              onClick={() => handleApplyPreset('organisasi')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activePreset === 'organisasi' ? 'bg-[#FFD93D] text-black font-black border border-black shadow-[1px_1px_0px_0px_#000]' : 'text-zinc-700 hover:text-black font-bold'
              }`}
            >
              Organisasi
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetToPreset}
            title="Reset teks ke preset saat ini"
            className="p-2 text-black bg-[#FFFDF5] hover:bg-yellow-100 rounded-xl transition-all text-xs flex items-center gap-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Toggle Edit Mode */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
              isEditMode
                ? 'bg-[#FF6B6B] text-black'
                : 'bg-[#C4B5FD] hover:bg-[#b5a3fc] text-black'
            }`}
          >
            {isEditMode ? (
              <>
                <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Selesai Edit</span>
              </>
            ) : (
              <>
                <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Kustomisasi Teks</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Frame (Double-Bezel Hardware Architecture) */}
      <div className="bg-white border-[2.5px] border-black rounded-2xl p-3.5 sm:p-7 md:p-9 relative space-y-5 sm:space-y-8 shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000]">
        {/* Hero Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          {isEditMode ? (
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-black bg-[#FFD93D] border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                Mode Edit: Judul Utama
              </span>
              <input
                id="edit-header-title"
                name="edit-header-title"
                aria-label="Edit Judul Utama"
                type="text"
                value={config.headerTitle}
                onChange={(e) => {
                  saveConfig({ ...config, headerTitle: e.target.value });
                  setActivePreset('custom');
                }}
                className="w-full text-2xl sm:text-3xl font-black text-black text-center bg-white border-2 border-black rounded-xl px-4 py-2 focus:outline-none shadow-[2px_2px_0px_0px_#000]"
              />
              <textarea
                id="edit-header-subtitle"
                name="edit-header-subtitle"
                aria-label="Edit Subjudul"
                value={config.headerSubtitle}
                rows={2}
                onChange={(e) => {
                  saveConfig({ ...config, headerSubtitle: e.target.value });
                  setActivePreset('custom');
                }}
                className="w-full text-xs sm:text-sm text-zinc-800 font-medium text-center bg-white border-2 border-black rounded-xl px-4 py-1.5 focus:outline-none shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tight">
                {config.headerTitle}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed max-w-xl mx-auto">
                {config.headerSubtitle}
              </p>
            </>
          )}
        </div>

        {/* STEP 1: PICK WHAT YOU'RE MAKING */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#FFD93D] border-2 border-black text-black font-black text-xs flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
                1
              </span>
              {isEditMode ? (
                <input
                  id="edit-step1-title"
                  name="edit-step1-title"
                  aria-label="Edit Judul Langkah 1"
                  type="text"
                  value={config.step1Title}
                  onChange={(e) => {
                    saveConfig({ ...config, step1Title: e.target.value });
                    setActivePreset('custom');
                  }}
                  className="text-sm sm:text-base font-black text-black bg-white border-2 border-black rounded-lg px-2.5 py-1 focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                />
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-black text-black tracking-tight">
                    {config.step1Title}
                  </h2>
                  {isBeginnerMode && (
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-sky-200 border border-black text-black shadow-[1px_1px_0px_0px_#000]">
                      Langkah 1: Klik salah satu jenis rapat
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddNewCustomCard}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-black bg-[#A7F3D0] hover:bg-[#86efac] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                title="Tambah opsi kartu kustom baru ke daftar agenda"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Tambah Kartu Kustom</span>
              </button>

              {isEditMode && (
                <span className="text-[11px] text-black font-black bg-amber-100 border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                  Klik kartu untuk mengubah teks & deskripsi
                </span>
              )}
            </div>
          </div>

          {/* Cards Grid - Responsive Neo-Brutalist Pop-Art Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
            {config.cards.map((card, idx) => {
              const isSelected = card.id === selectedCardId;
              const cardColors = [
                { bg: 'bg-[#FEF08A]', iconBg: 'bg-[#FFD93D]' },
                { bg: 'bg-[#FECDD3]', iconBg: 'bg-[#FF6B6B]' },
                { bg: 'bg-[#A7F3D0]', iconBg: 'bg-[#4ECDC4]' },
                { bg: 'bg-[#DDD6FE]', iconBg: 'bg-[#C4B5FD]' },
                { bg: 'bg-[#BAE6FD]', iconBg: 'bg-[#38BDF8]' },
                { bg: 'bg-[#FED7AA]', iconBg: 'bg-[#FB923C]' },
              ];
              const theme = cardColors[idx % cardColors.length];

              return (
                <div
                  key={card.id}
                  onClick={() => !isEditMode && setSelectedCardId(card.id)}
                  className={`relative p-3.5 sm:p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between min-h-[125px] sm:min-h-[160px] sm:hover:-translate-x-0.5 sm:hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 touch-manipulation select-none ${
                    isSelected
                      ? `${theme.bg} border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] sm:shadow-[5px_5px_0px_0px_#000]`
                      : 'bg-[#FFFDF5] border-2 border-black/80 hover:border-black hover:bg-white shadow-[2px_2px_0px_0px_#000] sm:shadow-[2.5px_2.5px_0px_0px_#000] sm:hover:shadow-[4px_4px_0px_0px_#000]'
                  }`}
                >
                  {/* Top: Icon & Action Badges */}
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] shrink-0 ${
                          isSelected ? `${theme.iconBg} text-black` : 'bg-white text-black'
                        }`}
                      >
                        {renderIcon(card.iconName, 'w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]')}
                      </div>

                      {/* Right Top Actions: Custom Badge, Edit Button & Selection Checkmark */}
                      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-end shrink-0">
                        {(card.isCustom || card.id.includes('kustom') || card.id.includes('custom')) && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-black text-[#FFE600] px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                            Kustom
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCardId(card.id);
                            setEditingCardIndex(editingCardIndex === idx ? null : idx);
                          }}
                          title="Kustomisasi judul, rincian, dan ikon kartu ini"
                          className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded-lg border-2 border-black transition-all shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shrink-0 ${
                            editingCardIndex === idx
                              ? 'bg-[#FF6B6B] text-black'
                              : 'bg-white hover:bg-[#FFD93D] text-black'
                          }`}
                        >
                          <Sliders className="w-3 h-3 stroke-[2.5]" />
                          <span>{editingCardIndex === idx ? 'Tutup' : 'Custom'}</span>
                        </button>

                        {/* Direct Delete Button for Custom Cards */}
                        {(card.isCustom || card.id.includes('kustom') || card.id.includes('custom') || config.cards.length > 4) && config.cards.length > 2 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCard(idx);
                            }}
                            title="Hapus kartu ini"
                            aria-label={`Hapus kartu ${card.title || 'agenda'}`}
                            className="p-1 rounded-lg border-2 border-black bg-rose-100 hover:bg-rose-200 text-rose-700 hover:text-black transition-all shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        )}

                        {isSelected && (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-black text-white flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000] sm:shadow-[1.5px_1.5px_0px_0px_#000] shrink-0">
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Icon Selector in Edit Mode */}
                      {isEditMode && (
                        <select
                          id={`edit-card-icon-${idx}`}
                          name={`edit-card-icon-${idx}`}
                          aria-label={`Pilih ikon kartu ${idx + 1}`}
                          value={card.iconName}
                          onChange={(e) =>
                            handleUpdateCard(idx, 'iconName', e.target.value as CardConfig['iconName'])
                          }
                          className="bg-white border-2 border-black text-[10px] text-black font-black rounded px-1.5 py-0.5 shadow-[1px_1px_0px_0px_#000]"
                        >
                          <option value="Scale">Scale (Timbangan)</option>
                          <option value="Users">Users (Pengurus)</option>
                          <option value="FileText">FileText (Dokumen)</option>
                          <option value="Sparkles">Sparkles (Kustom)</option>
                          <option value="Globe">Globe (Web)</option>
                          <option value="Smartphone">Smartphone (App)</option>
                          <option value="Gamepad2">Gamepad (Game)</option>
                          <option value="Building2">Building (Lembaga)</option>
                          <option value="Briefcase">Briefcase (Kerja)</option>
                          <option value="Sliders">Sliders (Custom)</option>
                          <option value="Plus">Plus (Tambah)</option>
                        </select>
                      )}
                    </div>

                    {isEditMode ? (
                      <div className="space-y-1.5 pt-1">
                        <input
                          id={`edit-card-title-${idx}`}
                          name={`edit-card-title-${idx}`}
                          aria-label={`Judul kartu ${idx + 1}`}
                          type="text"
                          value={card.title}
                          onChange={(e) => handleUpdateCard(idx, 'title', e.target.value)}
                          placeholder="Judul Kartu"
                          className="w-full text-xs font-black text-black bg-white border-2 border-black rounded px-2 py-1 focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                        />
                        <textarea
                          id={`edit-card-desc-${idx}`}
                          name={`edit-card-desc-${idx}`}
                          aria-label={`Deskripsi kartu ${idx + 1}`}
                          value={card.description}
                          rows={2}
                          onChange={(e) => handleUpdateCard(idx, 'description', e.target.value)}
                          placeholder="Deskripsi singkat"
                          className="w-full text-[11px] text-zinc-800 font-medium bg-white border-2 border-black rounded px-2 py-1 focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-black tracking-tight">{card.title}</h3>
                        <p className="text-[11px] sm:text-xs text-zinc-800 font-medium mt-1 leading-snug line-clamp-2">
                          {card.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Dedicated "+ Tambah Opsi Custom" Card */}
            <button
              type="button"
              onClick={handleAddNewCustomCard}
              className="p-3.5 sm:p-5 rounded-2xl border-2 border-dashed border-black/80 hover:border-black bg-[#FFFDF5] hover:bg-[#FEF08A]/40 text-black flex flex-col justify-between min-h-[125px] sm:min-h-[160px] shadow-[2px_2px_0px_0px_#000] sm:shadow-[2.5px_2.5px_0px_0px_#000] transition-all sm:hover:-translate-x-0.5 sm:hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 group cursor-pointer text-left touch-manipulation"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white group-hover:bg-[#FFD93D] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] transition-colors shrink-0">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] text-black" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#FFD93D] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                  + Baru
                </span>
              </div>
              <div className="mt-2 sm:mt-3">
                <h3 className="text-xs sm:text-sm font-black text-black tracking-tight">+ Opsi Custom Card</h3>
                <p className="text-[11px] sm:text-xs text-zinc-700 font-medium mt-0.5 sm:mt-1 leading-snug">
                  Buat format agenda baru sesuai kebutuhan musyawarah Anda
                </p>
              </div>
            </button>
          </div>

          {/* Card Inline Customization Panel (Hardware Drawer) */}
          {editingCardIndex !== null && config.cards[editingCardIndex] && (
            <div className="bg-[#FFFDF5] border-[2.5px] border-black rounded-2xl p-3.5 sm:p-5 shadow-[4px_4px_0px_0px_#000] sm:shadow-[5px_5px_0px_0px_#000] space-y-3.5 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b-2 border-black/15 pb-3">
                <div className="flex items-start sm:items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#FFD93D] border-2 border-black flex items-center justify-center font-black text-xs shadow-[1.5px_1.5px_0px_0px_#000] shrink-0 mt-0.5 sm:mt-0">
                    <Sliders className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-black flex items-center gap-1.5 flex-wrap">
                      <span>Opsi Custom Kartu:</span>
                      <span className="bg-[#FEF08A] px-2 py-0.5 rounded-lg border border-black shadow-[1px_1px_0px_0px_#000] truncate max-w-[220px]">
                        {config.cards[editingCardIndex].title || 'Tanpa Judul'}
                      </span>
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-zinc-600 font-medium">
                      Sesuaikan judul agenda, uraian pokok materi sidang, dan ikon kartu ini.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {config.cards.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(editingCardIndex)}
                      className="text-xs font-black text-rose-700 hover:text-black bg-rose-100 hover:bg-rose-200 border-2 border-black px-2.5 sm:px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                      title="Hapus kartu ini dari daftar agenda"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Hapus</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setEditingCardIndex(null)}
                    className="text-xs font-black text-black bg-[#A7F3D0] hover:bg-emerald-300 border-2 border-black px-3.5 sm:px-4 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Selesai</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
                {/* Input Judul Kartu */}
                <div className="space-y-1.5 md:col-span-1">
                  <label
                    htmlFor="custom-card-title-input"
                    className="text-[11px] font-black text-black uppercase tracking-wider flex items-center gap-1"
                  >
                    Judul Agenda Musyawarah:
                  </label>
                  <input
                    id="custom-card-title-input"
                    name="custom-card-title-input"
                    type="text"
                    value={config.cards[editingCardIndex].title}
                    onChange={(e) => handleUpdateCard(editingCardIndex, 'title', e.target.value)}
                    placeholder="Contoh: Rapat Pleno Bantara Pramuka"
                    className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-black text-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>

                {/* Input Deskripsi Kartu */}
                <div className="space-y-1.5 md:col-span-2">
                  <label
                    htmlFor="custom-card-desc-input"
                    className="text-[11px] font-black text-black uppercase tracking-wider flex items-center gap-1"
                  >
                    Uraian / Deskripsi Pokok Bahasan:
                  </label>
                  <input
                    id="custom-card-desc-input"
                    name="custom-card-desc-input"
                    type="text"
                    value={config.cards[editingCardIndex].description}
                    onChange={(e) => handleUpdateCard(editingCardIndex, 'description', e.target.value)}
                    placeholder="Contoh: Evaluasi kesiapan seksi perlengkapan, konsumsi, dan tata tertib"
                    className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-medium text-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>
              </div>

              {/* Pilihan Ikon */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-black text-black uppercase tracking-wider block">
                  Pilih Ikon Kartu:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {[
                    { name: 'Sliders', label: 'Custom / Opsi' },
                    { name: 'Sparkles', label: 'Aspirasi / Kustom' },
                    { name: 'Scale', label: 'Timbangan / Sidang' },
                    { name: 'Building2', label: 'Lembaga / MUBES' },
                    { name: 'Briefcase', label: 'Koordinasi / Kerja' },
                    { name: 'Users', label: 'Pengurus / Panitia' },
                    { name: 'FileText', label: 'Dokumen / Risalah' },
                    { name: 'Globe', label: 'Publikasi / Umum' },
                    { name: 'Smartphone', label: 'Media / Aplikasi' },
                    { name: 'Gamepad2', label: 'Simulasi / Game' },
                  ].map((ico) => {
                    const isCurrent = config.cards[editingCardIndex].iconName === ico.name;
                    return (
                      <button
                        key={ico.name}
                        type="button"
                        onClick={() => handleUpdateCard(editingCardIndex, 'iconName', ico.name as CardConfig['iconName'])}
                        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border-2 border-black text-[11px] sm:text-xs font-black transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer touch-manipulation ${
                          isCurrent
                            ? 'bg-[#FFD93D] text-black shadow-[2px_2px_0px_0px_#000]'
                            : 'bg-white hover:bg-[#FEF08A] text-zinc-800 shadow-[1.5px_1.5px_0px_0px_#000]'
                        }`}
                      >
                        {renderIcon(ico.name as CardConfig['iconName'], 'w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]')}
                        <span>{ico.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STEP 2: SAY WHAT YOU WANT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#FFD93D] border-2 border-black text-black font-black text-xs flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
                2
              </span>
              {isEditMode ? (
                <input
                  id="edit-step2-title"
                  name="edit-step2-title"
                  aria-label="Edit Judul Langkah 2"
                  type="text"
                  value={config.step2Title}
                  onChange={(e) => {
                    saveConfig({ ...config, step2Title: e.target.value });
                    setActivePreset('custom');
                  }}
                  className="text-sm sm:text-base font-black text-black bg-white border-2 border-black rounded-lg px-2.5 py-1 focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                />
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-black text-black tracking-tight">
                    {config.step2Title}
                  </h2>
                  {isBeginnerMode && (
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-rose-200 border border-black text-black shadow-[1px_1px_0px_0px_#000]">
                      Langkah 2: Tentukan materi rapat
                    </span>
                  )}
                </div>
              )}
            </div>

            <span className="text-[11px] text-black font-black bg-[#FFFDF5] border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
              {promptText.length} karakter
            </span>
          </div>

          {/* Textarea Box */}
          <div className="space-y-3">
            <div className="rounded-2xl bg-[#FFFDF5] border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] transition-all p-4 space-y-3">
              {isEditMode && (
                <div className="mb-2 pb-2 border-b-2 border-black/10 flex items-center justify-between">
                  <span className="text-[10px] text-black font-black uppercase">Edit Teks Placeholder:</span>
                  <input
                    id="edit-prompt-placeholder"
                    name="edit-prompt-placeholder"
                    aria-label="Edit Teks Placeholder"
                    type="text"
                    value={config.promptPlaceholder}
                    onChange={(e) => {
                      saveConfig({ ...config, promptPlaceholder: e.target.value });
                      setActivePreset('custom');
                    }}
                    className="w-3/4 text-xs bg-white border-2 border-black text-black font-medium rounded px-2 py-1 shadow-[1px_1px_0px_0px_#000]"
                  />
                </div>
              )}

              <label htmlFor="craft-studio-prompt" className="sr-only">
                Teks agenda atau uraian musyawarah sidang
              </label>
              <textarea
                id="craft-studio-prompt"
                name="craft-studio-prompt"
                aria-label="Teks agenda atau uraian musyawarah sidang"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={config.promptPlaceholder}
                rows={4}
                className="w-full bg-white border-2 border-black rounded-xl p-3 text-sm text-black placeholder:text-zinc-500 font-medium focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000] resize-none leading-relaxed"
              />

              {/* Bottom indicator inside textarea */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t-2 border-black/10 text-[11px] text-zinc-700">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <span className="flex items-center gap-1.5 font-black text-[10px]">
                    <Sliders className="w-3.5 h-3.5 text-black stroke-[2.5] shrink-0" />
                    Format terpilih:{' '}
                    <strong className="text-black bg-[#FFD93D] border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000] truncate max-w-[170px] sm:max-w-none inline-block">
                      {selectedCard ? selectedCard.title : ''}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const idx = config.cards.findIndex((c) => c.id === selectedCardId);
                      if (idx !== -1) setEditingCardIndex(idx);
                    }}
                    className="font-black text-[10px] text-black bg-[#FEF08A] hover:bg-[#FFD93D] border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000] flex items-center gap-1 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 shrink-0"
                    title="Kustomisasi kartu format terpilih ini"
                  >
                    <Pencil className="w-3 h-3 stroke-[2.5]" /> Opsi Custom Card
                  </button>
                </div>
                <span className="hidden sm:inline font-bold text-[10px] text-zinc-700">
                  Standar Risalah MPK SMK Negeri 13 Bandung
                </span>
              </div>
            </div>

            {/* Ideas to get you started (Idea Pills) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-black">
                  {isEditMode ? 'Kustomisasi Inspirasi Ide (Pills):' : 'Inspirasi agenda cepat:'}
                </span>

                {isEditMode && (
                  <button
                    onClick={() => setShowAddPill(true)}
                    className="flex items-center gap-1 text-xs text-black font-black bg-[#A7F3D0] border-2 border-black px-2 py-0.5 rounded-lg shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-emerald-300"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Tambah Ide
                  </button>
                )}
              </div>

              {/* Add pill form */}
              {showAddPill && isEditMode && (
                <div className="flex items-center gap-2 bg-white border-2 border-black p-2 rounded-xl shadow-[3px_3px_0px_0px_#000]">
                  <input
                    id="new-pill-input"
                    name="new-pill-input"
                    aria-label="Tulis ide agenda baru"
                    type="text"
                    value={newPillInput}
                    onChange={(e) => setNewPillInput(e.target.value)}
                    placeholder="Tulis ide agenda baru..."
                    className="flex-1 bg-transparent text-xs text-black font-bold focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPill()}
                  />
                  <button
                    onClick={handleAddPill}
                    className="px-3 py-1 bg-[#FFD93D] text-black text-xs font-black rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setShowAddPill(false)}
                    className="px-2 py-1 text-black font-bold text-xs"
                  >
                    Batal
                  </button>
                </div>
              )}

              {/* Pill list */}
              <div className="flex flex-wrap gap-2">
                {config.ideaPills.map((pill, idx) => (
                  <div
                    key={idx}
                    className={`inline-flex items-center gap-1.5 rounded-xl border-2 border-black text-xs transition-all active:scale-[0.98] ${
                      isEditMode
                        ? 'bg-white px-2 py-1 shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-[#FFFDF5] hover:bg-yellow-100 text-black font-bold px-3 py-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] sm:hover:-translate-x-0.5 sm:hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 touch-manipulation'
                    }`}
                    onClick={() => {
                      if (!isEditMode) {
                        setPromptText((prev) => (prev ? `${prev}\n- ${pill}` : pill));
                      }
                    }}
                  >
                    {isEditMode ? (
                      <>
                        <input
                          id={`edit-pill-${idx}`}
                          name={`edit-pill-${idx}`}
                          aria-label={`Edit Inspirasi Ide ${idx + 1}`}
                          type="text"
                          value={pill}
                          onChange={(e) => handleUpdatePill(idx, e.target.value)}
                          className="bg-transparent text-xs text-black font-bold focus:outline-none w-48"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePill(idx);
                          }}
                          className="text-rose-600 hover:text-rose-800 p-0.5 rounded"
                          aria-label={`Hapus Inspirasi Ide ${idx + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{pill}</span>
                        <ArrowRight className="w-3 h-3 text-black stroke-[2.5]" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Built by, Saved in, and Start button */}
        <div className="pt-4 sm:pt-5 border-t-2 border-black/15 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4 text-xs w-full md:w-auto">
            {/* Standar Naskah Dinas Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              <label htmlFor="craft-standard-engine" className="text-black font-black text-xs flex items-center gap-1 shrink-0">
                <FileText className="w-4 h-4 text-black stroke-[2.5]" /> Standar Naskah:
              </label>
              <select
                id="craft-standard-engine"
                name="craft-standard-engine"
                aria-label="Pilih Standar Tata Naskah Dinas"
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
                className="w-full sm:w-auto max-w-full bg-white border-2 border-black text-black rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none cursor-pointer"
              >
                <option value="Tata Naskah Dinas MPK 13 (Standar Utama)">Tata Naskah Dinas MPK 13 (Standar Utama)</option>
                <option value="Pembentukan Panitia MPLS & Pokja">Pembentukan Panitia MPLS &amp; Pokja</option>
                <option value="Risalah Padat & Ketetapan Inti">Risalah Padat &amp; Ketetapan Inti</option>
                <option value="Fokus Pengesahan Anggaran Kas">Fokus Pengesahan Anggaran Kas</option>
                <option value="Format Evaluasi & Rekomendasi">Format Evaluasi &amp; Rekomendasi</option>
              </select>
            </div>
          </div>

          {/* Start Action Button (Neo-Brutalist Hard Shadow & Mechanical Press) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {isBeginnerMode && (
              <span className="hidden sm:inline-block text-[10px] font-mono font-black px-2.5 py-1.5 rounded-xl bg-emerald-200 border-2 border-black text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                Langkah 3: Lanjutkan
              </span>
            )}
            <button
              onClick={handleStart}
              className="group flex items-center justify-center gap-3 px-6 py-3 bg-[#FFE600] hover:bg-[#ffd93d] text-black font-black text-xs sm:text-sm rounded-xl border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] sm:hover:-translate-x-0.5 sm:hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all self-stretch md:self-auto cursor-pointer touch-manipulation"
            >
              <span>Mulai Sesi Rapat</span>
              <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
