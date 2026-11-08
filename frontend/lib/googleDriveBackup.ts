// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
import { Meeting, HistoryLog, GoogleDriveAccount } from './types';

export const GOOGLE_DRIVE_BACKUP_FILENAME = 'NotulenJMM_Cloud_Backup.json';
export const STORAGE_KEY_GOOGLE_ACCOUNT = 'notulenjmm_google_account_v1';
export const STORAGE_KEY_HISTORY_LOGS = 'notulenjmm_history_logs_v1';
export const STORAGE_KEY_GOOGLE_CLIENT_ID = 'notulenjmm_google_client_id_v1';

export const DEFAULT_GOOGLE_CLIENT_ID =
  '1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com';

// Default public Google Drive client ID placeholder or user-configured client ID
export function getGoogleClientId(): string {
  if (typeof window === 'undefined') return DEFAULT_GOOGLE_CLIENT_ID;
  return (
    localStorage.getItem(STORAGE_KEY_GOOGLE_CLIENT_ID) ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    DEFAULT_GOOGLE_CLIENT_ID
  );
}

export function setGoogleClientId(clientId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_GOOGLE_CLIENT_ID, clientId.trim());
}

export function getStoredGoogleAccount(): GoogleDriveAccount {
  if (typeof window === 'undefined') return { connected: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GOOGLE_ACCOUNT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse stored Google account:', e);
  }
  return { connected: false };
}

export function saveStoredGoogleAccount(account: GoogleDriveAccount) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_GOOGLE_ACCOUNT, JSON.stringify(account));
}

export function clearStoredGoogleAccount() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_GOOGLE_ACCOUNT);
}

export function getStoredHistoryLogs(): HistoryLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse history logs:', e);
  }
  return [];
}

export function addHistoryLog(
  action: HistoryLog['action'],
  title: string,
  details: string
): HistoryLog[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredHistoryLogs();
  const newLog: HistoryLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    action,
    title,
    details,
  };
  const updated = [newLog, ...current].slice(0, 100); // keep last 100 logs
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to store history log:', e);
  }
  return updated;
}

export interface FullBackupPayload {
  app: 'NotulenJMM';
  version: string;
  exportedAt: string;
  organization: string;
  totalMeetings: number;
  meetings: Meeting[];
  craftConfig?: unknown;
  historyLogs: HistoryLog[];
}

export function generateBackupPayload(meetings: Meeting[]): FullBackupPayload {
  let craftConfig = null;
  if (typeof window !== 'undefined') {
    try {
      const storedCraft = localStorage.getItem('craft_studio_config_v2');
      if (storedCraft) craftConfig = JSON.parse(storedCraft);
    } catch (e) {
      console.warn('Failed to extract craft config for backup:', e);
    }
  }

  return {
    app: 'NotulenJMM',
    version: '0.6.0',
    exportedAt: new Date().toISOString(),
    organization: 'MPK SMK Negeri 13 Bandung',
    totalMeetings: meetings.length,
    meetings,
    craftConfig,
    historyLogs: getStoredHistoryLogs(),
  };
}

// Download .json backup directly to local disk / mobile filesystem
export function downloadBackupFile(meetings: Meeting[]): string {
  const payload = generateBackupPayload(meetings);
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const filename = `NotulenJMM_Backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  addHistoryLog('BACKUP_CLOUD', 'Cadangan Berkas Lokal', `Mengunduh berkas cadangan ${filename} (${meetings.length} sesi rapat).`);
  return filename;
}

// Parse and validate imported JSON backup file
export function parseAndValidateBackup(jsonString: string): {
  success: boolean;
  meetings?: Meeting[];
  message: string;
} {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') {
      return { success: false, message: 'Format berkas tidak valid.' };
    }

    if (!Array.isArray(data.meetings)) {
      return { success: false, message: 'Berkas cadangan tidak memiliki daftar pertemuan (meetings).' };
    }

    // Validate meeting elements
    const validMeetings: Meeting[] = data.meetings.filter(
      (m: unknown): m is Meeting =>
        typeof m === 'object' &&
        m !== null &&
        typeof (m as Meeting).id === 'string' &&
        typeof (m as Meeting).title === 'string'
    );

    if (validMeetings.length === 0 && data.meetings.length > 0) {
      return { success: false, message: 'Tidak ada data rapat yang sah di dalam berkas ini.' };
    }

    // If craftConfig is present, restore it
    if (data.craftConfig && typeof window !== 'undefined') {
      try {
        localStorage.setItem('craft_studio_config_v2', JSON.stringify(data.craftConfig));
      } catch (e) {
        console.warn('Failed to restore craft config from backup:', e);
      }
    }

    // If historyLogs are present, merge them
    if (Array.isArray(data.historyLogs) && typeof window !== 'undefined') {
      try {
        const existingLogs = getStoredHistoryLogs();
        const merged = [...data.historyLogs, ...existingLogs].slice(0, 100);
        localStorage.setItem(STORAGE_KEY_HISTORY_LOGS, JSON.stringify(merged));
      } catch (e) {
        console.warn('Failed to restore history logs from backup:', e);
      }
    }

    addHistoryLog('RESTORE', 'Pemulihan Cadangan Berkas', `Memulihkan ${validMeetings.length} sesi rapat dari berkas cadangan.`);
    return {
      success: true,
      meetings: validMeetings,
      message: `Berhasil membaca ${validMeetings.length} sesi rapat dari berkas cadangan.`,
    };
  } catch (err) {
    return { success: false, message: `Gagal membaca berkas JSON: ${err instanceof Error ? err.message : String(err)}` };
  }
}

// Load Google Identity Services script dynamically if not present
export function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window not available'));
    if ((window as unknown as { google?: { accounts?: unknown } }).google?.accounts) {
      return resolve();
    }
    const existingScript = document.getElementById('google-jssdk');
    if (existingScript) {
      existingScript.onload = () => resolve();
      existingScript.onerror = () => reject(new Error('Gagal memuat pustaka Google Identity Services.'));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-jssdk';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Gagal memuat pustaka Google Identity Services.'));
    document.head.appendChild(script);
  });
}

// Request Google OAuth 2.0 access token via Google Identity Services Token Client
export async function requestGoogleAccessToken(
  clientId: string,
  silent = false
): Promise<string> {
  await loadGoogleScript();
  return new Promise((resolve, reject) => {
    try {
      const google = (window as unknown as {
        google: {
          accounts: {
            oauth2: {
              initTokenClient: (config: {
                client_id: string;
                scope: string;
                callback: (response: { access_token?: string; error?: string }) => void;
                error_callback?: (err: unknown) => void;
              }) => { requestAccessToken: (opts?: { prompt?: string }) => void };
            };
          };
        };
      }).google;

      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: (resp) => {
          if (resp.error) {
            reject(new Error(`Otorisasi Google ditolak: ${resp.error}`));
          } else if (resp.access_token) {
            resolve(resp.access_token);
          } else {
            reject(new Error('Tidak menerima token akses dari Google.'));
          }
        },
        error_callback: (err) => {
          reject(new Error(`Google Identity error: ${JSON.stringify(err)}`));
        },
      });

      if (silent) {
        client.requestAccessToken({ prompt: '' });
      } else {
        client.requestAccessToken();
      }
    } catch (e) {
      reject(e);
    }
  });
}

// Fetch Google User Profile with access token
export async function fetchGoogleUserProfile(accessToken: string): Promise<{
  email: string;
  name: string;
  picture?: string;
}> {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error('Gagal memverifikasi profil akun Google.');
  }
  return await res.json();
}

// Upload backup directly to Google Drive (creates or updates NotulenJMM_Cloud_Backup.json)
export async function uploadBackupToGoogleDrive(
  accessToken: string,
  meetings: Meeting[]
): Promise<{ fileId: string; modifiedTime: string }> {
  const payload = generateBackupPayload(meetings);
  const jsonContent = JSON.stringify(payload, null, 2);

  // 1. Check if backup file already exists on Drive
  const query = `name = '${GOOGLE_DRIVE_BACKUP_FILENAME}' and trashed = false`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,modifiedTime)`;
  
  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  let existingFileId: string | null = null;
  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      existingFileId = searchData.files[0].id;
    }
  }

  // 2. Upload using multipart (update or create)
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: GOOGLE_DRIVE_BACKUP_FILENAME,
    description: 'Cadangan cloud resmi dokumen & notulen MPK SMK Negeri 13 Bandung (NotulenJMM)',
    mimeType: 'application/json',
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    jsonContent +
    closeDelimiter;

  let uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  let method = 'POST';

  if (existingFileId) {
    uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`;
    method = 'PATCH';
  }

  const uploadRes = await fetch(uploadUrl, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Gagal mengunggah cadangan ke Google Drive: ${errText}`);
  }

  const fileData = await uploadRes.json();
  const modifiedTime = fileData.modifiedTime || new Date().toISOString();

  addHistoryLog(
    'BACKUP_CLOUD',
    'Cadangan Cloud Google Drive',
    `Sinkronisasi cadangan berhasil ke Google Drive (${meetings.length} sesi, ID: ${fileData.id}).`
  );

  return { fileId: fileData.id, modifiedTime };
}

// Download and restore backup from Google Drive
export async function downloadBackupFromGoogleDrive(
  accessToken: string
): Promise<{ success: boolean; meetings?: Meeting[]; message: string; modifiedTime?: string }> {
  // 1. Search for backup file
  const query = `name = '${GOOGLE_DRIVE_BACKUP_FILENAME}' and trashed = false`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!searchRes.ok) {
    throw new Error('Gagal menghubungi Google Drive untuk mencari file cadangan.');
  }

  const searchData = await searchRes.json();
  if (!searchData.files || searchData.files.length === 0) {
    return {
      success: false,
      message: `Tidak ditemukan berkas '${GOOGLE_DRIVE_BACKUP_FILENAME}' di Google Drive Anda. Silakan lakukan cadangkan terlebih dahulu.`,
    };
  }

  const targetFile = searchData.files[0];
  const downloadUrl = `https://www.googleapis.com/drive/v3/files/${targetFile.id}?alt=media`;

  const downloadRes = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!downloadRes.ok) {
    throw new Error('Gagal mengunduh isi file cadangan dari Google Drive.');
  }

  const jsonContent = await downloadRes.text();
  const result = parseAndValidateBackup(jsonContent);

  if (result.success) {
    addHistoryLog(
      'RESTORE',
      'Pemulihan dari Google Drive',
      `Memulihkan ${result.meetings?.length || 0} sesi rapat dari Google Drive (file ID: ${targetFile.id}).`
    );
  }

  return {
    ...result,
    modifiedTime: targetFile.modifiedTime,
  };
}

// Export formatted meeting minutes directly to native Google Docs in Google Drive
export async function exportMeetingToGoogleDoc(
  accessToken: string,
  meeting: Meeting
): Promise<{ docId: string; docUrl: string; title: string }> {
  const escape = (text: string | null | undefined): string => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const docTitle = `Risalah Sidang — ${meeting.title} — MPK 13`;
  const dateFormatted = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  let agendasHtml = '';
  if (meeting.agendas && meeting.agendas.length > 0) {
    agendasHtml = meeting.agendas
      .map(
        (a, i) => `
        <div style="margin-bottom: 12pt;">
          <p><strong>${i + 1}. ${escape(a.title)}</strong></p>
          <ul>
            ${a.discussionPoints.map((pt) => `<li>${escape(pt)}</li>`).join('')}
          </ul>
        </div>
      `
      )
      .join('');
  } else {
    agendasHtml = '<p><em>Tidak ada pokok bahasan agenda tertulis.</em></p>';
  }

  let decisionsHtml = '';
  if (meeting.decisions && meeting.decisions.length > 0) {
    decisionsHtml = `
      <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 12pt;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="width: 30pt; text-align: center;">No</th>
            <th>Klausul Keputusan Resmi</th>
            <th style="width: 100pt; text-align: center;">Kategori</th>
          </tr>
        </thead>
        <tbody>
          ${meeting.decisions
            .map(
              (d, i) => `
            <tr>
              <td style="text-align: center;">${i + 1}</td>
              <td><strong>${escape(d.decisionText)}</strong>${d.rationale ? `<br><span style="font-size: 9pt; color: #475569;">Pertimbangan: ${escape(d.rationale)}</span>` : ''}</td>
              <td style="text-align: center;">${escape(d.category)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  } else {
    decisionsHtml = '<p><em>Belum ada keputusan resmi yang disahkan.</em></p>';
  }

  let actionsHtml = '';
  if (meeting.actionItems && meeting.actionItems.length > 0) {
    actionsHtml = `
      <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 12pt;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="width: 30pt; text-align: center;">No</th>
            <th>Tugas Operasional</th>
            <th style="width: 110pt; text-align: center;">Penanggung Jawab (PIC)</th>
            <th style="width: 80pt; text-align: center;">Tenggat Waktu</th>
            <th style="width: 70pt; text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${meeting.actionItems
            .map(
              (a, i) => `
            <tr>
              <td style="text-align: center;">${i + 1}</td>
              <td><strong>${escape(a.description)}</strong></td>
              <td style="text-align: center;"><strong>${escape(a.assignee)}</strong></td>
              <td style="text-align: center;">${escape(a.dueDate)}</td>
              <td style="text-align: center;">${escape(a.status)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  } else {
    actionsHtml = '<p><em>Tidak ada daftar penugasan operasional.</em></p>';
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escape(docTitle)}</title>
</head>
<body style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000000; padding: 20pt;">
  <div style="text-align: center; border-bottom: 2pt solid #000000; padding-bottom: 8pt; margin-bottom: 14pt;">
    <p style="font-size: 9pt; margin: 0; text-transform: uppercase;">PEMERINTAH DAERAH PROVINSI JAWA BARAT - DINAS PENDIDIKAN</p>
    <p style="font-size: 13pt; font-weight: bold; margin: 2pt 0; text-transform: uppercase;">MAJELIS PERWAKILAN KELAS (MPK)</p>
    <p style="font-size: 14pt; font-weight: bold; margin: 0 0 4pt; color: #000000;">SMK NEGERI 13 BANDUNG</p>
    <p style="font-size: 8.5pt; color: #475569; margin: 0;">Jl. Soekarno-Hatta Km. 10 Bandung 40286 | Surel: mpk@smkn13bdg.sch.id</p>
  </div>

  <div style="text-align: center; font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 16pt 0 4pt; text-decoration: underline;">
    RISALAH &amp; NOTULENSI RESMI SIDANG
  </div>
  <div style="text-align: center; font-size: 10pt; font-family: monospace; color: #475569; margin-bottom: 16pt;">
    Nomor Berita Acara: BA/${dateFormatted}/MPK-13/XI/2026
    ${meeting.isArchived && meeting.archiveNumber ? ` | Nomor Registrasi Arsip: ${escape(meeting.archiveNumber)}` : ''}
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 16pt;">
    <tr><td style="width: 140pt; font-weight: bold;">Agenda Sidang</td><td>: <strong>${escape(meeting.title)}</strong></td></tr>
    <tr><td style="font-weight: bold;">Hari / Tanggal</td><td>: ${escape(meeting.date)}</td></tr>
    <tr><td style="font-weight: bold;">Tempat Sidang</td><td>: ${escape(meeting.location)}</td></tr>
    <tr><td style="font-weight: bold;">Penyelenggara</td><td>: ${escape(meeting.organizer)}</td></tr>
    <tr><td style="font-weight: bold;">Pimpinan Sidang</td><td>: ${escape(meeting.leaderName || 'Presidium Sidang MPK 13')}</td></tr>
    <tr><td style="font-weight: bold;">Notulis Sidang</td><td>: ${escape(meeting.noteTakerName || 'Notulis Sidang')}</td></tr>
    ${meeting.secretaryNotes ? `<tr><td style="font-weight: bold;">Catatan Pengarah</td><td>: <em>${escape(meeting.secretaryNotes)}</em></td></tr>` : ''}
  </table>

  <h3 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1.5pt solid #0f172a; padding-bottom: 3pt; margin-top: 16pt; margin-bottom: 6pt;">
    I. Ringkasan Eksekutif Hasil Sidang
  </h3>
  <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 8pt 12pt; margin: 6pt 0 12pt; font-size: 10.5pt;">
    ${escape(meeting.executiveSummary) || 'Belum ada ringkasan eksekutif.'}
  </div>

  ${meeting.mostImportant ? `
  <div style="background-color: #fef08a; border: 2px solid #000000; padding: 10pt 12pt; margin: 10pt 0 14pt; border-radius: 6pt;">
    <p style="margin: 0; font-size: 9pt; font-weight: bold; text-transform: uppercase; color: #854d0e;">POIN KRITIS / KEPUTUSAN PALING UTAMA (MOST IMPORTANT):</p>
    <p style="margin: 4pt 0 0; font-size: 11pt; font-weight: bold; color: #000000;">${escape(meeting.mostImportant)}</p>
  </div>
  ` : ''}

  <h3 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1.5pt solid #0f172a; padding-bottom: 3pt; margin-top: 16pt; margin-bottom: 6pt;">
    II. Pokok Bahasan &amp; Agenda Pleno
  </h3>
  ${agendasHtml}

  <h3 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1.5pt solid #0f172a; padding-bottom: 3pt; margin-top: 16pt; margin-bottom: 6pt;">
    III. Ketetapan &amp; Keputusan Resmi Majelis
  </h3>
  ${decisionsHtml}

  <h3 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1.5pt solid #0f172a; padding-bottom: 3pt; margin-top: 16pt; margin-bottom: 6pt;">
    IV. Tindak Lanjut &amp; Penugasan (Action Items)
  </h3>
  ${actionsHtml}

  <table style="width: 100%; margin-top: 35pt; border-collapse: collapse;">
    <tr>
      <td style="width: 50%; text-align: center; vertical-align: top;">
        Mengetahui,<br>
        <strong>Pimpinan Sidang MPK 13</strong>
        <br><br><br><br>
        <u>(${escape(meeting.leaderName || 'Presidium Sidang')})</u><br>
        NIS. MPK-13/2026
      </td>
      <td style="width: 50%; text-align: center; vertical-align: top;">
        Bandung, ${escape(meeting.date.split(',')[0] || 'Sidang MPK 13')}<br>
        <strong>Notulis / Sekretaris Sidang</strong>
        <br><br><br><br>
        <u>(${escape(meeting.noteTakerName || 'Notulis Sidang')})</u><br>
        NIS. MPK-13/2026
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const boundary = '-------googleDocUploadBoundary314159';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: docTitle,
    description: `Risalah Resmi MPK SMK Negeri 13 Bandung - Dibuat via NotulenJMM pada ${new Date().toLocaleString('id-ID')}`,
    mimeType: 'application/vnd.google-apps.document',
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/html; charset=UTF-8\r\n\r\n' +
    htmlContent +
    closeDelimiter;

  const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Gagal membuat dokumen Google Docs: ${errText}`);
  }

  const fileData = await uploadRes.json();
  const docId = fileData.id;
  const docUrl = `https://docs.google.com/document/d/${docId}/edit`;

  addHistoryLog(
    'BACKUP_CLOUD',
    'Ekspor Google Docs',
    `Membuat Google Docs resmi '${docTitle}' (ID: ${docId}).`
  );

  return { docId, docUrl, title: docTitle };
}
