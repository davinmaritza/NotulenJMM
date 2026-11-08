'use client';
// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileQuestion,
  Home,
  BookOpen,
  Compass,
  Mic,
  ArrowLeft,
  Sparkles,
  CheckSquare,
} from 'lucide-react';
import { useMeetings } from '../context/MeetingContext';

export default function NotFoundPage() {
  const router = useRouter();
  const { openBeginnerGuide } = useMeetings();

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-8 space-y-6">
      {/* Main 404 Neobrutalist Container */}
      <div className="bg-white border-[3px] border-black rounded-3xl p-6 sm:p-10 md:p-12 shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] text-center space-y-6 relative overflow-hidden">
        {/* Background Decorative Grid Stamp */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFE600] border-2 border-black text-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_#000]">
          <span>STATUS: 404 NOT FOUND</span>
          <span>•</span>
          <span>RISALAH TIDAK DITEMUKAN</span>
        </div>

        {/* Big Graphic & 404 Headline */}
        <div className="space-y-4 max-w-lg mx-auto">
          <div className="relative inline-block">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#FF6B6B] border-[3px] border-black flex items-center justify-center text-white shadow-[4px_4px_0px_0px_#000] mx-auto">
              <FileQuestion className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-lg bg-[#FFE600] border-2 border-black text-black font-black text-xs shadow-[2px_2px_0px_0px_#000]">
              404
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tight leading-tight">
              Halaman atau Dokumen Sidang Tidak Ditemukan
            </h1>
            <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
              Tautan atau dokumen yang Anda cari mungkin telah dipindahkan, diarsipkan, atau alamat tautan URL salah diketik. Seluruh data notulensi rapat Anda di sistem tetap aman.
            </p>
          </div>
        </div>

        {/* Action Buttons Hub */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-100 text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Kembali ke Halaman Sebelumnya</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFE600] hover:bg-[#ffd93d] text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
            <span>Ke Beranda (Studio Agenda)</span>
          </Link>

          <button
            type="button"
            onClick={openBeginnerGuide}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#A7F3D0] hover:bg-emerald-300 text-black border-2 border-black rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Buka Panduan Pemula</span>
          </button>
        </div>

        {/* Fast Directory Cards */}
        <div className="pt-6 border-t-2 border-black/10 text-left">
          <p className="text-[11px] font-mono font-black text-black uppercase tracking-wider text-center sm:text-left mb-3">
            Pintasan Menu Utama NotulenJMM:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/"
              className="p-3 bg-[#FFFDF5] hover:bg-white border-2 border-black rounded-2xl shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group flex items-start gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-[#38BDF8] border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[1px_1px_0px_0px_#000]">
                <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-black group-hover:underline">Studio Agenda</p>
                <p className="text-[10px] text-zinc-600 font-medium truncate">Pilih format &amp; agenda</p>
              </div>
            </Link>

            <Link
              href="/notulen"
              className="p-3 bg-[#FFFDF5] hover:bg-white border-2 border-black rounded-2xl shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group flex items-start gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-[#4ECDC4] border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[1px_1px_0px_0px_#000]">
                <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-black group-hover:underline">Editor Risalah</p>
                <p className="text-[10px] text-zinc-600 font-medium truncate">Edit &amp; ekspor dinas</p>
              </div>
            </Link>

            <Link
              href="/record"
              className="p-3 bg-[#FFFDF5] hover:bg-white border-2 border-black rounded-2xl shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group flex items-start gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-[#FF6B6B] border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[1px_1px_0px_0px_#000]">
                <Mic className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-black group-hover:underline">Voice Note</p>
                <p className="text-[10px] text-zinc-600 font-medium truncate">Rekam suara rapat</p>
              </div>
            </Link>

            <Link
              href="/tasks"
              className="p-3 bg-[#FFFDF5] hover:bg-white border-2 border-black rounded-2xl shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group flex items-start gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-[#FEF08A] border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[1px_1px_0px_0px_#000]">
                <CheckSquare className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-black group-hover:underline">Ketetapan &amp; PIC</p>
                <p className="text-[10px] text-zinc-600 font-medium truncate">Daftar tugas tindak lanjut</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
