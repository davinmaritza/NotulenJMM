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
} from 'lucide-react';
import { AudioSegment } from '../lib/types';
import { transcribeAudioApi } from '@/lib/api';

interface AudioRecorderStudioProps {
  onDiarizationComplete: (
    segments: AudioSegment[],
    duration: number,
    meetingTitle?: string,
    secretaryNotes?: string
  ) => void;
}

export const AudioRecorderStudio: React.FC<AudioRecorderStudioProps> = ({ onDiarizationComplete }) => {
  const [studioMode, setStudioMode] = useState<'upload' | 'record'>('upload');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [secretaryNotes, setSecretaryNotes] = useState<string>(
    'Susun kata-kata secara formal dan lugas berstandar MPK SMK Negeri 13 Bandung. Tonjolkan keputusan resmi, alokasi anggaran dana jika ada, serta daftar penugasan PIC dan batas waktu.'
  );

  // Live Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
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

  // Oscilloscope Visualizer loop
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
    audioChunksRef.current = [];
    setSeconds(0);
    setAudioUrl(null);
    setRecordedBlob(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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

        stream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        const nowTitle = `Sidang Pleno MPK ${new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}`;
        setMeetingTitle(nowTitle);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);

      drawWaveform();
    } catch (err: unknown) {
      console.error('Microphone access denied:', err);
      setErrorMessage(
        'Akses mikrofon ditolak atau perangkat input suara tidak terdeteksi. Silakan periksa izin browser.'
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

  const handleProcessUploadedAudio = async () => {
    const audioToProcess = selectedFile || recordedBlob;
    if (!audioToProcess) {
      setErrorMessage('Pilih atau rekam file audio terlebih dahulu.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Mengunggah file audio ke pipeline transkripsi...');
    setErrorMessage(null);

    try {
      setProcessingStep('Melakukan speech recognition & pemisahan pembicara...');
      const response = await transcribeAudioApi(
        audioToProcess,
        undefined,
        selectedFile ? selectedFile.name : `rekaman-${Date.now()}.webm`
      );

      setProcessingStep('Menyusun risalah & notulensi sidang resmi...');
      const titleToUse = meetingTitle.trim() || 'Sesi Sidang MPK SMK Negeri 13 Bandung';
      onDiarizationComplete(response.segments, response.durationSeconds, titleToUse, secretaryNotes);
    } catch (err: unknown) {
      console.error('Audio processing error:', err);
      setErrorMessage(
        'Gagal memproses audio. Silakan periksa status koneksi server atau coba file lain.'
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
    <div className="bg-[#0e0f14] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Studio Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Perekaman &amp; Unggah Berkas Audio Sidang
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.05] text-zinc-300 border border-white/[0.08]">
              Tata Naskah Digital
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Unggah rekaman audio musyawarah (.mp3, .wav, .m4a, .ogg) atau gunakan mikrofon live untuk penyusunan risalah resmi
          </p>
        </div>

        {/* Mode Selector Pill */}
        <div className="inline-flex items-center bg-[#12141a] p-1 rounded-xl border border-white/[0.06] self-start sm:self-auto">
          <button
            onClick={() => setStudioMode('upload')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              studioMode === 'upload'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah Berkas Audio</span>
          </button>
          <button
            onClick={() => setStudioMode('record')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              studioMode === 'record'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-rose-400" />
            <span>Studio Rekam Mikrofon</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MODE 1: UNGGAH AUDIO SEKRETARIS */}
      {studioMode === 'upload' && (
        <div className="space-y-5">
          {/* File Drop / Selection Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 sm:p-10 border-2 border-dashed border-white/15 hover:border-white/30 rounded-2xl bg-black/30 hover:bg-black/50 transition-all cursor-pointer text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#14161f] border border-white/10 flex items-center justify-center mx-auto text-sky-400">
              <FileAudio className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {selectedFile ? selectedFile.name : 'Pilih atau Tarik Berkas Rekaman Audio ke Sini'}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Format didukung: <strong className="text-zinc-200">.mp3, .wav, .m4a, .ogg, .webm, .flac</strong>
              </p>
            </div>
            {selectedFile && (
              <span className="inline-block text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full">
                Ukuran Berkas: {formatFileSize(selectedFile.size)}
              </span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.flac,.aac"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
            />
          </div>

          {/* Form Fields: Meeting Title & Secretary Directive Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Agenda / Judul Sesi Sidang:
              </label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Contoh: Sidang Pleno Koordinasi Panitia LDKS 2026"
                className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Catatan Pengarah Notulis (Arahan Format &amp; Keputusan):</span>
                <span className="text-[10px] font-mono text-zinc-500">Panduan Diksi</span>
              </label>
              <textarea
                value={secretaryNotes}
                onChange={(e) => setSecretaryNotes(e.target.value)}
                rows={3}
                placeholder="Tuliskan arahan susunan kata: misal gaya bahasa formal MPK, tonjolkan rincian anggaran dana dan tenggat waktu tugas..."
                className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 leading-relaxed resize-none font-sans"
              />
            </div>
          </div>

          {/* Quick Preset Pills for Secretary Notes */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
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

          {/* Audio Preview if selected */}
          {audioUrl && (
            <div className="p-4 bg-black/40 border border-white/[0.06] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Volume2 className="w-5 h-5 text-sky-400 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-white truncate max-w-xs">
                    {selectedFile ? selectedFile.name : 'Audio Rekaman'}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500">Berkas siap diproses</p>
                </div>
              </div>
              <audio src={audioUrl} controls className="w-full sm:w-72 h-8" />
            </div>
          )}

          {/* Process Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleProcessUploadedAudio}
              disabled={isProcessing || (!selectedFile && !recordedBlob)}
              className="group flex items-center justify-center gap-3 px-7 py-3 bg-white text-zinc-950 font-semibold text-xs rounded-xl shadow-lg hover:bg-zinc-200 active:scale-[0.985] transition-all disabled:opacity-40 cursor-pointer"
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
                  <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3 h-3 text-zinc-950" />
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: STUDIO REKAM LIVE MIKROFON */}
      {studioMode === 'record' && (
        <div className="space-y-5">
          {/* Oscilloscope Canvas */}
          <div className="relative border border-white/[0.08] rounded-2xl bg-[#0a0b0e] overflow-hidden">
            <canvas ref={canvasRef} width={800} height={120} className="w-full h-28 block" />
            <div className="absolute top-3 left-4 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isRecording && !isPaused ? 'bg-rose-500 animate-ping' : 'bg-zinc-600'
                }`}
              />
              <span className="text-[11px] font-mono text-zinc-400">
                {isRecording ? (isPaused ? 'Jeda' : 'Merekam Suara Sidang') : 'Standby'}
              </span>
            </div>

            <div className="absolute top-3 right-4 font-mono text-lg font-bold text-white tracking-wider">
              {formatTime(seconds)}
            </div>
          </div>

          {/* Recorder Transport Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-2">
            {!isRecording ? (
              <button
                onClick={startLiveRecording}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs shadow-lg active:scale-[0.98] transition-all cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Mulai Rekam Suara</span>
              </button>
            ) : (
              <>
                {!isPaused ? (
                  <button
                    onClick={pauseRecording}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Jeda</span>
                  </button>
                ) : (
                  <button
                    onClick={resumeRecording}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    <span>Lanjutkan</span>
                  </button>
                )}

                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-950 font-bold rounded-xl text-xs shadow-md hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Selesai &amp; Simpan</span>
                </button>
              </>
            )}
          </div>

          {/* Audio Review Player */}
          {audioUrl && !isRecording && (
            <div className="p-4 bg-black/40 border border-white/[0.06] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Pratinjau Hasil Rekaman Mikrofon</p>
                  <p className="text-[10px] font-mono text-zinc-500">Durasi: {formatTime(seconds)}</p>
                </div>
              </div>
              <audio src={audioUrl} controls className="w-full sm:w-72 h-8" />
            </div>
          )}

          {/* Process Button for Live Recording */}
          {recordedBlob && !isRecording && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleProcessUploadedAudio}
                disabled={isProcessing}
                className="group flex items-center justify-center gap-3 px-7 py-3 bg-white text-zinc-950 font-semibold text-xs rounded-xl shadow-lg hover:bg-zinc-200 active:scale-[0.985] transition-all disabled:opacity-40 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                    <span className="font-mono text-xs">{processingStep}</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4 text-zinc-950" />
                    <span>Proses Rekaman &amp; Susun Risalah</span>
                    <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="w-3 h-3 text-zinc-950" />
                    </div>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
