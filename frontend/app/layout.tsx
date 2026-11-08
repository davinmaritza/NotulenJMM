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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/logo-mpk.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFE600",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFDF5] text-black font-sans selection:bg-[#FFE600] selection:text-black pb-safe">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
