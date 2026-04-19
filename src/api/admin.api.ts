import api from './axios';

// ── Public ───────────────────────────────────────────────────────────────────
export const getHomeContent = () =>
  api.get<{ id: number; artists: any[]; stats: any[]; slideshowImages: string[] }>('/admin/home-content');

// ── Admin (requires ADMIN role JWT) ─────────────────────────────────────────
export const updateHomeContent = (data: { artists?: any[]; stats?: any[]; slideshowImages?: string[] }) =>
  api.put('/admin/home-content', data);

export const adminGetUsers = () =>
  api.get<any[]>('/admin/users');

export const adminGetPlatformStats = () =>
  api.get<{ totalUsers: number; totalSongs: number; totalCategories: number }>('/admin/stats');

export const adminGetUserSongs = (userId: string) =>
  api.get<any[]>(`/admin/users/${userId}/songs`);

export const adminDeleteSong = (songId: string) =>
  api.delete(`/admin/songs/${songId}`);

export const adminUpdateUserRole = (userId: string, role: string) =>
  api.patch(`/admin/users/${userId}/role`, { role });
