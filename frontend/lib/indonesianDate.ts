// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.

export const INDONESIAN_DAYS = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/**
 * Memformat tanggal ke standar resmi tata naskah dinas Indonesia
 * Contoh: "Senin, 09 November 2026"
 */
export function formatIndonesianDate(inputDate?: Date | string | null): string {
  const d = inputDate ? new Date(inputDate) : new Date();
  if (isNaN(d.getTime())) return 'Senin, 09 November 2026';

  const dayName = INDONESIAN_DAYS[d.getDay()];
  const dateNum = String(d.getDate()).padStart(2, '0');
  const monthName = INDONESIAN_MONTHS[d.getMonth()];
  const year = d.getFullYear();

  return `${dayName}, ${dateNum} ${monthName} ${year}`;
}

/**
 * Memformat tanggal dan jam lengkap standar risalah rapat MPK
 * Contoh: "Senin, 09 November 2026 • 09:00 - 11:30 WIB"
 */
export function formatIndonesianDateTime(
  inputDate?: Date | string | null,
  startTime: string = '09:00',
  endTime: string = '11:30'
): string {
  const dateFormatted = formatIndonesianDate(inputDate);
  const timeFormatted = `${startTime} - ${endTime} WIB`;
  return `${dateFormatted} • ${timeFormatted}`;
}

/**
 * Menghasilkan string waktu saat ini
 * Contoh: "10:15 WIB"
 */
export function getIndonesianCurrentTime(): string {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes} WIB`;
}

/**
 * Pilihan tanggal cepat untuk sidang MPK
 */
export function getQuickDatePresets(): { label: string; formatted: string }[] {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      label: 'Hari Ini (Pagi)',
      formatted: formatIndonesianDateTime(now, '09:00', '11:30'),
    },
    {
      label: 'Hari Ini (Siang/Sepulang Sekolah)',
      formatted: formatIndonesianDateTime(now, '13:30', '15:30'),
    },
    {
      label: 'Besok',
      formatted: formatIndonesianDateTime(tomorrow, '09:00', '11:30'),
    },
    {
      label: 'Minggu Depan',
      formatted: formatIndonesianDateTime(nextWeek, '09:00', '11:30'),
    },
  ];
}
