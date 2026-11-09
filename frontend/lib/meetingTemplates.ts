// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import { Meeting } from './types';
import { formatIndonesianDateTime } from './indonesianDate';

/**
 * Template Resmi: Musyawarah Besar (MUBES) MPK Nawadasha Bhakti Amita Paramartha
 * SMK Negeri 13 Bandung (Berdasarkan AD/ART Bab III Pasal 10-12)
 */
export function createMubesMeetingTemplate(): Meeting {
  const now = new Date();
  const dateFormatted = formatIndonesianDateTime(now, '08:00', '15:30');

  return {
    id: `meet-mubes-${Date.now()}`,
    title: 'Musyawarah Besar (MUBES) Pengesahan AD/ART & Program Kerja MPK NBAP 2025/2026',
    date: dateFormatted,
    location: 'Aula Utama SMK Negeri 13 Bandung',
    organizer: 'MPK Nawadasha Bhakti Amita Paramartha SMK Negeri 13 Bandung',
    status: 'FINALIZED',
    durationSeconds: 270 * 60,
    formatStandard: 'TATA_NASKAH_DINAS',
    leaderName: 'Shafa Na’ila Hasna (Ketua MPK / Pimpinan MUBES)',
    noteTakerName: 'Praya Nuri Fairuuz & Davin Maritza (JMM)',
    lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    attendees: [
      { id: 'att-m-1', name: 'Shafa Na’ila Hasna', role: 'Leader', present: true },
      { id: 'att-m-2', name: 'Praya Nuri Fairuuz', role: 'Note Taker', present: true },
      { id: 'att-m-3', name: 'Zafana Alaiqa Zachwan', role: 'Member', present: true },
      { id: 'att-m-4', name: 'Muhammad Imam Mulhakim', role: 'Member', present: true },
      { id: 'att-m-5', name: 'Restu Noor Aditia Rae', role: 'Member', present: true },
      { id: 'att-m-6', name: 'Danis Ferdiansyah', role: 'Member', present: true },
      { id: 'att-m-7', name: 'Davin Maritza', role: 'Member', present: true },
      { id: 'att-m-8', name: 'Tessa Eka Yuniar, S.Pd.', role: 'Guest', present: true },
    ],
    transcript: [
      {
        id: 'tr-m-1',
        speaker: 'Pimpinan MUBES',
        startTime: '00:05',
        endTime: '01:30',
        text: 'Dengan memohon petunjuk Tuhan Yang Maha Esa dan menjunjung asas musyawarah mufakat, Musyawarah Besar MPK Nawadasha Bhakti Amita Paramartha SMK Negeri 13 Bandung masa jabatan 2025/2026 resmi dibuka.',
      },
      {
        id: 'tr-m-2',
        speaker: 'Notulis Sidang',
        startTime: '01:35',
        endTime: '02:50',
        text: 'Presensi mencatat kehadiran seluruh perwakilan komisi dan DK MPK telah memenuhi kuorum sah persidangan sebagaimana diatur dalam Pasal 12 ART.',
      },
      {
        id: 'tr-m-3',
        speaker: 'Restu Noor Aditia Rae',
        startTime: '03:00',
        endTime: '04:45',
        text: 'Komisi C mengusulkan integrasi platform aspirasi digital AKSARA dan modul risalah terpusat JMM agar penyaluran aspirasi siswa ke OSIS terdokumentasi akuntabel.',
      },
    ],
    mostImportant:
      'Pengesahan secara resmi Anggaran Dasar (AD), Anggaran Rumah Tangga (ART), dan Garis Besar Program Kerja MPK Nawadasha Bhakti Amita Paramartha (NBAP) Periode 2025/2026 sebagai landasan hukum legislatif sekolah tertinggi.',
    executiveSummary:
      'Musyawarah Besar (MUBES) MPK SMK Negeri 13 Bandung Periode 2025/2026 telah terlaksana secara khidmat dan sah memenuhi kuorum. Sidang berhasil menetapkan Anggaran Dasar (AD) terdiri dari 9 Bab, Anggaran Rumah Tangga (ART) terdiri dari 8 Bab, serta mengesahkan tata kerja 3 Komisi (Komisi A: Pengawasan OSIS, Komisi B: Tata Kelola Ekskul, Komisi C: Aspirasi Siswa & Media). Seluruh draf ketetapan disahkan secara aklamasi.',
    agendas: [
      {
        title: 'Pembacaan dan Pengesahan Anggaran Dasar (AD) MPK NBAP 2025/2026',
        discussionPoints: [
          'Penetapan asas organisasi berlandaskan Pancasila, UUD 1945, dan UU No. 20 Tahun 2003.',
          'Penetapan struktur kepengurusan: Ketua, Wakil Ketua, Sekretaris, Bendahara, Komisi A, Komisi B, dan Komisi C.',
          'Penetapan wewenang legislatif majelis dalam penerapan prinsip Check & Balance.',
        ],
      },
      {
        title: 'Pembahasan Anggaran Rumah Tangga (ART) & Forum Lembaga (Bab III)',
        discussionPoints: [
          'Pengesahan tata tertib MUBES, Sidang Pleno, Persidangan MPK/OSIS, Sidang GBHK, dan Rapat Delegasi Ekskul.',
          'Penegakan hak suara, hak bicara, serta mekanisme voting jika musyawarah mufakat belum tercapai.',
          'Penetapan wewenang Komisi A dalam penyelenggaraan Sidang Pleno I, II, dan III terhadap OSIS.',
        ],
      },
      {
        title: 'Pengesahan Program Kerja Tri Mitra & 3 Komisi Kerja',
        discussionPoints: [
          'Program Tri Mitra: Pemilihan Ketua OSIS/MPK Berbasis IT, Studi Banding, dan Kotak Saran Digital.',
          'Program Komisi A: Pengawasan Sidang Pleno OSIS, Sidang GBHK, dan Pengelolaan JMM Komisi A.',
          'Program Komisi B: Rapat Delegasi Ekskul berkala, penjadwalan lapangan (Planner), dan monitoring presensi.',
          'Program Komisi C: Program AKSARA, survei LSM, Aspiration Day Porak/Porseni, dan pengelolaan medsos resmi.',
        ],
      },
    ],
    decisions: [
      {
        id: `dec-mubes-1`,
        number: `TAP/001/MUBES-MPK/XI/2025`,
        decisionText:
          'Mengesahkan Anggaran Dasar (AD) dan Anggaran Rumah Tangga (ART) MPK Nawadasha Bhakti Amita Paramartha SMK Negeri 13 Bandung Masa Bakti 2025/2026.',
        rationale:
          'Menjadi payung hukum resmi tata kelola organisasi, etika persidangan, dan fungsi representasi majelis perwakilan kelas.',
        category: 'Organisasi',
        status: 'DISAHKAN',
        date: '2025-11-09',
      },
      {
        id: `dec-mubes-2`,
        number: `TAP/002/MUBES-MPK/XI/2025`,
        decisionText:
          'Mengesahkan Garis Besar Program Kerja Tri Mitra, Komisi A, Komisi B, dan Komisi C Periode 2025/2026.',
        rationale:
          'Menjamin kesinambungan pelaksanaan mandat aspirasi siswa dan pengawasan terstruktur terhadap eksekutif OSIS dan ekskul.',
        category: 'Program Kerja',
        status: 'DISAHKAN',
        date: '2025-11-09',
      },
    ],
    actionItems: [
      {
        id: `act-mubes-1`,
        description: 'Penyusunan naskah final buku saku AD/ART dan sosialisasi ke seluruh ketua kelas',
        assignee: 'Praya Nuri Fairuuz (Sekretaris MPK)',
        dueDate: '2025-11-18',
        status: 'IN_PROGRESS',
      },
      {
        id: `act-mubes-2`,
        description: 'Perekaman seluruh TAP dan KEP resmi ke dalam registri digital NotulenJMM',
        assignee: 'Davin Maritza (Jalur Menyurat MPK)',
        dueDate: '2025-11-14',
        status: 'IN_PROGRESS',
      },
    ],
  };
}

/**
 * Template Resmi: Sidang Pleno Pengawasan OSIS (Komisi A)
 * Berdasarkan ART Bab III Pasal 13-15 & Tupoksi Komisi A
 */
export function createSidangPlenoOsisTemplate(): Meeting {
  const now = new Date();
  const dateFormatted = formatIndonesianDateTime(now, '13:00', '16:00');

  return {
    id: `meet-pleno-osis-${Date.now()}`,
    title: 'Sidang Pleno I Pengawasan Kinerja & Koordinasi Sekbid OSIS 2025/2026',
    date: dateFormatted,
    location: 'Ruang Rapat Majelis SMK Negeri 13 Bandung',
    organizer: 'Komisi A (Pengawasan OSIS) MPK SMK Negeri 13 Bandung',
    status: 'FINALIZED',
    durationSeconds: 180 * 60,
    formatStandard: 'LPJ_EVALUASI',
    leaderName: 'Zafana Alaiqa Zachwan (Koordinator Komisi A)',
    noteTakerName: 'Danis Ferdiansyah & Davin Maritza (JMM)',
    lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    attendees: [
      { id: 'att-p-1', name: 'Zafana Alaiqa Zachwan', role: 'Leader', present: true },
      { id: 'att-p-2', name: 'Danis Ferdiansyah', role: 'Note Taker', present: true },
      { id: 'att-p-3', name: 'Davin Maritza', role: 'Member', present: true },
      { id: 'att-p-4', name: 'Ketua OSIS SMKN 13', role: 'Member', present: true },
      { id: 'att-p-5', name: 'Sekretaris OSIS', role: 'Member', present: true },
      { id: 'att-p-6', name: 'Koordinator Sekbid 1-10', role: 'Member', present: true },
    ],
    transcript: [
      {
        id: 'tr-p-1',
        speaker: 'Koordinator Komisi A',
        startTime: '00:05',
        endTime: '01:15',
        text: 'Sidang Pleno I Evaluasi Proker OSIS Triwulan Pertama kami buka. Agenda hari ini menguji kesesuaian realisasi kegiatan terhadap Garis Besar Haluan Kerja yang telah disahkan.',
      },
      {
        id: 'tr-p-2',
        speaker: 'Pengurus OSIS',
        startTime: '01:20',
        endTime: '03:10',
        text: 'Kami telah merealisasikan 8 program kerja dari 10 sekbid, kendala utama terletak pada alokasi sarana audio aula dan perizinan jadwal dispensasi lomba.',
      },
    ],
    mostImportant:
      'Laporan progres realisasi program kerja OSIS Triwulan I disetujui dengan 3 rekomendasi perbaikan administrasi SPJ dan sinkronisasi jadwal kegiatan bersama Komisi B.',
    executiveSummary:
      'Komisi A MPK SMK Negeri 13 Bandung menyelenggarakan Sidang Pleno I guna mengevaluasi efektivitas kinerja kabinet OSIS 2025/2026. Dari hasil verifikasi, keterlaksanaan program kerja mencapai 80%. Komisi A memberikan catatan rekomendasi mengenai kedisiplinan tenggat pengumpulan proposal dan transparansi laporan kas kegiatan.',
    agendas: [
      {
        title: 'Verifikasi Keterlaksanaan Program Kerja Sekbid OSIS 1 - 10',
        discussionPoints: [
          'Pemeriksaan realisasi kegiatan keagamaan, bela negara, kejuruan, dan olahraga.',
          'Kesesuaian jadwal pelaksanaan dengan kalender akademik SMKN 13 Bandung.',
        ],
      },
      {
        title: 'Evaluasi Administrasi, Proposal, dan Pelaporan Keuangan (SPJ)',
        discussionPoints: [
          'Kepatuhan standarisasi nota belanja dan kwitansi kas OSIS.',
          'Tenggat penyerahan laporan pertanggungjawaban maksimal H+7 pasca kegiatan.',
        ],
      },
    ],
    decisions: [
      {
        id: `dec-pleno-1`,
        number: `KEP/004/KOM-A/PLENO-I/XI/2025`,
        decisionText:
          'Menerima progres laporan kegiatan OSIS Triwulan I dengan catatan wajib menuntaskan SPJ kegiatan tertunda dalam waktu 7 hari kerja.',
        rationale:
          'Menjaga akuntabilitas dan transparansi pelaporan dana kesiswaan sekolah.',
        category: 'Program Kerja',
        status: 'DISAHKAN',
        date: '2025-11-09',
      },
    ],
    actionItems: [
      {
        id: `act-pleno-1`,
        description: 'Penerbitan surat rekomendasi resmi evaluasi Komisi A ke Badan Pengurus Harian OSIS',
        assignee: 'Zafana Alaiqa Zachwan (Koord. Komisi A)',
        dueDate: '2025-11-13',
        status: 'IN_PROGRESS',
      },
    ],
  };
}

/**
 * Template Resmi: Rapat Delegasi Ekstrakurikuler (Komisi B)
 * Berdasarkan ART Bab III Pasal 7-9 & Tupoksi Komisi B
 */
export function createRapatDelegasiEkskulTemplate(): Meeting {
  const now = new Date();
  const dateFormatted = formatIndonesianDateTime(now, '14:00', '16:30');

  return {
    id: `meet-delegasi-ekskul-${Date.now()}`,
    title: 'Rapat Delegasi Ekstrakurikuler Semester Ganjil 2025/2026',
    date: dateFormatted,
    location: 'Ruang Multimedia SMK Negeri 13 Bandung',
    organizer: 'Komisi B (Tata Kelola Ekstrakurikuler) MPK SMK Negeri 13 Bandung',
    status: 'FINALIZED',
    durationSeconds: 150 * 60,
    formatStandard: 'TATA_NASKAH_DINAS',
    leaderName: 'Muhammad Imam Mulhakim (Koordinator I Komisi B)',
    noteTakerName: 'Adinda Syarifa Setiawan (Koordinator II Komisi B)',
    lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    attendees: [
      { id: 'att-b-1', name: 'Muhammad Imam Mulhakim', role: 'Leader', present: true },
      { id: 'att-b-2', name: 'Adinda Syarifa Setiawan', role: 'Note Taker', present: true },
      { id: 'att-b-3', name: 'Perwakilan 23 Ekstrakurikuler', role: 'Member', present: true },
      { id: 'att-b-4', name: 'Wakasek Kesiswaan SMKN 13', role: 'Guest', present: true },
    ],
    transcript: [
      {
        id: 'tr-b-1',
        speaker: 'Koordinator Komisi B',
        startTime: '00:05',
        endTime: '01:30',
        text: 'Rapat Delegasi Ekstrakurikuler kami buka untuk memfasilitasi kebutuhan sarana latihan, jadwal lapangan, dan persiapan kejuaraan luar sekolah.',
      },
    ],
    mostImportant:
      'Penyelarasan jadwal pemakaian lapangan olahraga dan ruang musik sekolah berhasil disepakati secara adil tanpa ada tabrakan jadwal antarekskul.',
    executiveSummary:
      'Komisi B MPK SMK Negeri 13 Bandung menggelar Rapat Delegasi bersama seluruh perwakilan 23 ekstrakurikuler. Rapat menghasilkan matriks penjadwalan lapangan (Planner), kesepakatan tertib presensi bulanan (Informator), serta penetapan SOP pengajuan dispensasi lomba resmi sekolah.',
    agendas: [
      {
        title: 'Penataan Matriks Jadwal Lapangan Utama & Ruang Khusus (Planner)',
        discussionPoints: [
          'Pengaturan giliran latihan futsal, basket, voli, paskibra, dan pramuka.',
          'Sanksi bagi ekskul yang menggunakan sarana di luar slot waktu yang telah ditetapkan.',
        ],
      },
      {
        title: 'Monitoring Presensi dan Pelaporan Keaktifan Triwulan (Informator)',
        discussionPoints: [
          'Format absensi digital mingguan yang wajib disetor ke Komisi B.',
          'Pencatatan prestasi lomba dan delegasi kejuruan tingkat kota/provinsi.',
        ],
      },
    ],
    decisions: [
      {
        id: `dec-b-1`,
        number: `KEP/005/KOM-B/DELEGASI/XI/2025`,
        decisionText:
          'Mengesahkan Matriks Jadwal Lapangan dan Ruang Ekstrakurikuler SMKN 13 Bandung Periode 2025/2026.',
        rationale:
          'Menghilangkan potensi konflik jadwal dan memastikan seluruh ekskul mendapatkan hak fasilitas yang setara.',
        category: 'Organisasi',
        status: 'DISAHKAN',
        date: '2025-11-09',
      },
    ],
    actionItems: [
      {
        id: `act-b-1`,
        description: 'Publikasi infografis jadwal pemakaian lapangan ke grup koordinasi ketua ekskul',
        assignee: 'Muhammad Imam Mulhakim (Koord. Komisi B)',
        dueDate: '2025-11-12',
        status: 'IN_PROGRESS',
      },
    ],
  };
}

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

export interface OfficialTemplateItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  create: () => Meeting;
}

/**
 * Registry Template Sidang MPK (Berdasarkan AD/ART SMKN 13 Bandung)
 */
export const OFFICIAL_MEETING_TEMPLATES: OfficialTemplateItem[] = [
  {
    id: 'mubes-ad-art',
    title: 'Musyawarah Besar (MUBES)',
    badge: 'Sidang Tertinggi',
    description: 'Pengesahan Anggaran Dasar, ART, dan Garis Besar Program Kerja MPK NBAP 2025/2026',
    create: createMubesMeetingTemplate,
  },
  {
    id: 'pleno-pengawasan-osis',
    title: 'Sidang Pleno Pengawasan OSIS',
    badge: 'Komisi A',
    description: 'Evaluasi program kerja Sekbid OSIS, uji kepatuhan SPJ kas, dan rekomendasi berkala',
    create: createSidangPlenoOsisTemplate,
  },
  {
    id: 'delegasi-ekskul',
    title: 'Rapat Delegasi Ekstrakurikuler',
    badge: 'Komisi B',
    description: 'Penataan jadwal lapangan (Planner), presensi triwulan (Informator), dan fasilitas ekskul',
    create: createRapatDelegasiEkskulTemplate,
  },
  {
    id: 'panitia-mpls',
    title: 'Pembentukan Panitia MPLS',
    badge: 'Kepanitiaan Khusus',
    description: 'Struktur panitia MPLS, pembagian 6 divisi, estimasi pagu anggaran, dan rundown ramah anak',
    create: createMplsMeetingTemplate,
  },
];
