import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NotulenJMM — Sistem Notulen & Transkripsi Cerdas",
  description: "Sistem cerdas manajemen notulen rapat, transkripsi suara VibeVoice, dan perumusan keputusan 9router untuk MPK SMK Negeri 13 Bandung oleh Davin Maritza.",
  applicationName: "NotulenJMM",
  authors: [{ name: "Davin Maritza" }],
  creator: "Davin Maritza",
  publisher: "MPK SMK Negeri 13 Bandung",
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

import { AppProviders } from '../components/AppProviders';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#07080a] text-slate-100 font-sans selection:bg-white/10 selection:text-white pb-safe">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
