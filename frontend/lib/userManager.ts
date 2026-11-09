// Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
// User & Google Account Management Engine for NotulenJMM.

export type ManagedUserRole = 'SUPERADMIN' | 'ADMIN' | 'PRESIDIUM' | 'NOTULIS' | 'ANGGOTA';
export type ManagedUserStatus = 'ACTIVE' | 'SUSPENDED';

export interface ManagedUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: ManagedUserRole;
  status: ManagedUserStatus;
  lastActiveAt: string;
  createdAt: string;
  notes?: string;
}

export const USERS_STORAGE_KEY = 'notulenjmm_managed_users_v1';
export const USERS_UPDATED_EVENT = 'notulenjmm_users_updated';

export const PROTECTED_ADMIN_EMAILS: string[] = [
  'alfarrezald@gmail.com',
];

export const DEFAULT_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'usr-alfarrezald',
    email: 'alfarrezald@gmail.com',
    name: 'Alfarrezal Dwi',
    role: 'SUPERADMIN',
    status: 'ACTIVE',
    lastActiveAt: new Date().toISOString(),
    createdAt: '2026-01-01T00:00:00.000Z',
    notes: 'Superadministrator Utama MPK SMK Negeri 13 Bandung',
  },
  {
    id: 'usr-davinmaritza',
    email: 'davinmaritza@gmail.com',
    name: 'Davin Maritza',
    role: 'NOTULIS',
    status: 'ACTIVE',
    lastActiveAt: new Date().toISOString(),
    createdAt: '2026-01-01T00:00:00.000Z',
    notes: 'Pengembang Sistem NotulenJMM',
  },
  {
    id: 'usr-rahmaraura23',
    email: 'rahmaraura23@gmail.com',
    name: 'Rahma Raura',
    role: 'NOTULIS',
    status: 'ACTIVE',
    lastActiveAt: new Date().toISOString(),
    createdAt: '2026-02-01T00:00:00.000Z',
    notes: 'Notulis Sidang Komisi & Pleno',
  },
  {
    id: 'usr-sekretaris-smk13',
    email: 'sekretaris@smkn13bdg.sch.id',
    name: 'Sekretaris Majelis',
    role: 'PRESIDIUM',
    status: 'ACTIVE',
    lastActiveAt: new Date().toISOString(),
    createdAt: '2026-02-01T00:00:00.000Z',
    notes: 'Presidium Sidang Perwakilan Kelas',
  },
];

export function getManagedUsers(): ManagedUser[] {
  if (typeof window === 'undefined') {
    return DEFAULT_MANAGED_USERS;
  }

  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_MANAGED_USERS));
      return DEFAULT_MANAGED_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure only alfarrezald@gmail.com is SUPERADMIN and always active
      let modified = false;
      const existing = [...parsed];

      for (let i = 0; i < existing.length; i++) {
        const u = existing[i];
        if (u.email.toLowerCase() === 'alfarrezald@gmail.com') {
          if (u.role !== 'SUPERADMIN' || u.status !== 'ACTIVE') {
            existing[i] = { ...u, role: 'SUPERADMIN', status: 'ACTIVE' };
            modified = true;
          }
        } else if (u.role === 'SUPERADMIN') {
          existing[i] = { ...u, role: 'NOTULIS' };
          modified = true;
        }
      }

      for (const def of DEFAULT_MANAGED_USERS) {
        const found = existing.some((u) => u.email.toLowerCase() === def.email.toLowerCase());
        if (!found) {
          existing.push(def);
          modified = true;
        }
      }
      if (modified) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existing));
      }
      return existing;
    }
  } catch (e) {
    console.warn('Failed to load managed users from storage:', e);
  }
  return DEFAULT_MANAGED_USERS;
}

export function saveManagedUsers(users: ManagedUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent(USERS_UPDATED_EVENT, { detail: users }));
  } catch (e) {
    console.warn('Failed to save managed users to storage:', e);
  }
}

export function isUserSuspended(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  // Protected admins are never suspended
  if (PROTECTED_ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail)) {
    return false;
  }
  const users = getManagedUsers();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  return user ? user.status === 'SUSPENDED' : false;
}

export function getUserRole(email?: string | null): ManagedUserRole {
  if (!email) return 'ANGGOTA';
  const cleanEmail = email.trim().toLowerCase();
  if (PROTECTED_ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail)) {
    return 'SUPERADMIN';
  }
  const users = getManagedUsers();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  return user ? user.role : 'NOTULIS';
}

export function upsertUserOnLogin(
  email: string,
  name?: string,
  avatarUrl?: string
): ManagedUser {
  const cleanEmail = email.trim().toLowerCase();
  const isSuperAdmin = PROTECTED_ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail);
  const users = getManagedUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

  const now = new Date().toISOString();

  if (index >= 0) {
    const existing = users[index];
    const updated: ManagedUser = {
      ...existing,
      name: name?.trim() || existing.name,
      avatarUrl: avatarUrl || existing.avatarUrl,
      lastActiveAt: now,
      // Protected admin always stays Superadmin and Active
      role: isSuperAdmin ? 'SUPERADMIN' : existing.role,
      status: isSuperAdmin ? 'ACTIVE' : existing.status,
    };
    users[index] = updated;
    saveManagedUsers(users);
    return updated;
  } else {
    const newUser: ManagedUser = {
      id: 'usr-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      email: cleanEmail,
      name: name?.trim() || cleanEmail.split('@')[0],
      avatarUrl: avatarUrl || undefined,
      role: isSuperAdmin ? 'SUPERADMIN' : 'NOTULIS',
      status: 'ACTIVE',
      lastActiveAt: now,
      createdAt: now,
    };
    users.push(newUser);
    saveManagedUsers(users);
    return newUser;
  }
}

export function toggleUserStatus(idOrEmail: string): { user: ManagedUser; newStatus: ManagedUserStatus } {
  const users = getManagedUsers();
  const targetIndex = users.findIndex(
    (u) => u.id === idOrEmail || u.email.toLowerCase() === idOrEmail.toLowerCase()
  );

  if (targetIndex === -1) {
    throw new Error('Pengguna tidak ditemukan dalam daftar.');
  }

  const user = users[targetIndex];
  const cleanEmail = user.email.toLowerCase();

  if (PROTECTED_ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail)) {
    throw new Error('Akun Superadministrator utama terlindungi dan tidak dapat ditangguhkan.');
  }

  const newStatus: ManagedUserStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
  users[targetIndex] = {
    ...user,
    status: newStatus,
  };

  saveManagedUsers(users);
  return { user: users[targetIndex], newStatus };
}

export function updateUserRole(idOrEmail: string, role: ManagedUserRole): ManagedUser {
  const users = getManagedUsers();
  const targetIndex = users.findIndex(
    (u) => u.id === idOrEmail || u.email.toLowerCase() === idOrEmail.toLowerCase()
  );

  if (targetIndex === -1) {
    throw new Error('Pengguna tidak ditemukan dalam daftar.');
  }

  const user = users[targetIndex];
  const cleanEmail = user.email.toLowerCase();

  if (PROTECTED_ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail) && role !== 'SUPERADMIN') {
    throw new Error('Peran Superadministrator utama tidak dapat diturunkan.');
  }

  users[targetIndex] = {
    ...user,
    role,
  };

  saveManagedUsers(users);
  return users[targetIndex];
}

export function addManagedUser(data: {
  email: string;
  name: string;
  role: ManagedUserRole;
  status?: ManagedUserStatus;
  notes?: string;
}): ManagedUser {
  const cleanEmail = data.email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Format alamat email tidak valid.');
  }

  const users = getManagedUsers();
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    throw new Error('Pengguna dengan email ini sudah terdaftar.');
  }

  const isSuperAdmin = PROTECTED_ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail);
  const now = new Date().toISOString();

  const newUser: ManagedUser = {
    id: 'usr-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    email: cleanEmail,
    name: data.name.trim() || cleanEmail.split('@')[0],
    role: isSuperAdmin ? 'SUPERADMIN' : data.role,
    status: data.status || 'ACTIVE',
    lastActiveAt: now,
    createdAt: now,
    notes: data.notes?.trim() || undefined,
  };

  users.push(newUser);
  saveManagedUsers(users);
  return newUser;
}

export function deleteManagedUser(idOrEmail: string): boolean {
  const users = getManagedUsers();
  const target = users.find(
    (u) => u.id === idOrEmail || u.email.toLowerCase() === idOrEmail.toLowerCase()
  );

  if (!target) return false;

  const cleanEmail = target.email.toLowerCase();
  if (PROTECTED_ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail)) {
    throw new Error('Akun Superadministrator utama terlindungi dan tidak dapat dihapus.');
  }

  const filtered = users.filter((u) => u.id !== target.id);
  saveManagedUsers(filtered);
  return true;
}
