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
  const [audioDevices, setAudioDevices] = useState<{ deviceId: string; label: string }[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('default');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<string>('');

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
  const recognitionRef = useRef<any>(null);

  // Enumerate input devices on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const inputs = devices
            .filter((d) => d.kind === 'audioinput')
            .map((d) => ({
              deviceId: d.deviceId,
              label: d.label || 'Mikrofon Perangkat',
            }));
          setAudioDevices(inputs);
        })
        .catch((e) => console.warn('Could not enumerate audio devices:', e));
    }
  }, []);

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

  // Waveform oscilloscope loop & VU Level calculation
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);

    // Calculate real-time RMS audio level for VU meter
    let sumSquares = 0;
    for (let i = 0; i < bufferLength; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sumSquares += normalized * normalized;
    }
    const rms = Math.sqrt(sumSquares / bufferLength);
    const calculatedLevel = Math.min(100, Math.round(rms * 400));
    setAudioLevel(calculatedLevel);

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
    setAudioLevel(0);

    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: selectedDeviceId !== 'default' ? { exact: selectedDeviceId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Update audio devices with labels once permission is granted
      if (navigator.mediaDevices?.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const inputs = devices
            .filter((d) => d.kind === 'audioinput')
            .map((d) => ({
              deviceId: d.deviceId,
              label: d.label || 'Mikrofon Perangkat',
            }));
          setAudioDevices(inputs);
        });
      }

      const audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 2048;

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      let options: MediaRecorderOptions = {};
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          options = { mimeType: 'audio/webm;codecs=opus' };
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm' };
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4' };
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || options.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordedBlob(audioBlob);
        setAudioLevel(0);

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
          const nowTitle = `Notulensi Suara Sidang MPK ${new Date().toLocaleDateString('id-ID', {
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

      // Initialize real-time browser Speech Recognition if available
      if (typeof window !== 'undefined') {
        const SpeechRecognition =
          (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
          (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;
        if (SpeechRecognition) {
          try {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'id-ID';
            recognition.onresult = (event: any) => {
              let text = '';
              for (let i = 0; i < event.results.length; i++) {
                text += event.results[i][0].transcript + ' ';
              }
              const clean = text.trim();
              if (clean) {
                setLiveTranscript(clean);
              }
            };
            recognition.onerror = (e: any) => {
              console.warn('SpeechRecognition notice:', e);
            };
            recognition.start();
            recognitionRef.current = recognition;
          } catch (e) {
            console.warn('Could not start SpeechRecognition:', e);
          }
        }
      }

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
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch {}
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    }
  };

  const resetRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setIsPaused(false);
    setSeconds(0);
    setAudioUrl(null);
    setRecordedBlob(null);
    setLiveTranscript('');
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
      setErrorMessage('Pilih atau rekam berkas suara sidang terlebih dahulu.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Mengunggah rekaman suara sidang ke server transkripsi AI...');
    setErrorMessage(null);
    setDraftToast(null);

    try {
      setProcessingStep('Melakukan speech recognition & pemisahan pembicara...');
      const response = await transcribeAudioApi(
        audioToProcess,
        undefined,
        selectedFile ? selectedFile.name : `rekaman-vn-${Date.now()}.webm`,
        liveTranscript || undefined
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
              Notulensi Berbasis Voice &amp; Perekaman Sidang
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFD93D] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              AD/ART MPK NBAP
            </span>
          </div>
          <p className="text-xs text-zinc-700 font-medium mt-1 font-sans">
            Perekaman suara langsung (Voice) dan transkripsi cerdas naskah dinas resmi MPK SMK Negeri 13 Bandung
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
            <span>Rekam Suara Sidang (Voice)</span>
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
            <span>Unggah Berkas Suara</span>
          </button>
        </div>
      </div>

      {/* Friendly Secretary Help Box */}
      <div className="p-4 rounded-2xl bg-[#E0F2FE] border-2 border-black shadow-[3.5px_3.5px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-black stroke-[2.5] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-black text-black">Petunjuk Notulis &amp; Sekretaris Sidang MPK:</p>
            <p className="text-zinc-800 font-medium leading-relaxed text-[11px]">
              Sesuai Tupoksi Sekretaris MPK NBAP: Letakkan mikrofon/perangkat di tengah meja sidang. Notulensi Berbasis Voice akan menangkap suara pimpinan sidang, interupsi fraksi, pandangan komisi, dan konsiderans putusan. Klik <strong>Jeda (Pause)</strong> saat pimpinan mengetuk palu skorsing sidang.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => {
              const todayStr = new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });
              setMeetingTitle(`Sidang Pleno / Koordinasi MPK 13 — ${todayStr}`);
            }}
            className="px-3.5 py-1.5 bg-[#C4B5FD] hover:bg-[#b5a3fc] text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Isi Judul Sidang Hari Ini
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
        <div className="space-y-4">
          {/* Microphone Selector & Live VU Meter */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000]">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Mic className="w-4 h-4 text-black shrink-0 stroke-[2.5]" />
              <label htmlFor="mic-device-select" className="text-xs font-black text-black shrink-0">
                Pilih Input Mikrofon:
              </label>
              <select
                id="mic-device-select"
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                disabled={isRecording}
                className="bg-[#FFFDF5] border border-black rounded-lg px-2.5 py-1 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#FFE600] truncate max-w-[200px] sm:max-w-[260px]"
              >
                <option value="default">Default Sistem ({audioDevices[0]?.label || 'Mikrofon'})</option>
                {audioDevices.filter(d => d.deviceId !== 'default').map((d, idx) => (
                  <option key={d.deviceId || idx} value={d.deviceId}>
                    {d.label || `Mikrofon ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Volume / VU Level Bar */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono font-bold text-zinc-600">Sinyal Suara:</span>
              <div className="w-24 sm:w-32 h-3 bg-zinc-200 border border-black rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-75 ${
                    audioLevel > 50 ? 'bg-amber-500' : audioLevel > 5 ? 'bg-emerald-500' : 'bg-zinc-400'
                  }`}
                  style={{ width: `${isRecording && !isPaused ? Math.max(audioLevel, 6) : 0}%` }}
                />
              </div>
              <span
                className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded border border-black ${
                  isRecording && !isPaused && audioLevel > 5
                    ? 'bg-[#A7F3D0] text-black'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {isRecording && !isPaused ? (audioLevel > 5 ? 'AKTIF' : 'HENING') : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Silence Warning Notice */}
          {isRecording && !isPaused && seconds > 3 && audioLevel < 2 && (
            <div className="p-3 bg-amber-50 border-2 border-black rounded-xl text-xs font-bold text-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
              <span>
                Sinyal mikrofon hening / sangat kecil. Jika tidak ada suara, coba pilih sumber mikrofon lain di menu atas atau periksa volume mic di pengaturan suara.
              </span>
            </div>
          )}

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

          {/* Live Real-time Transcribed Words Badge & Editor */}
          {(liveTranscript || recordedBlob) && (
            <div className="p-3 bg-[#FFFDF5] border-2 border-black rounded-xl text-xs font-bold text-black flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-[2px_2px_0px_0px_#000] animate-in fade-in">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="bg-[#FFE600] px-2 py-0.5 rounded border border-black text-[10px] uppercase font-black shrink-0 tracking-wider">
                  Ucapan Terdeteksi
                </span>
                <input
                  type="text"
                  value={liveTranscript}
                  onChange={(e) => setLiveTranscript(e.target.value)}
                  placeholder="Ucapan yang terdeteksi muncul di sini (dapat Anda edit jika ada salah dengar)..."
                  className="bg-transparent border-b border-black/30 focus:border-black focus:outline-none text-xs text-zinc-900 font-semibold font-mono w-full px-1 py-0.5"
                />
              </div>
              <span className="text-[10px] text-zinc-500 font-medium shrink-0">
                (Bisa diedit langsung)
              </span>
            </div>
          )}

          {/* Recorder Transport Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-1">
            {!isRecording ? (
              <>
                <button
                  onClick={startLiveRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF6B6B] hover:bg-rose-500 text-black font-black rounded-xl text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Mic className="w-4 h-4 stroke-[2.5]" />
                  <span>{recordedBlob ? 'Rekam Ulang Suara Sidang' : 'Mulai Perekaman Suara Sidang (Voice)'}</span>
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

          {/* Voice Player Preview */}
          {audioUrl && !isRecording && (
            <div className="p-4 bg-[#FFFDF5] border-2 border-black rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[3px_3px_0px_0px_#000]">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-9 h-9 rounded-xl bg-[#A7F3D0] border-2 border-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
                  <Volume2 className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xs font-black text-black">Pratinjau Rekaman Suara Sidang (Voice)</p>
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
                {selectedFile ? selectedFile.name : 'Pilih atau Tarik Berkas Rekaman Suara Sidang (Voice / Audio) ke Sini'}
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
                    {selectedFile ? selectedFile.name : 'Rekaman Suara Sidang (Voice)'}
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
