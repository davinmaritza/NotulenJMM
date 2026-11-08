'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Pause, RefreshCw, Upload, AlertCircle, Volume2 } from 'lucide-react';
import { AudioSegment } from '../lib/types';
import { transcribeAudioApi } from '@/lib/api';

interface AudioRecorderStudioProps {
  onDiarizationComplete: (segments: AudioSegment[], duration: number) => void;
}

export const AudioRecorderStudio: React.FC<AudioRecorderStudioProps> = ({ onDiarizationComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
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

  // Visualizer loop (Oscilloscope style)
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = '#090a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle center guide line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Oscilloscope audio waveform
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#38bdf8';
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

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Stop stream tracks
        stream.getTracks().forEach((track) => track.stop());
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      setSeconds(0);
      drawWaveform();
    } catch (err: unknown) {
      console.error('Error accessing microphone:', err);
      setErrorMessage(
        'Gagal mengakses mikrofon. Pastikan izin mikrofon telah diberikan di browser atau perangkat Anda.'
      );
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        drawWaveform();
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const handleProcessAudio = async () => {
    if (!recordedBlob) return;

    setIsProcessing(true);
    setProcessingStep('Mengirim audio ke backend VibeVoice...');
    setErrorMessage(null);

    try {
      setProcessingStep('Microsoft VibeVoice: Menjalankan ekualisasi dan diarization pembicara...');
      const response = await transcribeAudioApi(recordedBlob);

      setProcessingStep('Selesai! Menampilkan transkripsi terstruktur...');
      onDiarizationComplete(response.segments, response.durationSeconds);
    } catch (err: unknown) {
      console.error('Transcription error:', err);
      setErrorMessage('Gagal memproses transkripsi audio melalui VibeVoice. Silakan periksa koneksi backend.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRecordedBlob(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setSeconds(180);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#111318] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-white tracking-tight">Studio Perekam Suara Rapat</h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/[0.05] text-zinc-300 border border-white/[0.08]">
              48kHz PCM
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Merekam audio rapat secara real-time dengan visualisasi gelombang presisi sebelum diolah oleh VibeVoice
          </p>
        </div>

        {/* Upload Audio File fallback */}
        <label className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] rounded-xl text-xs font-semibold cursor-pointer active:scale-[0.98] transition-all self-start sm:self-auto">
          <Upload className="w-3.5 h-3.5 text-zinc-400" />
          <span>Unggah File Audio</span>
          <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Recording Console Canvas & Timer */}
      <div className="p-6 bg-[#090a0f] border border-white/[0.06] rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? (isPaused ? 'bg-amber-400' : 'bg-rose-500 ring-4 ring-rose-500/20') : 'bg-zinc-700'}`} />
            <span className="text-zinc-400 uppercase tracking-wider text-[10px]">
              {isRecording ? (isPaused ? 'TERJEDA' : 'MEREKAM LIVE') : 'SIAP MEREKAM'}
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            {formatTime(seconds)}
          </div>
        </div>

        {/* Oscilloscope Canvas */}
        <div className="h-28 w-full bg-[#090a0f] border border-white/[0.05] rounded-xl overflow-hidden relative">
          <canvas ref={canvasRef} width={800} height={120} className="w-full h-full block" />
          {!isRecording && !audioUrl && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-600 font-mono">
              Gelombang audio akan muncul saat mikrofon aktif
            </div>
          )}
        </div>

        {/* Hardware Controls Bar */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-2.5 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-lg active:scale-[0.98] transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Mulai Rekam Suara</span>
            </button>
          ) : (
            <>
              <button
                onClick={pauseRecording}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 rounded-xl text-xs font-semibold active:scale-[0.98] transition-all"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'Lanjutkan' : 'Jeda'}</span>
              </button>

              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold active:scale-[0.98] transition-all border border-white/10"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Selesai & Kunci Audio</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Audio Playback & Process Section */}
      {audioUrl && (
        <div className="p-5 bg-black/40 border border-white/[0.06] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Volume2 className="w-4 h-4 text-sky-400" />
              <span>Pratinjau Hasil Audio Rapat</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              Format: audio/webm • Siap dikirim ke pipeline Microsoft VibeVoice
            </p>
            <audio src={audioUrl} controls className="mt-2 w-full max-w-md h-9" />
          </div>

          <button
            onClick={handleProcessAudio}
            disabled={isProcessing}
            className="group flex items-center justify-center gap-3 px-6 py-2.5 bg-white text-zinc-950 font-semibold text-xs rounded-xl shadow-md hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer self-stretch md:self-auto shrink-0"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="font-mono text-[11px]">{processingStep}</span>
              </>
            ) : (
              <>
                <span>Jalankan Diarisasi VibeVoice</span>
                <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <span className="text-[10px] font-bold">→</span>
                </div>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
