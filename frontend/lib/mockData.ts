// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import { Meeting } from './types';

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-001',
    title: 'Rapat Pleno Evaluasi Program Kerja Tengah Semester & LDKS 2026',
    date: '2026-11-07 13:30 WIB',
    location: 'Ruang Rapat MPK / OSIS SMK Negeri 13 Bandung',
    organizer: 'MPK SMK Negeri 13 Bandung',
    status: 'FINALIZED',
    durationSeconds: 2740,
    attendees: [
      { id: 'att-1', name: 'Davin Maritza', role: 'Leader', present: true },
      { id: 'att-2', name: 'Siti Rahmawati', role: 'Note Taker', present: true },
      { id: 'att-3', name: 'Rian Firmansyah', role: 'Member', present: true },
      { id: 'att-4', name: 'Alifia Putri', role: 'Member', present: true },
      { id: 'att-5', name: 'Pembina MPK', role: 'Guest', present: true }
    ],
    transcript: [
      {
        id: 'seg-1',
        speaker: 'Davin Maritza (Ketua)',
        startTime: '00:00:15',
        endTime: '00:01:20',
        text: 'Assalamu’alaikum warahmatullahi wabarakatuh. Rapat evaluasi tengah semester dan persiapan pelaksanaan LDKS MPK SMK Negeri 13 Bandung resmi kita mulai. Agenda utama kita adalah meninjau laporan masing-masing komisi dan menetapkan anggaran serta tanggal pelaksanaan.'
      },
      {
        id: 'seg-2',
        speaker: 'Siti Rahmawati (Sekretaris)',
        startTime: '00:01:25',
        endTime: '00:02:40',
        text: 'Terima kasih Ketua. Berdasarkan rekap kehadiran, kuorum rapat terpenuhi dengan 18 perwakilan kelas hadir. Draft proposal kegiatan LDKS telah direvisi sesuai catatan dari Wakasek Kesiswaan minggu lalu.'
      },
      {
        id: 'seg-3',
        speaker: 'Rian Firmansyah (Komisi A)',
        startTime: '00:02:45',
        endTime: '00:04:10',
        text: 'Dari Komisi A mengenai materi kepemimpinan dan AD/ART, kami mengusulkan workshop studi kasus simulasi sidang pleno agar calon pengurus baru memahami tata tertib persidangan secara langsung.'
      },
      {
        id: 'seg-4',
        speaker: 'Davin Maritza (Ketua)',
        startTime: '00:04:15',
        endTime: '00:05:00',
        text: 'Usulan tersebut sangat baik dan disepakati. Mari kita putuskan bahwa simulasi sidang pleno resmi masuk ke dalam modul wajib LDKS 2026.'
      }
    ],
    executiveSummary: 'Rapat Pleno menyepakati finalisasi proposal LDKS 2026 SMK Negeri 13 Bandung dengan penambahan sesi simulasi persidangan parlemen siswa. Anggaran operasional disetujui setelah rasionalisasi pos logistik. Penugasan koordinasi dengan pihak Kesiswaan didelegasikan ke Komisi B.',
    agendas: [
      {
        title: 'Evaluasi Kinerja Pengurus Tengah Semester',
        discussionPoints: [
          'Pencapaian program kerja komisi A, B, dan C mencapai rata-rata 88%.',
          'Kedisiplinan pelaporan notulen mingguan telah meningkat menggunakan sistem NotulenJMM.'
        ]
      },
      {
        title: 'Finalisasi Teknis & Anggaran LDKS 2026',
        discussionPoints: [
          'Jadwal pelaksanaan ditetapkan pada tanggal 28-29 November 2026.',
          'Penambahan materi simulasi sidang pleno tata tertib persidangan.'
        ]
      }
    ],
    decisions: [
      {
        id: 'dec-1',
        number: 'KEP/001/MPK-13/XI/2026',
        decisionText: 'Menyetujui pengesahan Proposal Kegiatan LDKS 2026 dengan alokasi simulasi persidangan siswa.',
        rationale: 'Mempersiapkan regenerasi kepemimpinan yang memahami tata tertib persidangan formal.',
        category: 'Program Kerja',
        status: 'DISAHKAN',
        date: '2026-11-07'
      },
      {
        id: 'dec-2',
        number: 'KEP/002/MPK-13/XI/2026',
        decisionText: 'Standarisasi seluruh dokumentasi notulen rapat wajib dicatat dan disinkronkan melalui NotulenJMM.',
        rationale: 'Mencegah kehilangan arsip risalah rapat dan memudahkan penelusuran keputusan.',
        category: 'Organisasi',
        status: 'DISAHKAN',
        date: '2026-11-07'
      }
    ],
    actionItems: [
      {
        id: 'act-1',
        description: 'Serahkan revisi proposal LDKS ke Pembina MPK dan Wakasek Kesiswaan',
        assignee: 'Siti Rahmawati (Sekretaris)',
        dueDate: '2026-11-10',
        status: 'IN_PROGRESS'
      },
      {
        id: 'act-2',
        description: 'Finalisasi modul materi simulasi sidang pleno dan pembagian kelompok peserta',
        assignee: 'Rian Firmansyah (Komisi A)',
        dueDate: '2026-11-14',
        status: 'PENDING'
      },
      {
        id: 'act-3',
        description: 'Audit inventaris pengeras suara dan mikrofon ruang rapat untuk perekaman VibeVoice',
        assignee: 'Divisi Logistik',
        dueDate: '2026-11-08',
        status: 'COMPLETED'
      }
    ]
  }
];
