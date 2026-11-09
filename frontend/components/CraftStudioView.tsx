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
  ChevronDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMeetings } from '../context/MeetingContext';
import { OFFICIAL_MEETING_TEMPLATES } from '../lib/meetingTemplates';

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
  headerTitle: 'Format Musyawarah & Risalah Sidang MPK 13',
  headerSubtitle: 'Pilih format persidangan resmi, susun konsiderans hukum atau usulan komisi, dan rumuskan risalah berstandar AD/ART MPK Nawadasha Bhakti Amita Paramartha.',
  step1Title: 'Pilih format persidangan majelis',
  step2Title: 'Uraikan pokok bahasan & materi usulan',
  promptPlaceholder: 'Tuliskan pokok agenda sidang MPK SMK Negeri 13 Bandung, draf pasal ketetapan TAP, materi dakwaan sidang peradilan, atau rekomendasi komisi...',
  cards: [
    {
      id: 'mubes-ad-art',
      iconName: 'Building2',
      title: 'Musyawarah Besar (MUBES)',
      description: 'Pengesahan Anggaran Dasar, ART, dan Garis Besar Program Kerja MPK NBAP 2025/2026',
    },
    {
      id: 'sidang-gbhk',
      iconName: 'FileText',
      title: 'Sidang GBHK (MPK - OSIS)',
      description: 'Pengesahan matriks program kerja tahunan OSIS, batas waktu SPJ, dan pagu kas',
    },
    {
      id: 'pleno-pengawasan-osis',
      iconName: 'Scale',
      title: 'Sidang Pleno Pengawasan OSIS',
      description: 'Evaluasi program kerja Sekbid OSIS (Komisi A), kepatuhan SPJ, dan rekomendasi berkala',
    },
    {
      id: 'delegasi-ekskul',
      iconName: 'Users',
      title: 'Rapat Delegasi Ekstrakurikuler',
      description: 'Penataan jadwal lapangan (Planner), absensi triwulan (Informator), dan sarana ekskul',
    },
    {
      id: 'sidang-peradilan',
      iconName: 'Shield',
      title: 'Sidang Istimewa Peradilan',
      description: 'Kekuasaan kehakiman, Hakim Agung, JPU, penegakan sanksi dan amar putusan peradilan',
    },
    {
      id: 'panitia-mpls',
      iconName: 'Trophy',
      title: 'Pembentukan Panitia MPLS',
      description: 'Struktur panitia masa orientasi, pembagian 6 divisi operasional, RAB, & rundown ramah anak',
    },
  ],
  ideaPills: [
    'Pengesahan Anggaran Dasar & Rumah Tangga (AD/ART) MPK NBAP',
    'Sidang Pleno I Pengawasan Realisasi Program Kerja OSIS (Komisi A)',
    'Sinkronisasi Matriks Jadwal Lapangan 23 Ekstrakurikuler (Komisi B)',
    'Sidang Istimewa Peradilan Penegakan Disiplin Organisasi (Mahkamah MPK)',
    'Program AKSARA & Kotak Saran IT Aspirasi Siswa (Komisi C)',
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
  const { openBeginnerGuide, isBeginnerMode, handleCreateMplsMeeting, handleCreateTemplateMeeting } = useMeetings();
  const [config, setConfig] = useState<CraftStudioConfig>(PRESET_MPK);
  const [activePreset, setActivePreset] = useState<'mpk' | 'mpls' | 'organisasi' | 'custom'>('mpk');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleLaunchOfficialTemplate = (templateId: string) => {
    handleCreateTemplateMeeting(templateId);
    router.push('/notulen');
  };

  const handleTryInstantExample = () => {
    handleLaunchOfficialTemplate('panitia-mpls');
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
    const matchedTemplate = OFFICIAL_MEETING_TEMPLATES.find((t) => t.id === selectedCardId);
    if (matchedTemplate && !promptText.trim()) {
      handleLaunchOfficialTemplate(matchedTemplate.id);
      return;
    }
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
    <div className="w-full max-w-6xl mx-auto space-y-8 sm:space-y-10">
      {/* Editorial Minimalist Hero Header */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFE600] text-black border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                MPK SMK NEGERI 13 BANDUNG
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                AD/ART Nawadasha Bhakti Amita Paramartha
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tight">
              {config.headerTitle}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 font-medium max-w-2xl leading-relaxed">
              {config.headerSubtitle}
            </p>
          </div>

          {/* Quick Helper Actions */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            <button
              type="button"
              onClick={handleTryInstantExample}
              className="px-3.5 py-2 bg-[#FFE600] hover:bg-[#ffd93d] text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
              title="Langsung coba contoh risalah rapat panitia MPLS yang sudah lengkap"
            >
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Contoh Cepat MPLS</span>
            </button>

            <button
              type="button"
              onClick={openBeginnerGuide}
              className="px-3.5 py-2 bg-white hover:bg-zinc-100 text-black border-2 border-black rounded-xl text-xs font-bold shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
              title="Buka panduan alur kerja notulis dan tata cara persidangan"
            >
              <HelpCircle className="w-3.5 h-3.5 text-zinc-800" />
              <span>Panduan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Frame (Generous Whitespace, Minimalist Bento) */}
      <div className="bg-white border-2 border-black rounded-3xl p-5 sm:p-8 lg:p-10 space-y-8 shadow-[5px_5px_0px_0px_#000]">
        {/* Step 1: Forum Musyawarah Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-[#FFE600] border border-black text-black font-black text-xs flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
                1
              </span>
              <h2 className="text-sm sm:text-base font-black text-black tracking-tight">
                {config.step1Title}
              </h2>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Pilih forum resmi atau format kustom
            </span>
          </div>

          {/* Bento Grid: Clean, Spacious, Calm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {config.cards.map((card) => {
              const isSelected = card.id === selectedCardId;
              const matchedTemplate = OFFICIAL_MEETING_TEMPLATES.find((t) => t.id === card.id);

              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`group relative p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between min-h-[140px] select-none ${
                    isSelected
                      ? 'bg-[#FFFDF5] border-2 border-black shadow-[4px_4px_0px_0px_#000] ring-1 ring-black'
                      : 'bg-white border-2 border-black/20 hover:border-black hover:bg-[#FFFDF5] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,0.06)] hover:shadow-[3px_3px_0px_0px_#000]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-black shrink-0 transition-colors ${
                          isSelected ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-[#FFFDF5] text-zinc-800'
                        }`}
                      >
                        {renderIcon(card.iconName, 'w-5 h-5 stroke-[2.2]')}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {matchedTemplate && (
                          <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-black/20">
                            {matchedTemplate.badge}
                          </span>
                        )}
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-black tracking-tight leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-xs text-zinc-600 font-medium leading-relaxed line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {matchedTemplate && (
                    <div className="pt-3 mt-2 border-t border-black/10 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 font-medium">Format Resmi</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchOfficialTemplate(matchedTemplate.id);
                        }}
                        className="font-bold text-black hover:underline flex items-center gap-1 group-hover:text-amber-700 cursor-pointer"
                        title="Buka langsung risalah resmi lengkap dengan 1 klik"
                      >
                        <span>Pakai Template</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Custom Card Button */}
            <button
              type="button"
              onClick={handleAddNewCustomCard}
              className="p-5 rounded-2xl border-2 border-dashed border-black/40 hover:border-black bg-[#FFFDF5] hover:bg-yellow-50/50 text-black flex flex-col justify-between min-h-[140px] transition-all cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
                <Plus className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-500">
                  + FORMAT AD-HOC
                </span>
                <h3 className="text-sm font-black text-black">Tambah Format Baru</h3>
                <p className="text-xs text-zinc-500 leading-normal">
                  Buat sesi rapat koordinasi atau kepanitiaan mandiri
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Pokok Bahasan & Materi Rapat */}
        <div className="space-y-4 pt-4 border-t-2 border-black/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-[#FFE600] border border-black text-black font-black text-xs flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]">
                2
              </span>
              <h2 className="text-sm sm:text-base font-black text-black tracking-tight">
                {config.step2Title}
              </h2>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              {promptText.length} karakter
            </span>
          </div>

          <div className="space-y-3">
            <textarea
              id="craft-studio-prompt"
              name="craft-studio-prompt"
              aria-label="Teks agenda atau uraian musyawarah sidang"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={config.promptPlaceholder}
              rows={4}
              className="w-full bg-[#FFFDF5] border-2 border-black rounded-2xl p-4 text-xs sm:text-sm text-black placeholder:text-zinc-400 font-medium focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000] resize-none leading-relaxed"
            />

            {/* Idea Pills: Clean, Simple, Direct */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-zinc-500 block">
                Inspirasi Agenda &amp; Materi Cepat:
              </span>
              <div className="flex flex-wrap gap-2">
                {config.ideaPills.map((pill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPromptText((prev) => (prev ? `${prev}\n- ${pill}` : pill));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFE600] text-black border border-black text-xs font-bold transition-all shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  >
                    <span>+ {pill}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="pt-4 border-t-2 border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="craft-standard-engine" className="text-xs font-black text-black shrink-0">
              Standar Naskah:
            </label>
            <select
              id="craft-standard-engine"
              name="craft-standard-engine"
              aria-label="Pilih Standar Tata Naskah Dinas"
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="bg-white border-2 border-black text-black rounded-xl px-3 py-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none cursor-pointer"
            >
              <option value="Tata Naskah Dinas MPK 13 (Standar Utama)">Tata Naskah Dinas MPK 13 (Standar Utama)</option>
              <option value="Pembentukan Panitia MPLS & Pokja">Pembentukan Panitia MPLS &amp; Pokja</option>
              <option value="Risalah Padat & Ketetapan Inti">Risalah Padat &amp; Ketetapan Inti</option>
              <option value="Fokus Pengesahan Anggaran Kas">Fokus Pengesahan Anggaran Kas</option>
              <option value="Format Evaluasi & Rekomendasi">Format Evaluasi &amp; Rekomendasi</option>
            </select>
          </div>

          <button
            onClick={handleStart}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-[#FFE600] hover:bg-[#ffd93d] text-black font-black text-xs sm:text-sm rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Mulai Sesi Rapat</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Collapsible Advanced Settings (Non-intrusive) */}
      <div className="border border-black/20 rounded-2xl bg-white p-4 space-y-3">
        <button
          type="button"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 hover:text-black cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Pengaturan Lanjutan (Preset, Kustomisasi Judul &amp; Kartu)</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`} />
        </button>

        {showAdvancedSettings && (
          <div className="pt-3 border-t border-black/10 space-y-4 animate-in fade-in">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-zinc-500 uppercase">Preset:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset('mpk')}
                className={`px-3 py-1 rounded-lg border border-black cursor-pointer ${
                  activePreset === 'mpk' ? 'bg-[#FFE600] font-black' : 'bg-white'
                }`}
              >
                MPK 13
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('mpls')}
                className={`px-3 py-1 rounded-lg border border-black cursor-pointer ${
                  activePreset === 'mpls' ? 'bg-[#FFE600] font-black' : 'bg-white'
                }`}
              >
                Panitia MPLS
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('organisasi')}
                className={`px-3 py-1 rounded-lg border border-black cursor-pointer ${
                  activePreset === 'organisasi' ? 'bg-[#FFE600] font-black' : 'bg-white'
                }`}
              >
                Organisasi
              </button>
              <button
                type="button"
                onClick={handleResetToPreset}
                className="px-2.5 py-1 rounded-lg border border-black/30 hover:border-black text-zinc-600 flex items-center gap-1 ml-auto cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Default</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
