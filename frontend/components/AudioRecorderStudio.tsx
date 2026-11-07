'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Pause, RefreshCw, Upload, CheckCircle2, AlertCircle, Sparkles, Volume2 } from 'lucide-react';
import { AudioSegment } from '../lib/types';

interface AudioRecorderStudioProps {
  onDiarizationComplete: (segments: AudioSegment[], duration: number) => void;
}

export const AudioRecorderStudio: React.FC<AudioRecorderStudioProps> = ({ onDiarizationComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Timer effect
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

  // Visualizer loop
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#6366f1';
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

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Setup audio analyzer for waveform
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioCtx();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setIsPaused(false);
      setSeconds(0);
      drawWaveform();
    } catch (err: unknown) {
      console.error('Mic access error:', err);
      setErrorMessage('Tidak dapat mengakses mikrofon. Pastikan izin mikrofon telah diberikan di Android atau Browser.');
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

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const processWithVibeVoice = async () => {
    setIsProcessing(true);
    setProcessingStep('Mengirim buffer audio ke Microsoft VibeVoice Service...');
    
    // Simulate real VibeVoice ASR & Diarization stages
    setTimeout(() => {
      setProcessingStep('VibeVoice Tokenization (7.5 Hz ultra-low frame rate)...');
    }, 1200);

    setTimeout(() => {
      setProcessingStep('Menjalankan Joint Speaker Diarization & Timestamping...');
    }, 2400);

    setTimeout(() => {
      // Mocked high quality segments extracted from VibeVoice
      const generatedSegments: AudioSegment[] = [
        {
          id: 'vibe-1',
          speaker: 'Speaker 1 (Davin Maritza)',
          startTime: '00:00:05',
          endTime: '00:00:45',
          text: 'Rapat koordinasi MPK SMK Negeri 13 Bandung dibuka. Rekan-rekan sekalian, agenda kita hari ini berfokus pada evaluasi keterlaksanaan program kerja komisi dan pembagian penugasan LDKS.'
        },
        {
          id: 'vibe-2',
          speaker: 'Speaker 2 (Sekretaris)',
          startTime: '00:00:50',
          endTime: '00:01:30',
          text: 'Laporan notulen rapat sebelumnya telah disahkan dan diarsipkan di NotulenJMM. Semua berkas kehadiran telah diverifikasi kuorum.'
        },
        {
          id: 'vibe-3',
          speaker: 'Speaker 3 (Koordinator Lapangan)',
          startTime: '00:01:35',
          endTime: '00:02:15',
          text: 'Untuk persiapan logistik dan perlengkapan aula, izin tempat sudah disetujui pihak sarana prasarana sekolah.'
        },
        {
          id: 'vibe-4',
          speaker: 'Speaker 1 (Davin Maritza)',
          startTime: '00:02:20',
          endTime: '00:02:50',
          text: 'Bagus. Kita putuskan gladi bersih akan diadakan H-2 pelaksanaan. Sekretariat harap menyiapkan lembar konfirmasi narasumber.'
        }
      ];

      setIsProcessing(false);
      onDiarizationComplete(generatedSegments, seconds || 170);
    }, 3600);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Studio Perekam Rapat</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Live Capture
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Merekam suara rapat langsung dari HP Android / Laptop untuk diproses oleh Microsoft VibeVoice
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Durasi Rapat</span>
            <span className="font-mono text-2xl font-bold text-white tracking-wider">
              {formatTime(seconds)}
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Visualizer Canvas */}
      <div className="relative overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80 p-4 flex flex-col items-center justify-center min-h-[160px]">
        <canvas
          ref={canvasRef}
          width={600}
          height={120}
          className="w-full h-28 object-contain"
        />

        {!isRecording && !audioUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xs text-center p-4">
            <Mic className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
            <p className="text-sm font-medium text-slate-300">Mikrofon Siap Merekam</p>
            <p className="text-xs text-slate-500 max-w-sm mt-0.5">
              Tekan tombol Mulai Rekam di bawah untuk memulai pencatatan notulen otomatis
            </p>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-3 left-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-semibold text-rose-400">
              {isPaused ? 'Merekam (Jeda)' : 'Sedang Merekam Suara...'}
            </span>
          </div>
        )}
      </div>

      {/* Audio Playback if Recorded */}
      {audioUrl && !isRecording && (
        <div className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Rekaman Rapat Tersimpan</p>
              <p className="text-[11px] text-slate-400 font-mono">Total durasi: {formatTime(seconds)}</p>
            </div>
          </div>
          <audio src={audioUrl} controls className="h-8 max-w-[220px] sm:max-w-xs" />
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
            >
              <Mic className="w-4 h-4" />
              Mulai Rekam Rapat
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button
                  onClick={pauseRecording}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm active:scale-95 transition-all"
                >
                  <Pause className="w-4 h-4" />
                  Jeda
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4" />
                  Lanjut
                </button>
              )}

              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm active:scale-95 transition-all"
              >
                <Square className="w-4 h-4 text-rose-400" />
                Selesai Rekam
              </button>
            </>
          )}

          <button
            onClick={() => {
              setAudioUrl('mock-audio');
              setSeconds(170);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-all"
            title="Gunakan contoh audio simulasi rapat MPK"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simulasi Audio Rapat</span>
          </button>
        </div>

        {/* Process with VibeVoice Button */}
        {(audioUrl || seconds > 0) && !isRecording && (
          <button
            onClick={processWithVibeVoice}
            disabled={isProcessing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{processingStep}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Transkripsi & Diarisasi VibeVoice</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
