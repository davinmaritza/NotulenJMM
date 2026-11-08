'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState, useRef } from 'react';
import {
  Cloud,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Clock,
  History,
  ShieldCheck,
  ExternalLink,
  Settings,
  Archive,
  Zap,
} from 'lucide-react';
import { useMeetings } from '../context/MeetingContext';
import {
  downloadBackupFile,
  parseAndValidateBackup,
  getGoogleClientId,
  setGoogleClientId,
  requestGoogleAccessToken,
  fetchGoogleUserProfile,
  uploadBackupToGoogleDrive,
  downloadBackupFromGoogleDrive,
  clearStoredGoogleAccount,
} from '../lib/googleDriveBackup';

interface CloudBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudBackupModal: React.FC<CloudBackupModalProps> = ({ isOpen, onClose }) => {
  const {
    meetings,
    historyLogs,
    googleAccount,
    setGoogleAccount,
    handleLoginWithEmail,
    handleRestoreBackup,
    refreshHistoryLogs,
    isAutoSyncing,
    handleToggleAutoSync,
    handleTriggerManualSync,
  } = useMeetings();

  const [activeTab, setActiveTab] = useState<'google' | 'file' | 'history'>('google');
  const [clientIdInput, setClientIdInput] = useState<string>(() => getGoogleClientId());
  const [showConfigClientId, setShowConfigClientId] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle Google Connect
  const handleConnectGoogle = async () => {
    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Membuka jendela otorisasi Google...' });
    try {
      const activeClientId = clientIdInput.trim() || getGoogleClientId();
      if (!activeClientId) {
        throw new Error('Google Client ID belum diatur. Silakan isi Client ID terlebih dahulu.');
      }
      setGoogleClientId(activeClientId);

      const token = await requestGoogleAccessToken(activeClientId, false);
      const profile = await fetchGoogleUserProfile(token);

      const newAccount = {
        connected: true,
        email: profile.email,
        name: profile.name,
        photoUrl: profile.picture,
        lastSyncTime: new Date().toISOString(),
        accessToken: token,
        tokenExpiresAt: Date.now() + 3500 * 1000,
        autoSyncEnabled: true,
      };
      setGoogleAccount(newAccount);

      // Perform initial backup immediately
      try {
        const res = await uploadBackupToGoogleDrive(token, meetings);
        newAccount.lastSyncTime = res.modifiedTime;
        setGoogleAccount(newAccount);
      } catch (uploadErr) {
        console.warn('Initial backup after connect failed:', uploadErr);
      }

      setStatusMessage({
        type: 'success',
        text: `Berhasil terhubung ke akun Google: ${profile.email}. Auto-Backup Google Drive aktif!`,
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setStatusMessage({
        type: 'error',
        text: errMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectGoogle = () => {
    clearStoredGoogleAccount();
    setGoogleAccount({ connected: false });
    setStatusMessage({ type: 'info', text: 'Koneksi akun Google telah diputuskan.' });
  };

  // Backup to Google Drive
  const handleBackupToGoogle = async () => {
    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Mengunggah cadangan ke Google Drive...' });
    try {
      const activeClientId = clientIdInput.trim() || getGoogleClientId();
      if (!activeClientId) {
        setShowConfigClientId(true);
        throw new Error('Silakan masukkan Google Client ID Anda terlebih dahulu.');
      }
      const token = await requestGoogleAccessToken(activeClientId, false);
      const res = await uploadBackupToGoogleDrive(token, meetings);

      setGoogleAccount({
        ...googleAccount,
        connected: true,
        accessToken: token,
        tokenExpiresAt: Date.now() + 3500 * 1000,
        lastSyncTime: res.modifiedTime,
      });
      refreshHistoryLogs();
      setStatusMessage({
        type: 'success',
        text: `Cadangan cloud berhasil disimpan di Google Drive (${meetings.length} sesi rapat terproteksi)!`,
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Restore from Google Drive
  const handleRestoreFromGoogle = async () => {
    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Mengunduh cadangan dari Google Drive...' });
    try {
      const activeClientId = clientIdInput.trim() || getGoogleClientId();
      if (!activeClientId) {
        setShowConfigClientId(true);
        throw new Error('Silakan masukkan Google Client ID Anda terlebih dahulu.');
      }
      const token = await requestGoogleAccessToken(activeClientId);
      const res = await downloadBackupFromGoogleDrive(token);

      if (!res.success || !res.meetings) {
        throw new Error(res.message);
      }

      handleRestoreBackup(res.meetings);
      refreshHistoryLogs();
      setStatusMessage({
        type: 'success',
        text: `Berhasil memulihkan ${res.meetings.length} sesi rapat dari Google Drive!`,
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Download Offline Backup File
  const handleDownloadFile = () => {
    try {
      const filename = downloadBackupFile(meetings);
      refreshHistoryLogs();
      setStatusMessage({
        type: 'success',
        text: `Berkas cadangan '${filename}' berhasil diunduh. Simpan berkas ini di perangkat atau Google Drive Anda.`,
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: `Gagal mengunduh berkas cadangan: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  };

  // Upload Offline Backup File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const res = parseAndValidateBackup(text);
        if (!res.success || !res.meetings) {
          setStatusMessage({ type: 'error', text: res.message });
          return;
        }
        handleRestoreBackup(res.meetings);
        refreshHistoryLogs();
        setStatusMessage({
          type: 'success',
          text: `Berhasil memulihkan ${res.meetings.length} sesi sidang dari berkas '${file.name}'!`,
        });
      } catch (err) {
        setStatusMessage({
          type: 'error',
          text: `Gagal membaca berkas: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const archivedMeetingsCount = meetings.filter((m) => m.isArchived).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cloud-backup-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="bg-[#FFFDF5] border-[3px] border-black rounded-2xl w-full max-w-2xl shadow-[8px_8px_0px_0px_#000] overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-[#FFE600] border-b-[2.5px] border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] shrink-0">
              <Cloud className="w-5 h-5 stroke-[2.5] text-black" />
            </div>
            <div>
              <h3 id="cloud-backup-title" className="text-base sm:text-lg font-black text-black tracking-tight">
                Cadangan Cloud &amp; Lemari Arsip
              </h3>
              <p className="text-[11px] sm:text-xs text-black/80 font-bold font-mono">
                Proteksi dokumen dari refresh cache &amp; lemari arsip digital MPK 13
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog cadangan"
            className="w-9 h-9 rounded-xl bg-white hover:bg-rose-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Status Message Banner */}
        {statusMessage && (
          <div
            className={`px-4 py-2.5 border-b-2 border-black flex items-center gap-2.5 text-xs font-bold ${
              statusMessage.type === 'success'
                ? 'bg-[#A7F3D0] text-black'
                : statusMessage.type === 'error'
                ? 'bg-rose-200 text-rose-900'
                : 'bg-[#DDD6FE] text-black'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[2.5]" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
            ) : (
              <RefreshCw className="w-4 h-4 shrink-0 stroke-[2.5] animate-spin" />
            )}
            <span className="flex-1 leading-snug">{statusMessage.text}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-[10px] font-black underline uppercase cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b-2 border-black bg-white px-3 sm:px-4 pt-3 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`px-3.5 sm:px-4 py-2 rounded-t-xl text-xs font-black border-t-2 border-x-2 border-black flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'google'
                ? 'bg-[#FFFDF5] text-black -mb-[2px] pb-2.5 shadow-[0_-2px_0_0_#000]'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            <Cloud className="w-4 h-4 stroke-[2.5]" />
            <span>Google Drive</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`px-3.5 sm:px-4 py-2 rounded-t-xl text-xs font-black border-t-2 border-x-2 border-black flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'file'
                ? 'bg-[#FFFDF5] text-black -mb-[2px] pb-2.5 shadow-[0_-2px_0_0_#000]'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Berkas Cadangan (.JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3.5 sm:px-4 py-2 rounded-t-xl text-xs font-black border-t-2 border-x-2 border-black flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#FFFDF5] text-black -mb-[2px] pb-2.5 shadow-[0_-2px_0_0_#000]'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            <History className="w-4 h-4 stroke-[2.5]" />
            <span>Riwayat &amp; Arsip ({historyLogs.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* TAB 1: GOOGLE DRIVE */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              {/* Account Connection Status Box */}
              <div className="p-4 rounded-xl border-2 border-black bg-white shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] border-2 border-black flex items-center justify-center font-black text-black shadow-[1.5px_1.5px_0px_0px_#000] overflow-hidden">
                    {googleAccount.connected && googleAccount.photoUrl ? (
                      <img
                        src={googleAccount.photoUrl}
                        alt={googleAccount.name || googleAccount.email}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Cloud className="w-5 h-5 text-sky-700" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-black">{googleAccount.name || 'Google Drive Cloud'}</span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-black ${
                          googleAccount.connected
                            ? 'bg-[#A7F3D0] text-black'
                            : 'bg-zinc-200 text-zinc-700'
                        }`}
                      >
                        {googleAccount.connected ? 'Terhubung' : 'Belum Terhubung'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-600 font-medium">
                      {googleAccount.connected && googleAccount.email
                        ? `Akun: ${googleAccount.email} • Terakhir: ${
                            googleAccount.lastSyncTime
                              ? new Date(googleAccount.lastSyncTime).toLocaleDateString('id-ID')
                              : '-'
                          }`
                        : 'Hubungkan untuk sinkronisasi otomatis ke Google Drive Anda.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {googleAccount.connected ? (
                    <button
                      type="button"
                      onClick={handleDisconnectGoogle}
                      className="px-3 py-1.5 rounded-lg border-2 border-black bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                    >
                      Putuskan
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConnectGoogle}
                      disabled={isLoading}
                      className="px-3.5 py-1.5 rounded-lg border-2 border-black bg-[#4ECDC4] hover:bg-teal-300 text-black text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Hubungkan Akun Google</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Auto-Backup Otomatis Card */}
              {googleAccount.connected && (
                <div className="p-4 rounded-xl border-2 border-black bg-[#FEF08A] shadow-[3px_3px_0px_0px_#000] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-black text-[#FEF08A] border-2 border-black flex items-center justify-center font-black shadow-[1.5px_1.5px_0px_0px_#000]">
                        <Zap className="w-5 h-5 fill-[#FEF08A] stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-black">Auto-Backup Otomatis Cloud</h4>
                          <span
                            className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border border-black ${
                              googleAccount.autoSyncEnabled !== false
                                ? 'bg-[#A7F3D0] text-black shadow-[1px_1px_0px_0px_#000]'
                                : 'bg-zinc-200 text-zinc-700'
                            }`}
                          >
                            {googleAccount.autoSyncEnabled !== false ? 'AKTIF (OTOMATIS)' : 'NONAKTIF'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-900 font-medium leading-snug mt-0.5">
                          Setiap penulisan notulensi, draf, dan pengesahan arsip otomatis disinkronkan ke Google Drive tanpa klik manual.
                        </p>
                      </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleAutoSync(googleAccount.autoSyncEnabled === false)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-black transition-colors duration-200 ease-in-out focus:outline-none ${
                        googleAccount.autoSyncEnabled !== false ? 'bg-black' : 'bg-zinc-300'
                      }`}
                      aria-label="Toggle Auto-Backup Otomatis"
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white border border-black shadow transition duration-200 ease-in-out mt-0.5 ${
                          googleAccount.autoSyncEnabled !== false ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="pt-2.5 border-t border-black/15 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2 font-bold text-zinc-900">
                      {isAutoSyncing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-black stroke-[3]" />
                          <span className="font-mono text-[10px] uppercase font-black text-black">
                            Sedang mencadangkan otomatis ke Google Drive...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black shadow-[0.5px_0.5px_0px_0px_#000]" />
                          <span>
                            {googleAccount.lastSyncTime
                              ? `Tersinkronisasi otomatis: ${new Date(googleAccount.lastSyncTime).toLocaleTimeString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })} WIB (${new Date(googleAccount.lastSyncTime).toLocaleDateString('id-ID')})`
                              : 'Siap melakukan pencadangan otomatis.'}
                          </span>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleTriggerManualSync}
                      disabled={isAutoSyncing || isLoading}
                      className="text-[10px] font-black underline hover:text-black uppercase cursor-pointer"
                    >
                      Sinkronkan Sekarang
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons: Cadangkan & Pulihkan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleBackupToGoogle}
                  disabled={isLoading}
                  className="p-4 rounded-xl border-2 border-black bg-[#FEF08A] hover:bg-[#FFE600] text-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all text-left flex flex-col justify-between min-h-[110px] cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-black text-[#FEF08A] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                      Cloud Upload
                    </span>
                    <Upload className="w-5 h-5 stroke-[2.5] text-black group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-black tracking-tight">
                      Cadangkan ke Google Drive
                    </h4>
                    <p className="text-[11px] text-zinc-800 font-medium leading-snug mt-0.5">
                      Simpan {meetings.length} sesi &amp; draf sidang ke berkas cloud `NotulenJMM_Cloud_Backup.json`.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleRestoreFromGoogle}
                  disabled={isLoading}
                  className="p-4 rounded-xl border-2 border-black bg-[#A7F3D0] hover:bg-emerald-300 text-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all text-left flex flex-col justify-between min-h-[110px] cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-black text-[#A7F3D0] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                      Cloud Restore
                    </span>
                    <Download className="w-5 h-5 stroke-[2.5] text-black group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-black tracking-tight">
                      Pulihkan dari Google Drive
                    </h4>
                    <p className="text-[11px] text-zinc-800 font-medium leading-snug mt-0.5">
                      Muat ulang seluruh data rapat yang tersimpan di cloud Google Drive Anda.
                    </p>
                  </div>
                </button>
              </div>

              {/* Client ID Setting Accordion */}
              <div className="p-3.5 rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] space-y-2">
                <button
                  type="button"
                  onClick={() => setShowConfigClientId(!showConfigClientId)}
                  className="flex items-center justify-between w-full text-xs font-black text-black cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Pengaturan Google Client ID (Opsional)</span>
                  </span>
                  <span className="text-[10px] font-mono underline">
                    {showConfigClientId ? 'Tutup' : 'Ubah ID'}
                  </span>
                </button>

                {showConfigClientId && (
                  <div className="space-y-2 pt-2 border-t border-black/15">
                    <label htmlFor="custom-google-client-id" className="text-[11px] text-zinc-600 font-medium leading-relaxed block">
                      Jika Anda memiliki Google Cloud Console Client ID sendiri, masukkan di sini.
                      Nilai ini disimpan di browser lokal Anda.
                    </label>
                    <input
                      id="custom-google-client-id"
                      name="customGoogleClientId"
                      aria-label="Google Cloud Console Client ID"
                      type="text"
                      value={clientIdInput}
                      onChange={(e) => {
                        setClientIdInput(e.target.value);
                        setGoogleClientId(e.target.value);
                      }}
                      placeholder="Contoh: 123456789-abcdef.apps.googleusercontent.com"
                      className="w-full bg-[#FFFDF5] border-2 border-black rounded-lg px-3 py-1.5 text-xs font-mono font-medium focus:outline-none shadow-[1.5px_1.5px_0px_0px_#000]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: OFFLINE BACKUP FILE (.JSON) */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border-2 border-black bg-[#E0F2FE] shadow-[2px_2px_0px_0px_#000] flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-sky-700 shrink-0 mt-0.5 stroke-[2.5]" />
                <div className="text-xs text-black">
                  <p className="font-black">100% Bebas Kuota &amp; Tanpa Perlu Akun API</p>
                  <p className="text-[11px] text-black/80 font-medium mt-0.5">
                    Unduh berkas cadangan langsung ke laptop atau HP Anda. Berkas ini dapat Anda kirim ke
                    Google Drive, WhatsApp, atau flashdisk sebagai proteksi total terhadap pembersihan cache browser.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Download Backup */}
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="p-4 rounded-xl border-2 border-black bg-[#FFD93D] hover:bg-[#FFE600] text-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all text-left flex flex-col justify-between min-h-[110px] cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-black text-[#FFD93D] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                      Unduh Berkas
                    </span>
                    <Download className="w-5 h-5 stroke-[2.5] text-black group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-black tracking-tight">
                      Unduh Cadangan (.json)
                    </h4>
                    <p className="text-[11px] text-zinc-800 font-medium leading-snug mt-0.5">
                      Menyimpan {meetings.length} sesi sidang dan seluruh kustomisasi ke berkas JSON fisik.
                    </p>
                  </div>
                </button>

                {/* Import / Restore Backup */}
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="restore-backup-file-input"
                  />
                  <label
                    htmlFor="restore-backup-file-input"
                    className="p-4 rounded-xl border-2 border-black bg-[#DDD6FE] hover:bg-[#c8bdfc] text-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all text-left flex flex-col justify-between min-h-[110px] cursor-pointer group block"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-black text-[#DDD6FE] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                        Pulihkan Berkas
                      </span>
                      <Upload className="w-5 h-5 stroke-[2.5] text-black group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-black tracking-tight">
                        Pulihkan dari Berkas (.json)
                      </h4>
                      <p className="text-[11px] text-zinc-800 font-medium leading-snug mt-0.5">
                        Pilih file cadangan JSON dari perangkat untuk merestorasi seluruh data rapat seketika.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RIWAYAT & ARSIP LOGS */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-black px-1">
                <span>Total Arsip Resmi: {archivedMeetingsCount} Sesi</span>
                <span className="text-zinc-600 font-mono font-normal">
                  {historyLogs.length} Catatan Jejak Audit
                </span>
              </div>

              {historyLogs.length === 0 ? (
                <div className="p-6 text-center rounded-xl border-2 border-dashed border-black/40 bg-white">
                  <History className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-xs font-black text-black">Belum Ada Riwayat Aktivitas</p>
                  <p className="text-[11px] text-zinc-600 font-medium mt-0.5">
                    Aktivitas penyimpanan draf, pengarsipan sidang, dan cadangan cloud akan tercatat otomatis di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {historyLogs.map((log) => {
                    const isArchive = log.action === 'ARCHIVE';
                    const isBackup = log.action === 'BACKUP_CLOUD';
                    const isRestore = log.action === 'RESTORE';
                    const isDelete = log.action === 'DELETE';

                    return (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] flex items-start gap-2.5 text-xs"
                      >
                        <div
                          className={`w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_#000] ${
                            isArchive
                              ? 'bg-[#A7F3D0] text-black'
                              : isBackup
                              ? 'bg-[#FEF08A] text-black'
                              : isRestore
                              ? 'bg-[#DDD6FE] text-black'
                              : isDelete
                              ? 'bg-rose-200 text-rose-800'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {isArchive ? (
                            <Archive className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : isBackup ? (
                            <Cloud className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-black text-black text-xs truncate">
                              {log.title}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-600 shrink-0 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-zinc-500" />
                              {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-700 font-medium leading-snug mt-0.5">
                            {log.details}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-[#FFFDF5] border-t-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-zinc-600 font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 border border-black animate-pulse" />
            <span>Sistem Cadangan Mandiri • MPK 13</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border-2 border-black bg-white hover:bg-[#FFE600] text-black text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
