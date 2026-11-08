'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState } from 'react';
import {
  Globe,
  Smartphone,
  Gamepad2,
  Sparkles,
  Check,
  Folder,
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
} from 'lucide-react';

export interface CardConfig {
  id: string;
  iconName: 'Globe' | 'Smartphone' | 'Gamepad2' | 'Sparkles' | 'FileText' | 'Users' | 'Briefcase' | 'Building2' | 'Scale';
  title: string;
  description: string;
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
      iconName: 'Sparkles',
      title: 'Sesi Bebas / Kustom',
      description: 'Format terbuka untuk koordinasi darurat atau brainstorming santai',
    },
  ],
  ideaPills: [
    'Evaluasi LPJ Porseni Semester Genap',
    'Perencanaan Anggaran Dana LDKS 2026',
    'Struktur Kepengurusan MPK Periode 2026/2027',
    'Penyusunan Aspirasi Siswa Terkait Fasilitas Sekolah',
  ],
};

export const PRESET_CRAFT_CLASSIC: CraftStudioConfig = {
  tab1Name: 'Make my own version',
  tab2Name: 'Just look inside',
  headerTitle: "Let's bring an idea to life",
  headerSubtitle: 'Pick a starting point, describe what you want, and let the agent do the heavy lifting.',
  step1Title: "Pick what you're making",
  step2Title: 'Say what you want',
  promptPlaceholder: 'Describe what you want to build. You can also drag and drop images or documents here...',
  cards: [
    {
      id: 'website',
      iconName: 'Globe',
      title: 'A website',
      description: 'Landing page, web app, or frontend',
    },
    {
      id: 'app',
      iconName: 'Smartphone',
      title: 'An app',
      description: 'Mobile, desktop, or CLI tool',
    },
    {
      id: 'game',
      iconName: 'Gamepad2',
      title: 'A game',
      description: '2D, 3D, physics, or simulation',
    },
    {
      id: 'fresh',
      iconName: 'Sparkles',
      title: 'Nothing — start fresh',
      description: 'Blank slate, anything goes',
    },
  ],
  ideaPills: [
    'A personal portfolio with dark mode and project gallery',
    'A real-time collaborative whiteboard with sync engine',
    'A physics puzzle mini-game built with Canvas API',
    'A cross-platform task manager with local storage',
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
  // Config state with lazy initializers from localStorage
  const [config, setConfig] = useState<CraftStudioConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Could not load custom craft config from localStorage', e);
      }
    }
    return PRESET_MPK;
  });

  const [activePreset, setActivePreset] = useState<'mpk' | 'craft' | 'organisasi' | 'custom'>('mpk');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Interactive selection states
  const [activeTabMode, setActiveTabMode] = useState<'tab1' | 'tab2'>('tab1');
  const [selectedCardId, setSelectedCardId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.cards && parsed.cards.length > 0) {
            return parsed.cards[0].id;
          }
        }
      } catch (e) {
        console.warn('Could not parse cards from localStorage', e);
      }
    }
    return 'pleno';
  });

  const [promptText, setPromptText] = useState<string>('');
  const [selectedEngine, setSelectedEngine] = useState<string>('9Router (ag/gemini-3.8-flash)');
  const [folderPath, setFolderPath] = useState<string>('/home/suzirz/Documents/Project/NotulenJMM/notulen');
  const [newPillInput, setNewPillInput] = useState<string>('');
  const [showAddPill, setShowAddPill] = useState<boolean>(false);

  // Save to localStorage
  const saveConfig = (newConfig: CraftStudioConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
      setSaveStatus('Tersimpan');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  const handleApplyPreset = (presetKey: 'mpk' | 'craft' | 'organisasi') => {
    let target = PRESET_MPK;
    if (presetKey === 'craft') target = PRESET_CRAFT_CLASSIC;
    if (presetKey === 'organisasi') target = PRESET_ORGANISASI;

    setActivePreset(presetKey);
    setSelectedCardId(target.cards[0].id);
    saveConfig(target);
  };

  const handleResetToPreset = () => {
    handleApplyPreset(activePreset === 'custom' ? 'mpk' : activePreset);
  };

  // Card update handler
  const handleUpdateCard = (index: number, field: 'title' | 'description' | 'iconName', value: string) => {
    const updatedCards = [...config.cards];
    updatedCards[index] = {
      ...updatedCards[index],
      [field]: value,
    };
    saveConfig({ ...config, cards: updatedCards });
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
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Bar: Pill Switcher, Presets & Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0e1017]/90 border border-white/[0.08] rounded-2xl p-3 sm:px-4 shadow-xl">
        {/* Hardware-style Pill Tabs */}
        <div className="inline-flex items-center bg-black/40 p-1 rounded-xl border border-white/[0.05]">
          <button
            onClick={() => setActiveTabMode('tab1')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] ${
              activeTabMode === 'tab1'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isEditMode ? (
              <input
                type="text"
                value={config.tab1Name}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  saveConfig({ ...config, tab1Name: e.target.value });
                  setActivePreset('custom');
                }}
                className="bg-transparent border-b border-sky-400 text-white focus:outline-none w-28 text-center"
              />
            ) : (
              config.tab1Name
            )}
          </button>

          <button
            onClick={() => setActiveTabMode('tab2')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] ${
              activeTabMode === 'tab2'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isEditMode ? (
              <input
                type="text"
                value={config.tab2Name}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  saveConfig({ ...config, tab2Name: e.target.value });
                  setActivePreset('custom');
                }}
                className="bg-transparent border-b border-sky-400 text-white focus:outline-none w-28 text-center"
              />
            ) : (
              config.tab2Name
            )}
          </button>
        </div>

        {/* Action Controls & Preset Switcher */}
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> {saveStatus}
            </span>
          )}

          {/* Preset Buttons */}
          <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.05] text-[11px]">
            <span className="px-2 text-zinc-500 font-mono text-[10px]">PRESET:</span>
            <button
              onClick={() => handleApplyPreset('mpk')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activePreset === 'mpk' ? 'bg-zinc-800 text-white font-semibold border border-white/10' : 'text-zinc-400 hover:text-white'
              }`}
            >
              MPK 13
            </button>
            <button
              onClick={() => handleApplyPreset('craft')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activePreset === 'craft' ? 'bg-zinc-800 text-white font-semibold border border-white/10' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Craft Classic
            </button>
            <button
              onClick={() => handleApplyPreset('organisasi')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activePreset === 'organisasi' ? 'bg-zinc-800 text-white font-semibold border border-white/10' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Organisasi
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetToPreset}
            title="Reset teks ke preset saat ini"
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-all text-xs flex items-center gap-1 border border-white/[0.06]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Toggle Edit Mode */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isEditMode
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-white/[0.08]'
            }`}
          >
            {isEditMode ? (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Selesai Edit</span>
              </>
            ) : (
              <>
                <Pencil className="w-3.5 h-3.5 text-amber-400" />
                <span>Kustomisasi Teks</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Frame (Double-Bezel Hardware Architecture) */}
      <div className="bg-[#111319] border border-white/[0.08] rounded-3xl p-6 sm:p-9 shadow-2xl relative space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          {isEditMode ? (
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Mode Edit: Judul Utama
              </span>
              <input
                type="text"
                value={config.headerTitle}
                onChange={(e) => {
                  saveConfig({ ...config, headerTitle: e.target.value });
                  setActivePreset('custom');
                }}
                className="w-full text-2xl sm:text-3xl font-bold text-white text-center bg-black/60 border border-amber-500/40 rounded-xl px-4 py-2 focus:outline-none"
              />
              <textarea
                value={config.headerSubtitle}
                rows={2}
                onChange={(e) => {
                  saveConfig({ ...config, headerSubtitle: e.target.value });
                  setActivePreset('custom');
                }}
                className="w-full text-xs sm:text-sm text-zinc-300 text-center bg-black/60 border border-amber-500/40 rounded-xl px-4 py-1.5 focus:outline-none"
              />
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {config.headerTitle}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl mx-auto">
                {config.headerSubtitle}
              </p>
            </>
          )}
        </div>

        {/* STEP 1: PICK WHAT YOU'RE MAKING */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-zinc-800 border border-white/10 text-white font-mono font-bold text-xs flex items-center justify-center">
                1
              </span>
              {isEditMode ? (
                <input
                  type="text"
                  value={config.step1Title}
                  onChange={(e) => {
                    saveConfig({ ...config, step1Title: e.target.value });
                    setActivePreset('custom');
                  }}
                  className="text-sm sm:text-base font-semibold text-white bg-black/50 border border-amber-500/40 rounded-lg px-2.5 py-1 focus:outline-none"
                />
              ) : (
                <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                  {config.step1Title}
                </h2>
              )}
            </div>

            {isEditMode && (
              <span className="text-[11px] text-amber-400/90 font-mono">
                Klik kartu untuk mengubah teks & deskripsi
              </span>
            )}
          </div>

          {/* 4 Cards Grid - Refined Tactile Double Bezel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {config.cards.map((card, idx) => {
              const isSelected = card.id === selectedCardId;
              return (
                <div
                  key={card.id}
                  onClick={() => !isEditMode && setSelectedCardId(card.id)}
                  className={`relative p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between min-h-[148px] active:scale-[0.99] ${
                    isSelected
                      ? 'bg-[#161822] border border-sky-500/80 shadow-[0_4px_20px_-4px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/30'
                      : 'bg-[#13151d] border border-white/[0.06] hover:border-white/15 hover:bg-[#171924]'
                  }`}
                >
                  {/* Selected Checkmark Badge */}
                  {isSelected && (
                    <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-md bg-sky-500 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}

                  {/* Top: Icon & Editable Content */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                            : 'bg-zinc-900 text-zinc-400 border border-white/[0.06]'
                        }`}
                      >
                        {renderIcon(card.iconName, 'w-5 h-5')}
                      </div>

                      {/* Icon Selector in Edit Mode */}
                      {isEditMode && (
                        <select
                          value={card.iconName}
                          onChange={(e) =>
                            handleUpdateCard(idx, 'iconName', e.target.value as CardConfig['iconName'])
                          }
                          className="bg-black/80 border border-white/15 text-[10px] text-zinc-300 rounded px-1.5 py-0.5"
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
                        </select>
                      )}
                    </div>

                    {isEditMode ? (
                      <div className="space-y-1.5 pt-1">
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => handleUpdateCard(idx, 'title', e.target.value)}
                          placeholder="Judul Kartu"
                          className="w-full text-xs font-semibold text-white bg-black/60 border border-amber-500/40 rounded px-2 py-1 focus:outline-none"
                        />
                        <textarea
                          value={card.description}
                          rows={2}
                          onChange={(e) => handleUpdateCard(idx, 'description', e.target.value)}
                          placeholder="Deskripsi singkat"
                          className="w-full text-[11px] text-zinc-300 bg-black/60 border border-amber-500/40 rounded px-2 py-1 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm font-semibold text-white tracking-tight">{card.title}</h3>
                        <p className="text-xs text-zinc-400 mt-1 leading-snug line-clamp-2">
                          {card.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2: SAY WHAT YOU WANT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-zinc-800 border border-white/10 text-white font-mono font-bold text-xs flex items-center justify-center">
                2
              </span>
              {isEditMode ? (
                <input
                  type="text"
                  value={config.step2Title}
                  onChange={(e) => {
                    saveConfig({ ...config, step2Title: e.target.value });
                    setActivePreset('custom');
                  }}
                  className="text-sm sm:text-base font-semibold text-white bg-black/50 border border-amber-500/40 rounded-lg px-2.5 py-1 focus:outline-none"
                />
              ) : (
                <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                  {config.step2Title}
                </h2>
              )}
            </div>

            <span className="text-[11px] text-zinc-400 font-mono">
              {promptText.length} karakter
            </span>
          </div>

          {/* Textarea Box */}
          <div className="space-y-3">
            <div className="relative rounded-2xl bg-[#13151d] border border-white/[0.08] focus-within:border-white/20 transition-all p-4 shadow-inner">
              {isEditMode && (
                <div className="mb-2 pb-2 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] text-amber-400 font-mono">Edit Teks Placeholder:</span>
                  <input
                    type="text"
                    value={config.promptPlaceholder}
                    onChange={(e) => {
                      saveConfig({ ...config, promptPlaceholder: e.target.value });
                      setActivePreset('custom');
                    }}
                    className="w-3/4 text-xs bg-black/60 border border-amber-500/30 text-zinc-200 rounded px-2 py-0.5"
                  />
                </div>
              )}

              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={config.promptPlaceholder}
                rows={4}
                className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none resize-none leading-relaxed"
              />

              {/* Bottom indicator inside textarea */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.05] text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5 font-mono text-[10px]">
                  <Sliders className="w-3 h-3 text-sky-400" />
                  Format terpilih:{' '}
                  <strong className="text-zinc-200 font-sans">{selectedCard ? selectedCard.title : ''}</strong>
                </span>
                <span className="hidden sm:inline font-mono text-[10px] text-zinc-400">
                  Standar Risalah MPK SMK Negeri 13 Bandung
                </span>
              </div>
            </div>

            {/* Ideas to get you started (Idea Pills) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">
                  {isEditMode ? 'Kustomisasi Inspirasi Ide (Pills):' : 'Inspirasi agenda cepat:'}
                </span>

                {isEditMode && (
                  <button
                    onClick={() => setShowAddPill(true)}
                    className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <Plus className="w-3 h-3" /> Tambah Ide
                  </button>
                )}
              </div>

              {/* Add pill form */}
              {showAddPill && isEditMode && (
                <div className="flex items-center gap-2 bg-black/70 border border-white/15 p-2 rounded-xl">
                  <input
                    type="text"
                    value={newPillInput}
                    onChange={(e) => setNewPillInput(e.target.value)}
                    placeholder="Tulis ide agenda baru..."
                    className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPill()}
                  />
                  <button
                    onClick={handleAddPill}
                    className="px-3 py-1 bg-zinc-800 text-white text-xs font-semibold rounded-lg border border-white/10"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setShowAddPill(false)}
                    className="px-2 py-1 text-zinc-400 text-xs"
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
                    className={`inline-flex items-center gap-1.5 rounded-lg border text-xs transition-all active:scale-[0.98] ${
                      isEditMode
                        ? 'bg-black/60 border-amber-500/30 px-2 py-1'
                        : 'bg-[#151720] hover:bg-[#1a1d28] border-white/[0.06] text-zinc-300 hover:text-white px-3 py-1.5 cursor-pointer hover:border-white/15'
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
                          type="text"
                          value={pill}
                          onChange={(e) => handleUpdatePill(idx, e.target.value)}
                          className="bg-transparent text-xs text-zinc-200 focus:outline-none w-48"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePill(idx);
                          }}
                          className="text-rose-400 hover:text-rose-300 p-0.5 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{pill}</span>
                        <ArrowRight className="w-3 h-3 text-zinc-400" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Built by, Saved in, and Start button */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Standar Naskah Dinas Selector */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-zinc-400" /> Standar Naskah:
              </span>
              <select
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
                className="bg-[#14161f] border border-white/[0.08] text-zinc-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-white/20 cursor-pointer"
              >
                <option value="Tata Naskah Dinas MPK 13 (Standar Utama)">Tata Naskah Dinas MPK 13 (Standar Utama)</option>
                <option value="Risalah Padat & Ketetapan Inti">Risalah Padat &amp; Ketetapan Inti</option>
                <option value="Fokus Pengesahan Anggaran Kas">Fokus Pengesahan Anggaran Kas</option>
                <option value="Format Evaluasi & Rekomendasi">Format Evaluasi &amp; Rekomendasi</option>
              </select>
            </div>

            {/* Saved in Folder Path */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-zinc-400" /> Target:
              </span>
              <input
                type="text"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                className="bg-[#151720] border border-white/[0.08] text-zinc-300 font-mono text-[11px] rounded-xl px-3 py-1.5 w-56 sm:w-64 focus:outline-none focus:border-white/20 truncate"
              />
            </div>
          </div>

          {/* Start Action Button (Linear-tier Button-in-Button Architecture) */}
          <button
            onClick={handleStart}
            className="group flex items-center justify-center gap-3 px-6 py-2.5 bg-white text-zinc-950 font-semibold text-xs rounded-xl shadow-lg hover:bg-zinc-200 active:scale-[0.98] transition-all self-stretch md:self-auto cursor-pointer"
          >
            <span>Mulai Sesi Rapat</span>
            <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3 h-3 text-zinc-950 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
