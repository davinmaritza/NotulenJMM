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
  GraduationCap,
} from 'lucide-react';
import { AudioSegment } from '../lib/types';
import { transcribeAudioApi } from '@/lib/api';
import { useMeetings } from '../context/MeetingContext';

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
  const { openBeginnerGuide } = useMeetings();
  const [studioMode, setStudioMode] = useState<'upload' | 'record'>('record');

  // Shared Meeting Metadata
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [secretaryNotes, setSecretaryNotes] = useState<string>('');

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

    ctx.fillStyle = '#FFFDF5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = isRecording && !isPaused ? '#E11D48' : '#000000';
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
    <div className="bg-white border-[2.5px] border-black rounded-2xl p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_0px_#000]">
      {/* Studio Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-black text-black tracking-tight">
              Studio Voice Note &amp; Perekaman Sidang
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFD93D] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              Tata Naskah Digital
            </span>
          </div>
          <p className="text-xs text-zinc-700 font-medium mt-1 font-sans">
            Rekam langsung suara sidang dengan kendali jeda/pause, atau unggah voice note WhatsApp/HP untuk diolah ke draf online
          </p>
        </div>

        {/* Mode Selector Pill */}
        <div className="inline-flex items-center bg-[#FFFDF5] p-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
          <button
            onClick={() => setStudioMode('record')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              studioMode === 'record'
                ? 'bg-[#FFD93D] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]'
                : 'text-zinc-700 hover:text-black font-bold'
            }`}
          >
            <Mic className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Rekam Voice Note</span>
          </button>
          <button
            onClick={() => setStudioMode('upload')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              studioMode === 'upload'
                ? 'bg-[#FFD93D] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]'
                : 'text-zinc-700 hover:text-black font-bold'
            }`}
          >
            <Upload className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Unggah Berkas Audio</span>
          </button>
        </div>
      </div>

      {/* Friendly Secretary Help Box */}
      <div className="p-4 rounded-2xl bg-[#E0F2FE] border-2 border-black shadow-[3.5px_3.5px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-black stroke-[2.5] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-black text-black">Petunjuk Mudah untuk Notulis:</p>
            <p className="text-zinc-800 font-medium leading-relaxed text-[11px]">
              Letakkan ponsel/laptop di tengah meja rapat. Jika forum diskors atau istirahat, klik <strong>Jeda (Pause)</strong>. Kamu bisa klik <strong>Simpan Sebagai Draf Online</strong> kapan saja agar rekaman aman tersimpan di peramban.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={openBeginnerGuide}
            className="px-3 py-1.5 bg-[#FFE600] hover:bg-amber-300 text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
            title="Buka Panduan Pemula"
          >
            <GraduationCap className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Panduan Pemula</span>
          </button>

          <button
            onClick={() => {
              const todayStr = new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });
              setMeetingTitle(`Sidang Koordinasi MPK 13 — ${todayStr}`);
            }}
            className="px-3.5 py-1.5 bg-[#C4B5FD] hover:bg-[#b5a3fc] text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Isi Judul Otomatis Hari Ini
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-100 border-2 border-black text-black font-bold rounded-2xl flex items-center gap-3 text-xs shadow-[3px_3px_0px_0px_#000]">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 stroke-[2.5]" />
          <span>{errorMessage}</span>
        </div>
      )}

      {draftToast && (
        <div className="p-4 bg-emerald-100 border-2 border-black text-black font-bold rounded-2xl flex items-center gap-3 text-xs shadow-[3px_3px_0px_0px_#000] animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 stroke-[2.5]" />
          <span>{draftToast}</span>
        </div>
      )}

      {/* MODE 1: REKAM VOICE NOTE LIVE (DENGAN PAUSE/RESUME & OSCILLOSCOPE) */}
      {studioMode === 'record' && (
        <div className="space-y-5">
          {/* Oscilloscope Canvas & Live Telemetry */}
          <div className="relative border-[2.5px] border-black rounded-2xl bg-[#FFFDF5] overflow-hidden shadow-[4px_4px_0px_0px_#000]">
            <canvas ref={canvasRef} width={800} height={120} className="w-full h-32 block" />

            {/* Live Status Indicators */}
            <div className="absolute top-3 left-4 flex items-center gap-2 bg-white border-2 border-black px-2.5 py-1 rounded-xl shadow-[1.5px_1.5px_0px_0px_#000]">
              <span
                className={`w-2.5 h-2.5 rounded-full border border-black ${
                  isRecording && !isPaused
                    ? 'bg-rose-500 animate-ping'
                    : isRecording && isPaused
                    ? 'bg-amber-400'
                    : 'bg-zinc-400'
                }`}
              />
              <span className="text-[11px] font-black text-black">
                {isRecording
                  ? isPaused
                    ? 'Rekaman Dijeda (Pause)'
                    : 'Sedang Merekam Suara Sidang'
                  : recordedBlob
                  ? 'Rekaman Selesai (Siap Diproses)'
                  : 'Siap Merekam'}
              </span>
            </div>

            <div className="absolute top-3 right-4 font-mono text-xl font-black text-black bg-[#FFE600] border-2 border-black px-3 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000] tracking-wider">
              {formatTime(seconds)}
            </div>
          </div>

          {/* Recorder Transport Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-1">
            {!isRecording ? (
              <>
                <button
                  onClick={startLiveRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF6B6B] hover:bg-rose-500 text-black font-black rounded-xl text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Mic className="w-4 h-4 stroke-[2.5]" />
                  <span>{recordedBlob ? 'Rekam Ulang Voice Note' : 'Mulai Rekam Voice Note'}</span>
                </button>
                {recordedBlob && (
                  <button
                    onClick={resetRecording}
                    className="flex items-center gap-2 px-4 py-3 bg-[#FFFDF5] hover:bg-yellow-100 text-black font-black rounded-xl text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Reset</span>
                  </button>
                )}
              </>
            ) : (
              <>
                {!isPaused ? (
                  <button
                    onClick={pauseRecording}
                    className="flex items-center gap-2 px-5 py-3 bg-[#FFD93D] hover:bg-yellow-400 text-black font-black rounded-xl text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Pause className="w-4 h-4 stroke-[2.5]" />
                    <span>Jeda (Pause)</span>
                  </button>
                ) : (
                  <button
                    onClick={resumeRecording}
                    className="flex items-center gap-2 px-5 py-3 bg-[#4ECDC4] hover:bg-teal-400 text-black font-black rounded-xl text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lanjutkan (Resume)</span>
                  </button>
                )}

                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-zinc-800 text-white font-black rounded-xl text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Selesai Rekam</span>
                </button>
              </>
            )}
          </div>

          {/* Voice Note Player Preview */}
          {audioUrl && !isRecording && (
            <div className="p-4 bg-[#FFFDF5] border-2 border-black rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[3px_3px_0px_0px_#000]">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-9 h-9 rounded-xl bg-[#A7F3D0] border-2 border-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
                  <Volume2 className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xs font-black text-black">Pratinjau Voice Note Hasil Rekaman</p>
                  <p className="text-[10px] font-mono text-zinc-700 font-bold">Durasi: {formatTime(seconds)} • WebM Audio</p>
                </div>
              </div>
              <audio src={audioUrl} controls className="w-full sm:w-80 h-10 border-2 border-black rounded-xl" />
            </div>
          )}
        </div>
      )}

      {/* MODE 2: UNGGAH AUDIO / VN WHATSAPP DARI FILE */}
      {studioMode === 'upload' && (
        <div className="space-y-5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 sm:p-10 border-2 border-dashed border-black hover:bg-yellow-50 rounded-2xl bg-[#FFFDF5] transition-all cursor-pointer text-center space-y-3 shadow-[3px_3px_0px_0px_#000]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFD93D] border-2 border-black flex items-center justify-center mx-auto text-black shadow-[2px_2px_0px_0px_#000]">
              <FileAudio className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-sm font-black text-black">
                {selectedFile ? selectedFile.name : 'Pilih atau Tarik Berkas Voice Note / Audio ke Sini'}
              </p>
              <p className="text-xs text-zinc-700 font-medium mt-1">
                Format didukung: <strong className="text-black font-black">.mp3, .wav, .m4a, .ogg, .webm, .flac, .opus</strong>
              </p>
            </div>
            {selectedFile && (
              <span className="inline-block text-[11px] font-black text-black bg-[#A7F3D0] border-2 border-black px-3 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_0px_#000]">
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
            <div className="p-4 bg-[#FFFDF5] border-2 border-black rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[3px_3px_0px_0px_#000]">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-9 h-9 rounded-xl bg-[#38BDF8] border-2 border-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
                  <Volume2 className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-black truncate max-w-xs">
                    {selectedFile ? selectedFile.name : 'Audio Voice Note'}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-700 font-bold">Berkas audio siap diproses atau disimpan</p>
                </div>
              </div>
              <audio src={audioUrl} controls className="w-full sm:w-80 h-10 border-2 border-black rounded-xl" />
            </div>
          )}
        </div>
      )}

      {/* COMMON METADATA FORM: TITLE & SECRETARY STEERING NOTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t-2 border-black/10">
        <div className="space-y-1.5">
          <label htmlFor="recording-meeting-title" className="text-xs font-black text-black">
            Agenda / Judul Sesi Sidang:
          </label>
          <input
            id="recording-meeting-title"
            name="recording-meeting-title"
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="Contoh: Sidang Pleno Koordinasi Panitia LDKS 2026"
            className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-medium placeholder:text-zinc-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="recording-secretary-notes" className="text-xs font-black text-black flex items-center justify-between">
            <span>Catatan Pengarah Notulis (Arahan Format &amp; Keputusan):</span>
            <span className="text-[10px] font-black text-black bg-yellow-200 border border-black px-1.5 py-0.2 rounded shadow-[1px_1px_0px_0px_#000]">Panduan Diksi</span>
          </label>
          <textarea
            id="recording-secretary-notes"
            name="recording-secretary-notes"
            value={secretaryNotes}
            onChange={(e) => setSecretaryNotes(e.target.value)}
            rows={3}
            placeholder="Tuliskan arahan susunan kata: misal gaya bahasa formal MPK, tonjolkan rincian anggaran dana dan tenggat waktu tugas..."
            className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl px-3.5 py-2 text-xs text-black font-medium placeholder:text-zinc-500 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-black leading-relaxed resize-none font-sans"
          />
        </div>
      </div>

      {/* Quick Preset Pills for Secretary Notes */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-black text-black uppercase">Preset Arahan:</span>
        <button
          onClick={() =>
            setSecretaryNotes(
              'Gunakan tata bahasa formal keputusan pleno majelis, rujuk pasal AD/ART relevan, dan pastikan setiap klausul keputusan bernomor resmi.'
            )
          }
          className="px-3 py-1.5 bg-[#FFFDF5] hover:bg-yellow-100 text-black border-2 border-black rounded-xl text-[11px] font-bold shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          Formal &amp; Yuridis MPK 13
        </button>
        <button
          onClick={() =>
            setSecretaryNotes(
              'Buat ringkasan eksekutif padat 2 paragraf saja, fokuskan pada keputusan kunci dan hilangkan obrolan santai.'
            )
          }
          className="px-3 py-1.5 bg-[#FFFDF5] hover:bg-yellow-100 text-black border-2 border-black rounded-xl text-[11px] font-bold shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          Rangkuman Padat &amp; Tajam
        </button>
        <button
          onClick={() =>
            setSecretaryNotes(
              'Fokuskan pada pembahasan anggaran kas, rincian biaya pengadaan, dan persetujuan bendahara.'
            )
          }
          className="px-3 py-1.5 bg-[#FFFDF5] hover:bg-yellow-100 text-black border-2 border-black rounded-xl text-[11px] font-bold shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          Fokus Keputusan &amp; Anggaran Dana
        </button>
        <button
          onClick={() =>
            setSecretaryNotes(
              'Tekankan checklist pembagian tugas (Action Items), nama penanggung jawab per komisi, dan tenggat waktu pelaksanaan.'
            )
          }
          className="px-3 py-1.5 bg-[#FFFDF5] hover:bg-yellow-100 text-black border-2 border-black rounded-xl text-[11px] font-bold shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          Fokus Penugasan (PIC &amp; Deadline)
        </button>
      </div>

      {/* ACTION BUTTONS: SIMPAN DRAF ONLINE & PROSES AUDIOTEKS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t-2 border-black/10">
        <button
          onClick={handleSaveAsDraft}
          disabled={!meetingTitle && !recordedBlob && !selectedFile}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#A7F3D0] hover:bg-emerald-300 text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-40 cursor-pointer"
        >
          <Save className="w-4 h-4 text-black stroke-[2.5]" />
          <span>Simpan Sebagai Draf Online</span>
        </button>

        <button
          onClick={handleProcessUploadedAudio}
          disabled={isProcessing || (!selectedFile && !recordedBlob)}
          className="w-full sm:w-auto group flex items-center justify-center gap-3 px-7 py-3 bg-[#FFE600] hover:bg-[#ffd93d] text-black font-black text-xs sm:text-sm rounded-xl border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all disabled:opacity-40 cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black stroke-[2.5]" />
              <span className="font-mono text-xs">{processingStep}</span>
            </>
          ) : (
            <>
              <FileCheck2 className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Proses Audio &amp; Susun Risalah Sidang</span>
              <div className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3 stroke-[3]" />
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
