// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import { Meeting } from './types';
import { formatIndonesianDateTime } from './indonesianDate';

/**
 * Template Resmi: Rapat Pembentukan Panitia MPLS (Masa Pengenalan Lingkungan Sekolah)
 * SMK Negeri 13 Bandung
 */
export function createMplsMeetingTemplate(): Meeting {
  const now = new Date();
  const dateFormatted = formatIndonesianDateTime(now, '08:30', '11:45');

  return {
    id: `meet-mpls-${Date.now()}`,
    title: 'Rapat Pleno Pembentukan Panitia Masa Pengenalan Lingkungan Sekolah (MPLS) 2026/2027',
    date: dateFormatted,
    location: 'Ruang Sidang Majelis / Aula SMK Negeri 13 Bandung',
    organizer: 'MPK SMK Negeri 13 Bandung',
    status: 'FINALIZED',
    durationSeconds: 195 * 60,
    formatStandard: 'PEMBENTUKAN_PANITIA_MPLS',
    leaderName: 'Fikri Firmansyah (Presidium Sidang MPK 13)',
    noteTakerName: 'Davin Maritza (Notulis Sidang)',
    lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    attendees: [
      { id: 'att-1', name: 'Fikri Firmansyah', role: 'Leader', present: true },
      { id: 'att-2', name: 'Davin Maritza', role: 'Note Taker', present: true },
      { id: 'att-3', name: 'Muhammad Fajar', role: 'Member', present: true },
      { id: 'att-4', name: 'Siti Rahmawati', role: 'Member', present: true },
      { id: 'att-5', name: 'Annisa Putri', role: 'Member', present: true },
      { id: 'att-6', name: 'Raka Pratama', role: 'Member', present: true },
      { id: 'att-7', name: 'Ahmad Zaki', role: 'Member', present: true },
    ],
    transcript: [
      {
        id: 'tr-1',
        speaker: 'Pimpinan Sidang',
        startTime: '00:05',
        endTime: '01:20',
        text: 'Dengan mengucap bismillahirrahmanirrahim, Sidang Pleno Pembentukan Panitia MPLS SMK Negeri 13 Bandung tahun ajaran 2026/2027 resmi dibuka.',
      },
      {
        id: 'tr-2',
        speaker: 'Notulis Sidang',
        startTime: '01:25',
        endTime: '02:40',
        text: 'Notulensi mencatat kehadiran seluruh perwakilan komisi telah mencapai kuorum sah persidangan majelis.',
      },
      {
        id: 'tr-3',
        speaker: 'Muhammad Fajar',
        startTime: '02:45',
        endTime: '04:10',
        text: 'Kami mengajukan struktur divisi inti: Ketua Pelaksana, Sekretaris, Bendahara, Divisi Acara, Tatib/Disiplin, Logistik, Humas, Medis/PMR, dan Konsumsi dengan fokus kegiatan ramah anak.',
      },
    ],
    mostImportant:
      'Struktur Panitia Inti dan 6 Koordinator Divisi MPLS 2026/2027 disahkan secara aklamasi, dengan mandat penuh menyusun modul kegiatan ramah anak dan bebas dari segala bentuk perpeloncoan sesuai petunjuk teknis Disdik Jawa Barat.',
    executiveSummary:
      'Sidang Pleno MPK SMK Negeri 13 Bandung secara resmi mengesahkan susunan Panitia Masa Pengenalan Lingkungan Sekolah (MPLS) Tahun Ajaran 2026/2027. Sidang menetapkan Muhammad Fajar sebagai Ketua Pelaksana terpilih beserta 6 koordinator divisi operasional, menyetujui estimasi pagu anggaran operasional sebesar Rp 8.750.000, serta menginstruksikan seluruh koordinator menyelesaikan proposal dan rundown kegiatan paling lambat 16 November 2026.',
    agendas: [
      {
        title: 'Pembentukan Struktur Panitia Inti MPLS 2026/2027',
        discussionPoints: [
          'Pengesahan Ketua Pelaksana: Muhammad Fajar (Delegasi MPK/OSIS).',
          'Pengesahan Sekretaris Pelaksana: Siti Rahmawati dan Bendahara: Annisa Putri.',
          'Penetapan mekanisme jalur komando, koordinasi harian, dan pertanggungjawaban panitia.',
        ],
      },
      {
        title: 'Penetapan Koordinator Divisi & Rincian Tugas (Job Description)',
        discussionPoints: [
          'Divisi Acara & Edukasi (Koord: Raka Pratama): Penanggung jawab rundown, ice-breaking, dan pengenalan wawasan wiyata mandala.',
          'Divisi Ketertiban & Disiplin (Koord: Dimas Aditya): Penegakan tata tertib positif, pengawasan lingkungan sekolah, dan protokol zero-bullying.',
          'Divisi Logistik & Sarana (Koord: Ahmad Zaki): Kesiapan ruang aula, sound system, proyektor, dan dekorasi spanduk selamat datang.',
          'Divisi Humas & Publikasi (Koord: Nabila Azzahra): Dokumentasi media sosial resmi sekolah dan kanal informasi orang tua siswa baru.',
          'Divisi Medis & PMR (Koord: Sarah Maulida): Kesiapan tenda posko darurat dan pasokan P3K.',
          'Divisi Konsumsi (Koord: Zahra Amelia): Alokasi distribusi konsumsi makan siang dan air minum panitia serta pembina.',
        ],
      },
      {
        title: 'Pengesahan Pagu Rencana Anggaran Biaya (RAB) MPLS',
        discussionPoints: [
          'Total pagu anggaran operasional disetujui sebesar Rp 8.750.000 bersumber dari anggaran kesiswaan sekolah dan kas OSIS/MPK.',
          'Pengadaan tanda pengenal (ID Card) ramah lingkungan serta buku panduan pengenalan jurusan.',
        ],
      },
      {
        title: 'Jadwal Sosialisasi, Pembekalan, dan Gladi Bersih Lapangan',
        discussionPoints: [
          'Rapat koordinasi teknis bersama Pembina Kesiswaan dijadwalkan pada 20 November 2026.',
          'Gladi bersih lapangan serentak seluruh divisi dilaksanakan H-2 sebelum hari pertama pelaksanaan MPLS.',
        ],
      },
    ],
    decisions: [
      {
        id: `dec-mpls-1`,
        number: `KEP/001/MPK-13/MPLS/XI/2026`,
        decisionText:
          'Mengesahkan susunan Panitia Inti serta 6 Koordinator Divisi MPLS SMK Negeri 13 Bandung Tahun Ajaran 2026/2027 secara aklamasi.',
        rationale:
          'Memberikan legalitas hukum persidangan dan membagi tugas penanggung jawab resmi pelaksanaan masa orientasi siswa baru.',
        category: 'Organisasi',
        status: 'DISAHKAN',
        date: '2026-11-09',
      },
      {
        id: `dec-mpls-2`,
        number: `KEP/002/MPK-13/MPLS/XI/2026`,
        decisionText:
          'Menyetujui alokasi pagu anggaran operasional MPLS 2026/2027 sebesar Rp 8.750.000 dengan prinsip akuntabilitas dan efisiensi belanja.',
        rationale:
          'Menjamin ketersediaan sarana logistik, konsumsi, dan posko kesehatan tanpa membebankan pungutan liar kepada siswa baru.',
        category: 'Keuangan',
        status: 'DISAHKAN',
        date: '2026-11-09',
      },
      {
        id: `dec-mpls-3`,
        number: `KEP/003/MPK-13/MPLS/XI/2026`,
        decisionText:
          'Mewajibkan seluruh kegiatan MPLS berorientasi pada nilai edukatif ramah anak, penanaman karakter disiplin sekolah, dan larangan keras perpeloncoan.',
        rationale:
          'Menegakkan kepatuhan terhadap Permendikbud dan petunjuk teknis Disdik Jawa Barat tentang pencegahan kekerasan di lingkungan pendidikan.',
        category: 'Disiplin',
        status: 'DISAHKAN',
        date: '2026-11-09',
      },
    ],
    actionItems: [
      {
        id: `act-mpls-1`,
        description: 'Penyusunan naskah proposal resmi kegiatan MPLS 2026 dan pengajuan disposisi Kepala Sekolah',
        assignee: 'Muhammad Fajar (Ketua Pelaksana)',
        dueDate: '2026-11-16',
        status: 'IN_PROGRESS',
      },
      {
        id: `act-mpls-2`,
        description: 'Finalisasi rundown acara per hari dan penyiapan materi pemateri wawasan kejuruan',
        assignee: 'Raka Pratama (Koord. Acara)',
        dueDate: '2026-11-18',
        status: 'PENDING',
      },
      {
        id: `act-mpls-3`,
        description: 'Pengecekan fasilitas tata suara aula dan kelengkapan proyektor ke sarana prasarana',
        assignee: 'Ahmad Zaki (Koord. Logistik)',
        dueDate: '2026-11-20',
        status: 'PENDING',
      },
      {
        id: `act-mpls-4`,
        description: 'Survei percetakan tanda pengenal siswa baru bahan ramah lingkungan',
        assignee: 'Annisa Putri (Bendahara)',
        dueDate: '2026-11-17',
        status: 'PENDING',
      },
    ],
  };
}

/**
 * Registry Template Sidang MPK
 */
export const OFFICIAL_MEETING_TEMPLATES = [
  {
    id: 'panitia-mpls',
    title: 'Pembentukan Panitia MPLS',
    badge: 'Kepanitiaan Khusus',
    description: 'Struktur panitia MPLS, pembagian divisi, estimasi anggaran, dan rundown ramah anak',
    create: createMplsMeetingTemplate,
  },
];
