'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  RefreshCw,
  Upload,
  AlertCircle,
  Volume2,
  FileAudio,
  ArrowRight,
  FileCheck2,
  Save,
  CheckCircle2,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import { AudioSegment } from '../lib/types';
import { transcribeAudioApi } from '@/lib/api';

interface AudioRecorderStudioProps {
  onDiarizationComplete: (
    segments: AudioSegment[],
    duration: number,
    meetingTitle?: string,
    secretaryNotes?: string,
    audioUrl?: string
  ) => void;
  onSaveDraft?: (draft: {
    title: string;
    secretaryNotes: string;
    durationSeconds: number;
    audioBlob?: Blob | null;
    audioUrl?: string | null;
  }) => void;
}

export const AudioRecorderStudio: React.FC<AudioRecorderStudioProps> = ({
  onDiarizationComplete,
  onSaveDraft,
}) => {
  const [studioMode, setStudioMode] = useState<'upload' | 'record'>('record');

  // Shared Meeting Metadata
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [secretaryNotes, setSecretaryNotes] = useState<string>(
    'Susun kata-kata secara formal dan lugas berstandar MPK SMK Negeri 13 Bandung. Tonjolkan keputusan resmi, alokasi anggaran dana jika ada, serta daftar penugasan PIC dan batas waktu.'
  );

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Live Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  // Processing & Toast State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draftToast, setDraftToast] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Timer effect for live recording
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused]);

  // Waveform oscilloscope loop
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);

    ctx.fillStyle = '#0a0b0e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = isRecording && !isPaused ? '#38bdf8' : '#525866';
    ctx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    animationFrameRef.current = requestAnimationFrame(drawWaveform);
  };

  const startLiveRecording = async () => {
    setErrorMessage(null);
    setDraftToast(null);
    audioChunksRef.current = [];
    setSeconds(0);
    setAudioUrl(null);
    setRecordedBlob(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 2048;

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordedBlob(audioBlob);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        if (!meetingTitle.trim()) {
          const nowTitle = `Voice Note Sidang MPK ${new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}`;
          setMeetingTitle(nowTitle);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);

      drawWaveform();
    } catch (err: unknown) {
      console.error('Microphone access denied:', err);
      setErrorMessage(
        'Akses mikrofon ditolak atau perangkat input suara tidak terdeteksi. Silakan periksa izin browser Anda.'
      );
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const resetRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
    setSeconds(0);
    setAudioUrl(null);
    setRecordedBlob(null);
    setErrorMessage(null);
    setDraftToast(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setRecordedBlob(file);

    // Auto-generate clean title from filename
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const formattedTitle =
      nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1);
    setMeetingTitle(formattedTitle || 'Sesi Sidang Pleno MPK');
  };

  // Save Current Session as Online Draft
  const handleSaveAsDraft = () => {
    const titleToUse =
      meetingTitle.trim() ||
      `Draf Sidang MPK ${new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`;

    if (onSaveDraft) {
      onSaveDraft({
        title: titleToUse,
        secretaryNotes: secretaryNotes,
        durationSeconds: seconds > 0 ? seconds : 180,
        audioBlob: recordedBlob || selectedFile,
        audioUrl: audioUrl,
      });

      setDraftToast(
        `Draf sidang "${titleToUse}" berhasil disimpan secara online. Anda dapat membukanya kapan saja dari Arsip Sidang.`
      );
      setTimeout(() => setDraftToast(null), 5000);
    }
  };

  const handleProcessUploadedAudio = async () => {
    const audioToProcess = selectedFile || recordedBlob;
    if (!audioToProcess) {
      setErrorMessage('Pilih atau rekam berkas suara voice note terlebih dahulu.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Mengunggah rekaman voice note ke server transkripsi...');
    setErrorMessage(null);
    setDraftToast(null);

    try {
      setProcessingStep('Melakukan speech recognition & pemisahan pembicara...');
      const response = await transcribeAudioApi(
        audioToProcess,
        undefined,
        selectedFile ? selectedFile.name : `rekaman-vn-${Date.now()}.webm`
      );

      setProcessingStep('Menyusun naskah risalah & ketetapan sidang resmi...');
      const titleToUse = meetingTitle.trim() || 'Sesi Sidang MPK SMK Negeri 13 Bandung';
      onDiarizationComplete(
        response.segments,
        response.durationSeconds || seconds,
        titleToUse,
        secretaryNotes,
        audioUrl || undefined
      );
    } catch (err: unknown) {
      console.error('Audio processing error:', err);
      setErrorMessage(
        'Gagal memproses audio. Silakan periksa status koneksi server atau coba berkas audio lain.'
      );
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-[#0e0f14] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Studio Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Studio Voice Note &amp; Perekaman Sidang
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.05] text-zinc-300 border border-white/[0.08]">
              Tata Naskah Digital
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Rekam langsung suara sidang dengan kendali jeda/pause, atau unggah voice note WhatsApp/HP untuk diolah ke draf online
          </p>
        </div>

        {/* Mode Selector Pill */}
        <div className="inline-flex items-center bg-[#12141a] p-1 rounded-xl border border-white/[0.06] self-start sm:self-auto">
          <button
            onClick={() => setStudioMode('record')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              studioMode === 'record'
                ? 'bg-zinc-800 text-white border border-white/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-rose-400" />
            <span>Rekam Voice Note</span>
          </button>
          <button
            onClick={() => setStudioMode('upload')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              studioMode === 'upload'
                ? 'bg-zinc-800 text-white border border-white/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Unggah Berkas Audio</span>
          </button>
        </div>
      </div>

      {/* Friendly Secretary Help Box */}
      <div className="p-4 rounded-2xl bg-[#12141c] border border-white/[0.07] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-white">Petunjuk Mudah untuk Notulis:</p>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Letakkan ponsel/laptop di tengah meja rapat. Jika forum diskors atau istirahat, klik <strong>Jeda (Pause)</strong>. Kamu bisa klik <strong>Simpan Sebagai Draf Online</strong> kapan saja agar rekaman aman tersimpan di peramban.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const todayStr = new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            setMeetingTitle(`Sidang Koordinasi MPK 13 — ${todayStr}`);
          }}
          className="shrink-0 px-3 py-1.5 bg-[#1b1e2a] hover:bg-zinc-800 text-sky-300 border border-sky-500/25 rounded-xl text-[11px] font-medium transition-all cursor-pointer active:scale-[0.98]"
        >
          Isi Judul Otomatis Hari Ini
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {draftToast && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center gap-3 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{draftToast}</span>
        </div>
      )}

      {/* MODE 1: REKAM VOICE NOTE LIVE (DENGAN PAUSE/RESUME & OSCILLOSCOPE) */}
      {studioMode === 'record' && (
        <div className="space-y-5">
          {/* Oscilloscope Canvas & Live Telemetry */}
          <div className="relative border border-white/[0.08] rounded-2xl bg-[#0a0b0e] overflow-hidden">
            <canvas ref={canvasRef} width={800} height={120} className="w-full h-32 block" />

            {/* Live Status Indicators */}
            <div className="absolute top-3 left-4 flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isRecording && !isPaused
                    ? 'bg-rose-500 animate-ping'
                    : isRecording && isPaused
                    ? 'bg-amber-400'
                    : 'bg-zinc-600'
                }`}
              />
              <span className="text-[11px] font-mono text-zinc-300">
                {isRecording
                  ? isPaused
                    ? 'Rekaman Dijeda (Pause)'
                    : 'Sedang Merekam Suara Sidang'
                  : recordedBlob
                  ? 'Rekaman Selesai (Siap Diproses)'
                  : 'Siap Merekam'}
              </span>
            </div>

            <div className="absolute top-3 right-4 font-mono text-xl font-bold text-white tracking-wider">
              {formatTime(seconds)}
            </div>
          </div>

          {/* Recorder Transport Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-1">
            {!isRecording ? (
              <>
                <button
                  onClick={startLiveRecording}
                  className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>{recordedBlob ? 'Rekam Ulang Voice Note' : 'Mulai Rekam Voice Note'}</span>
                </button>
                {recordedBlob && (
                  <button
                    onClick={resetRecording}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#14161f] hover:bg-zinc-800 text-zinc-400 hover:text-white font-medium rounded-xl text-xs border border-white/[0.08] transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </>
            ) : (
              <>
                {!isPaused ? (
                  <button
                    onClick={pauseRecording}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-xl text-xs border border-amber-500/40 transition-all cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Jeda (Pause)</span>
                  </button>
                ) : (
                  <button
                    onClick={resumeRecording}
                    className="flex items-center gap-2 px-5 py-2.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-semibold rounded-xl text-xs border border-sky-500/40 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lanjutkan (Resume)</span>
                  </button>
                )}

                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white text-zinc-950 font-bold rounded-xl text-xs hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Selesai Rekam</span>
                </button>
              </>
            )}
          </div>

          {/* Voice Note Player Preview */}
          {audioUrl && !isRecording && (
            <div className="p-4 bg-black/40 border border-white/[0.06] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Volume2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Pratinjau Voice Note Hasil Rekaman</p>
                  <p className="text-[10px] font-mono text-zinc-500">Durasi: {formatTime(seconds)} • WebM Audio</p>
                </div>
              </div>
              <audio src={audioUrl} controls className="w-full sm:w-80 h-9" />
            </div>
          )}
        </div>
      )}

      {/* MODE 2: UNGGAH AUDIO / VN WHATSAPP DARI FILE */}
      {studioMode === 'upload' && (
        <div className="space-y-5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 sm:p-10 border-2 border-dashed border-white/15 hover:border-white/30 rounded-2xl bg-black/30 hover:bg-black/50 transition-all cursor-pointer text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#14161f] border border-white/10 flex items-center justify-center mx-auto text-sky-400">
              <FileAudio className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {selectedFile ? selectedFile.name : 'Pilih atau Tarik Berkas Voice Note / Audio ke Sini'}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Format didukung: <strong className="text-zinc-200">.mp3, .wav, .m4a, .ogg, .webm, .flac, .opus</strong>
              </p>
            </div>
            {selectedFile && (
              <span className="inline-block text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full">
                Ukuran: {formatFileSize(selectedFile.size)}
              </span>
            )}
            <input
              id="audio-file-upload"
              name="audio-file-upload"
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.flac,.aac,.opus"
              aria-label="Unggah Berkas Audio Rekaman"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
            />
          </div>

          {/* Audio Preview if selected from file */}
          {audioUrl && (
            <div className="p-4 bg-black/40 border border-white/[0.06] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Volume2 className="w-5 h-5 text-sky-400 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-white truncate max-w-xs">
                    {selectedFile ? selectedFile.name : 'Audio Voice Note'}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500">Berkas audio siap diproses atau disimpan</p>
                </div>
              </div>
              <audio src={audioUrl} controls className="w-full sm:w-80 h-9" />
            </div>
          )}
        </div>
      )}

      {/* COMMON METADATA FORM: TITLE & SECRETARY STEERING NOTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
        <div className="space-y-1.5">
          <label htmlFor="recording-meeting-title" className="text-xs font-semibold text-zinc-300">
            Agenda / Judul Sesi Sidang:
          </label>
          <input
            id="recording-meeting-title"
            name="recording-meeting-title"
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="Contoh: Sidang Pleno Koordinasi Panitia LDKS 2026"
            className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="recording-secretary-notes" className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
            <span>Catatan Pengarah Notulis (Arahan Format &amp; Keputusan):</span>
            <span className="text-[10px] font-mono text-zinc-500">Panduan Diksi</span>
          </label>
          <textarea
            id="recording-secretary-notes"
            name="recording-secretary-notes"
            value={secretaryNotes}
            onChange={(e) => setSecretaryNotes(e.target.value)}
            rows={3}
            placeholder="Tuliskan arahan susunan kata: misal gaya bahasa formal MPK, tonjolkan rincian anggaran dana dan tenggat waktu tugas..."
            className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 leading-relaxed resize-none font-sans"
          />
        </div>
      </div>

      {/* Quick Preset Pills for Secretary Notes */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-mono text-zinc-500">Preset Arahan:</span>
        <button
          onClick={() =>
            setSecretaryNotes(
              'Susun kata-kata secara formal dan lugas berstandar MPK SMK Negeri 13 Bandung. Tonjolkan keputusan resmi, alokasi anggaran dana jika ada, serta daftar penugasan PIC dan batas waktu.'
            )
          }
          className="px-2.5 py-1 bg-[#14161f] hover:bg-zinc-800 text-zinc-300 border border-white/[0.06] rounded-lg text-[11px] transition-all cursor-pointer active:scale-[0.98]"
        >
          Formal &amp; Yuridis MPK 13
        </button>
        <button
          onClick={() =>
            setSecretaryNotes(
              'Buat ringkasan eksekutif padat 2 paragraf saja, fokuskan pada keputusan kunci dan hilangkan obrolan santai.'
            )
          }
          className="px-2.5 py-1 bg-[#14161f] hover:bg-zinc-800 text-zinc-300 border border-white/[0.06] rounded-lg text-[11px] transition-all cursor-pointer active:scale-[0.98]"
        >
          Rangkuman Padat &amp; Tajam
        </button>
        <button
          onClick={() =>
            setSecretaryNotes(
              'Fokuskan pada pembahasan anggaran kas, rincian biaya pengadaan, dan persetujuan bendahara.'
            )
          }
          className="px-2.5 py-1 bg-[#14161f] hover:bg-zinc-800 text-zinc-300 border border-white/[0.06] rounded-lg text-[11px] transition-all cursor-pointer active:scale-[0.98]"
        >
          Fokus Keputusan &amp; Anggaran Dana
        </button>
        <button
          onClick={() =>
            setSecretaryNotes(
              'Tekankan checklist pembagian tugas (Action Items), nama penanggung jawab per komisi, dan tenggat waktu pelaksanaan.'
            )
          }
          className="px-2.5 py-1 bg-[#14161f] hover:bg-zinc-800 text-zinc-300 border border-white/[0.06] rounded-lg text-[11px] transition-all cursor-pointer active:scale-[0.98]"
        >
          Fokus Penugasan (PIC &amp; Deadline)
        </button>
      </div>

      {/* ACTION BUTTONS: SIMPAN DRAF ONLINE & PROSES AUDIOTEKS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
        <button
          onClick={handleSaveAsDraft}
          disabled={!meetingTitle && !recordedBlob && !selectedFile}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#14161f] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.1] rounded-xl text-xs font-semibold active:scale-[0.985] transition-all disabled:opacity-40 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5 text-emerald-400" />
          <span>Simpan Sebagai Draf Online</span>
        </button>

        <button
          onClick={handleProcessUploadedAudio}
          disabled={isProcessing || (!selectedFile && !recordedBlob)}
          className="w-full sm:w-auto group flex items-center justify-center gap-3 px-6 py-2.5 bg-white text-zinc-950 font-semibold text-xs rounded-xl hover:bg-zinc-200 active:scale-[0.985] transition-all disabled:opacity-40 cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
              <span className="font-mono text-xs">{processingStep}</span>
            </>
          ) : (
            <>
              <FileCheck2 className="w-4 h-4 text-zinc-950" />
              <span>Proses Audio &amp; Susun Risalah Sidang</span>
              <div className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-2.5 h-2.5 text-zinc-950" />
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
