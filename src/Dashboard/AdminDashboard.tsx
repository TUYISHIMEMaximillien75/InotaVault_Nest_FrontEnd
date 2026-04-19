import { useState, useEffect } from 'react';
import {
  Users, Music, BarChart3, Trash2, ChevronDown, ChevronUp,
  ShieldCheck, ShieldOff, Save, Plus, X, Image, Edit3,
} from 'lucide-react';
import {
  adminGetUsers, adminGetPlatformStats, adminGetUserSongs,
  adminDeleteSong, adminUpdateUserRole, getHomeContent, updateHomeContent,
} from '../api/admin.api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AppUser { id: string; name: string; email: string; role: string; createdAt: string; verified: boolean; }
interface Song    { id: string; name: string; category: string; artist?: string; likes: number; view_count: number; createdAt: string; }
interface Artist  { name: string; image: string; choir: string; songs: string[]; youtube: string; }


type Tab = 'users' | 'home' | 'stats';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('users');

  // ── Users tab state
  const [users, setUsers] = useState<AppUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [userSongs, setUserSongs] = useState<Record<string, Song[]>>({});
  const [songsLoading, setSongsLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ── Home content tab state
  const [artists, setArtists] = useState<Artist[]>([]);
  const [slideshow, setSlideshow] = useState<string[]>([]);
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeSaving, setHomeSaving] = useState(false);
  const [homeSaved, setHomeSaved] = useState(false);

  // ── Platform stats tab state
  const [platformStats, setPlatformStats] = useState<{ totalUsers: number; totalSongs: number; totalCategories: number } | null>(null);

  // ─── Load users on mount ───────────────────────────────────────────────────
  useEffect(() => {
    adminGetUsers()
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setUsersLoading(false));
  }, []);

  // ── Load home content ──────────────────────────────────────────────────────
  useEffect(() => {
    getHomeContent()
      .then(r => {
        setArtists(r.data.artists ?? []);
        setSlideshow(r.data.slideshowImages ?? []);
      })
      .catch(console.error)
      .finally(() => setHomeLoading(false));
  }, []);

  // ── Load platform stats when that tab is selected ──────────────────────────
  useEffect(() => {
    if (tab === 'stats' && !platformStats) {
      adminGetPlatformStats().then(r => setPlatformStats(r.data)).catch(console.error);
    }
  }, [tab, platformStats]);

  // ─── Toggle user expansion ─────────────────────────────────────────────────
  const toggleUser = async (userId: string) => {
    if (expandedUser === userId) { setExpandedUser(null); return; }
    setExpandedUser(userId);
    if (!userSongs[userId]) {
      setSongsLoading(userId);
      try {
        const r = await adminGetUserSongs(userId);
        setUserSongs(prev => ({ ...prev, [userId]: r.data }));
      } catch { /* ignore */ }
      finally { setSongsLoading(null); }
    }
  };

  // ─── Delete a song ─────────────────────────────────────────────────────────
  const handleDeleteSong = async (songId: string, uploaderId: string) => {
    try {
      await adminDeleteSong(songId);
      setUserSongs(prev => ({
        ...prev,
        [uploaderId]: prev[uploaderId].filter(s => s.id !== songId),
      }));
      setDeleteConfirm(null);
    } catch (e) { console.error(e); }
  };

  // ─── Toggle user role ──────────────────────────────────────────────────────
  const handleRoleToggle = async (user: AppUser) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const r = await adminUpdateUserRole(user.id, newRole);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: r.data.role } : u));
    } catch (e) { console.error(e); }
  };

  // ─── Save home content ─────────────────────────────────────────────────────
  const handleSaveHome = async () => {
    setHomeSaving(true);
    try {
      await updateHomeContent({ artists, slideshowImages: slideshow });
      setHomeSaved(true);
      setTimeout(() => setHomeSaved(false), 3000);
    } catch (e) { console.error(e); }
    finally { setHomeSaving(false); }
  };

  // ─── Artist helpers ────────────────────────────────────────────────────────
  const updateArtist = (idx: number, field: keyof Artist, value: string | string[]) =>
    setArtists(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  const addArtist = () =>
    setArtists(prev => [...prev, { name: '', image: '', choir: '', songs: [''], youtube: '' }]);
  const removeArtist = (idx: number) =>
    setArtists(prev => prev.filter((_, i) => i !== idx));


  // ─── Slideshow helpers ─────────────────────────────────────────────────────
  const updateSlide = (idx: number, value: string) =>
    setSlideshow(prev => prev.map((s, i) => i === idx ? value : s));
  const addSlide = () => setSlideshow(prev => [...prev, '']);
  const removeSlide = (idx: number) => setSlideshow(prev => prev.filter((_, i) => i !== idx));

  // ─── Shared input style ────────────────────────────────────────────────────
  const inp = 'w-full bg-white border border-gray-200 text-gray-800 text-sm px-3 py-2 rounded focus:outline-none focus:border-red-500 transition-colors shadow-sm';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .adm-display { font-family: 'Playfair Display', serif; }
        .adm-body    { font-family: 'DM Sans', sans-serif; }
        .adm-tab { padding: 8px 20px; font-size:13px; font-weight:600; letter-spacing:.04em; border-bottom: 3px solid transparent; transition: color .15s, border-color .15s; cursor:pointer; }
        .adm-tab.active { color:#ef4444; border-bottom-color:#ef4444; }
        .adm-tab:not(.active) { color:#6b7280; }
        .adm-tab:not(.active):hover { color:#111827; }
        .adm-card { background:#ffffff; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
        @keyframes adm-fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .adm-fade { animation: adm-fade .25s ease forwards; }
        .adm-btn-red { background:#dc2626; color:#fff; padding:6px 14px; border-radius:4px; font-size:12px; font-weight:600; transition:background .15s; }
        .adm-btn-red:hover { background:#b91c1c; }
        .adm-btn-ghost { background:transparent; border:1px solid #d1d5db; color:#4b5563; padding:6px 14px; border-radius:4px; font-size:12px; font-weight:600; transition:all .15s; }
        .adm-btn-ghost:hover { border-color:#9ca3af; color:#111827; }
      `}</style>

      {/* Changed bg from #0d1117 to transparent because it's inside DashboardLayout which provides #f8f5f0 */}
      <div className="text-gray-900 adm-body p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-red-500 text-[10px] font-bold tracking-[.22em] uppercase mb-1.5">Control Center</p>
          <h1 className="adm-display text-3xl md:text-4xl font-black text-gray-900">Admin Dashboard<span className="text-red-600">.</span></h1>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-gray-200 mb-8 gap-1 overflow-x-auto">
          {([
            { key: 'users', label: 'Users & Songs', icon: Users },
            { key: 'home',  label: 'Home Content',  icon: Edit3  },
            { key: 'stats', label: 'Platform Stats', icon: BarChart3 },
          ] as { key: Tab; label: string; icon: any }[]).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`adm-tab flex items-center gap-2 whitespace-nowrap ${tab === key ? 'active' : ''}`}>
              <Icon size={15} />{label}
            </button>
          ))}
        </div>

        {/* ════════════════════ TAB: USERS & SONGS ════════════════════ */}
        {tab === 'users' && (
          <div className="adm-fade">
            {usersLoading
              ? <p className="text-gray-500 text-sm">Loading users…</p>
              : (
                <div className="space-y-3">
                  {users.map(user => (
                    <div key={user.id} className="adm-card">
                      {/* User row */}
                      <button
                        onClick={() => toggleUser(user.id)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                          <span className="text-red-500 font-bold text-sm uppercase">{user.name?.[0] ?? '?'}</span>
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                          <p className="text-gray-500 text-xs truncate">{user.email}</p>
                        </div>
                        {/* Role badge */}
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          user.role === 'ADMIN' ? 'bg-red-50 text-red-600 border border-red-200'
                          : user.role === 'CREATOR' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                          {user.role}
                        </span>
                        {/* Expand chevron */}
                        <div className="text-gray-400 shrink-0">
                          {expandedUser === user.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                        </div>
                      </button>

                      {/* Expanded section */}
                      {expandedUser === user.id && (
                        <div className="border-t border-gray-100 p-5 bg-gray-50 adm-fade">
                          {/* Admin details row */}
                          <div className="flex flex-wrap items-center gap-4 mb-5">
                            <div className="text-xs text-gray-500">
                              Joined: <span className="text-gray-900 font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Verified: <span className={`font-medium ${user.verified ? 'text-emerald-600' : 'text-red-600'}`}>{user.verified ? 'Yes' : 'No'}</span>
                            </div>
                            <button onClick={() => handleRoleToggle(user)}
                              className="flex items-center gap-1.5 adm-btn-ghost ml-auto">
                              {user.role === 'ADMIN'
                                ? <><ShieldOff size={13}/> Remove Admin</>
                                : <><ShieldCheck size={13}/> Make Admin</>}
                            </button>
                          </div>

                          {/* Songs list */}
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.18em] mb-3">Songs uploaded</p>
                          {songsLoading === user.id
                            ? <p className="text-gray-500 text-xs">Loading songs…</p>
                            : !userSongs[user.id] || userSongs[user.id].length === 0
                              ? <p className="text-gray-500 text-xs italic">No songs uploaded yet.</p>
                              : (
                                <div className="space-y-2">
                                  {userSongs[user.id].map(song => (
                                    <div key={song.id}
                                      className="flex items-center gap-3 bg-white border border-gray-200 rounded px-4 py-3 group shadow-sm">
                                      <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center shrink-0">
                                        <Music size={14} className="text-red-500" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-gray-900 text-sm font-semibold truncate">{song.name}</p>
                                        <p className="text-gray-500 text-xs">{song.category}{song.artist ? ` · ${song.artist}` : ''}</p>
                                      </div>
                                      <div className="flex items-center gap-4 text-xs font-medium text-gray-500 shrink-0">
                                        <span className="flex items-center gap-1">👁 {song.view_count}</span>
                                        <span className="flex items-center gap-1">♥ {song.likes}</span>
                                      </div>
                                      {/* Delete */}
                                      {deleteConfirm === song.id ? (
                                        <div className="flex items-center gap-2 shrink-0 ml-2">
                                          <span className="text-xs font-medium text-red-600">Delete?</span>
                                          <button onClick={() => handleDeleteSong(song.id, user.id)}
                                            className="adm-btn-red flex items-center gap-1"><Trash2 size={12}/>Yes</button>
                                          <button onClick={() => setDeleteConfirm(null)} className="adm-btn-ghost">No</button>
                                        </div>
                                      ) : (
                                        <button onClick={() => setDeleteConfirm(song.id)}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 shrink-0 ml-4">
                                          <Trash2 size={15}/>
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* ════════════════════ TAB: HOME CONTENT ════════════════════ */}
        {tab === 'home' && (
          <div className="adm-fade space-y-10">
            {homeLoading
              ? <p className="text-gray-500 text-sm">Loading content…</p>
              : (
                <>
                  {/* ── Slideshow Images ── */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Image size={16} className="text-red-600"/>
                      <h2 className="adm-display text-xl font-bold text-gray-900">Hero Slideshow Images</h2>
                    </div>
                    <div className="adm-card p-5 bg-gray-50 space-y-3">
                      {slideshow.map((url, i) => (
                        <div key={i} className="flex gap-2">
                          <input value={url} onChange={e => updateSlide(i, e.target.value)}
                            placeholder="/slideshow pictures/photo.jpg" className={`${inp} flex-1`}/>
                          <button onClick={() => removeSlide(i)}
                            className="text-gray-400 hover:text-red-600 transition-colors bg-white border border-gray-200 rounded px-3 shadow-sm"><X size={16}/></button>
                        </div>
                      ))}
                      <button onClick={addSlide}
                        className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-300 rounded text-sm font-medium transition-colors">
                        <Plus size={14}/>Add image array slot
                      </button>
                    </div>
                  </section>

                  {/* ── Featured Artists ── */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Users size={16} className="text-red-600"/>
                      <h2 className="adm-display text-xl font-bold text-gray-900">Featured Artists</h2>
                    </div>
                    <div className="space-y-6">
                      {artists.map((artist, idx) => (
                        <div key={idx} className="adm-card p-5 bg-gray-50 space-y-4">
                          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Artist {idx + 1}</span>
                            <button onClick={() => removeArtist(idx)}
                              className="text-gray-400 hover:text-red-600 transition-colors"><X size={16}/></button>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Full Name</label><input value={artist.name} onChange={e => updateArtist(idx, 'name', e.target.value)} placeholder="Full name" className={inp}/></div>
                            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Choir</label><input value={artist.choir} onChange={e => updateArtist(idx, 'choir', e.target.value)} placeholder="Choir / ensemble" className={inp}/></div>
                            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Image Path</label><input value={artist.image} onChange={e => updateArtist(idx, 'image', e.target.value)} placeholder="/Artists/photo.jpg" className={inp}/></div>
                            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">YouTube URL</label><input value={artist.youtube} onChange={e => updateArtist(idx, 'youtube', e.target.value)} placeholder="YouTube URL" className={inp}/></div>
                          </div>
                          {/* Songs list */}
                          <div className="bg-white p-4 border border-gray-200 rounded">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Repertoire Highlights</p>
                            <div className="space-y-2">
                              {artist.songs.map((s, si) => (
                                <div key={si} className="flex gap-2">
                                  <input value={s}
                                    onChange={e => {
                                      const updated = [...artist.songs];
                                      updated[si] = e.target.value;
                                      updateArtist(idx, 'songs', updated);
                                    }}
                                    placeholder={`Song ${si + 1}`} className={`${inp} flex-1`}/>
                                  <button onClick={() => {
                                    const updated = artist.songs.filter((_, i) => i !== si);
                                    updateArtist(idx, 'songs', updated);
                                  }} className="text-gray-400 hover:text-red-600 transition-colors px-2"><X size={14}/></button>
                                </div>
                              ))}
                              <button onClick={() => updateArtist(idx, 'songs', [...artist.songs, ''])}
                                className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-xs font-medium transition-colors mt-2">
                                <Plus size={13}/>Add song
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={addArtist}
                        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-400 hover:bg-red-50 rounded font-semibold transition-colors">
                        <Plus size={16}/> Add New Artist Profile
                      </button>
                    </div>
                  </section>

                  {/* ── Save button ── */}
                  <div className="flex items-center gap-4 pt-4 pb-8 border-t border-gray-200">
                    <button onClick={handleSaveHome} disabled={homeSaving}
                      className="flex items-center gap-2 adm-btn-red disabled:opacity-60 px-6 py-3 text-sm shadow-md">
                      <Save size={15}/>{homeSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                    {homeSaved && (
                      <span className="text-emerald-600 text-sm font-semibold adm-fade flex items-center gap-1">✓ Saved successfully!</span>
                    )}
                  </div>
                </>
              )}
          </div>
        )}

        {/* ════════════════════ TAB: PLATFORM STATS ════════════════════ */}
        {tab === 'stats' && (
          <div className="adm-fade">
            {!platformStats
              ? <p className="text-gray-500 text-sm">Loading…</p>
              : (
                <div className="grid sm:grid-cols-3 gap-4 lg:gap-6 pt-2">
                  {[
                    { label: 'Total Users',      value: platformStats.totalUsers,      icon: Users,    color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-100' },
                    { label: 'Total Songs',      value: platformStats.totalSongs,      icon: Music,    color: 'text-red-600',    bg: 'bg-red-50 border-red-100' },
                    { label: 'Song Categories',  value: platformStats.totalCategories, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className={`adm-card p-6 border ${bg} flex flex-col items-center text-center`}>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                         <Icon size={20} className={color}/>
                      </div>
                      <p className={`adm-display text-4xl sm:text-5xl font-black text-gray-900 mb-1`}>{value}</p>
                      <p className="text-gray-500 text-[11px] uppercase tracking-[.18em] font-bold">{label}</p>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    </>
  );
}
