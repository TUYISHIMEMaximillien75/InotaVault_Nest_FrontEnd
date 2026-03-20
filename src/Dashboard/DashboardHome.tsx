import { useState, useEffect } from "react";
import { getSongByUploaderId } from "../api/song.api";
import { getMe } from "../api/user.api";
import { getAllRepertoires } from "../api/repertoire.api";
import { getTotalCommentsByUploader } from "../api/comments.api";
import { NavLink } from "react-router-dom";
import icon from "../assets/icon.png";

import {
  Music2, BookOpen, Upload, Plus, ArrowRight,
  MicVocal, Layers, Tag, ExternalLink, Clock, Heart,
  Eye, MessageCircle, TrendingUp, Film, Headphones, FileMusic,
} from "lucide-react";

interface Song {
  id: string; name: string; artist: string; category: string;
  createdAt?: string; pdf_sheet?: string; audio_file?: string;
  video_file?: string; external_link?: string; likes?: number; view_count?: number;
}
interface Repertoire {
  id: string; title: string; event_type: string; createdAt?: string;
}

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [repertoires, setRepertoires] = useState<Repertoire[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const userRes = await getMe();
        const profile = userRes.data;
        setUser(profile);
        const [songsRes, repertoiresRes] = await Promise.all([
          getSongByUploaderId(profile.id),
          getAllRepertoires(),
        ]);
        const songsData: Song[] = songsRes.data?.songs || songsRes.data || [];
        const cats: string[] = songsRes.data?.categories || [];
        setSongs(songsData);
        setCategories(cats);
        setRepertoires(repertoiresRes.data || []);
        if (songsData.length > 0) {
          try {
            const commentsRes = await getTotalCommentsByUploader(songsData.map(s => s.id));
            setTotalComments(typeof commentsRes.data === "number" ? commentsRes.data : 0);
          } catch { setTotalComments(0); }
        }
      } catch (err: any) {
        console.error("Dashboard load failed", err);
        setErrorMsg(err?.response?.data?.message || err?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex flex-col items-center justify-center gap-4">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');`}</style>
        <div className="relative">
          <div className="w-12 h-12 border-[2.5px] border-gray-200 border-t-red-600 rounded-full animate-spin" />
        </div>
        <p className="text-gray-400 text-sm tracking-widest uppercase" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          Opening your vault…
        </p>
        <img src={icon} className="w-14" alt="" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center p-8">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
        <div className="bg-white border border-gray-200 w-full max-w-md" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          <div className="h-[3px] bg-red-600" />
          <div className="px-8 py-10 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 bg-red-50 border border-red-100 flex items-center justify-center">
              <TrendingUp size={22} className="text-red-400" />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>
                Error Loading Dashboard
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">{errorMsg}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gray-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const recentSongs = [...songs]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const recentRepertoires = [...repertoires]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 4);

  const songHasPDF   = songs.filter(s => s.pdf_sheet).length;
  const songHasAudio = songs.filter(s => s.audio_file).length;
  const songHasVideo = songs.filter(s => s.video_file || s.external_link).length;
  const totalLikes   = songs.reduce((sum, s) => sum + (s.likes || 0), 0);
  const totalViews   = songs.reduce((sum, s) => sum + (s.view_count || 0), 0);

  const topSongs = [...songs]
    .sort((a, b) => ((b.likes || 0) + (b.view_count || 0)) - ((a.likes || 0) + (a.view_count || 0)))
    .slice(0, 5);

  const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .db-display { font-family: 'Playfair Display', serif; }
        .db-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes dbFadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .db-f1 { animation: dbFadeUp .45s .04s both; }
        .db-f2 { animation: dbFadeUp .45s .10s both; }
        .db-f3 { animation: dbFadeUp .45s .16s both; }
        .db-f4 { animation: dbFadeUp .45s .22s both; }
        .db-f5 { animation: dbFadeUp .45s .28s both; }
        .db-f6 { animation: dbFadeUp .45s .34s both; }

        .stat-card { transition: transform .22s, box-shadow .22s; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,.07); }

        .song-row { transition: background .15s; }
        .song-row:hover { background: #faf9f7; }

        .rep-row { transition: background .15s; }
        .rep-row:hover { background: #faf9f7; }

        .qa-card { transition: transform .2s, box-shadow .2s; }
        .qa-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.08); }

        .bar-fill {
          background: linear-gradient(90deg, #dc2626, #f87171);
          transition: width .6s cubic-bezier(.4,0,.2,1);
        }
      `}</style>

      <div className="db-body bg-[#f8f5f0] min-h-screen p-5 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-7">

          {/* ═══ HEADER ═══ */}
          <div className="db-f1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[.22em] mb-2">Dashboard</p>
              <h1 className="db-display text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                {user?.name || "Musician"}<span className="text-red-600 italic">.</span>
              </h1>
              <p className="db-body text-gray-400 text-sm mt-1">{user?.email}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <NavLink to="/dashboard/upload"
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-[0_4px_16px_rgba(220,38,38,.25)]">
                <Upload size={14} /> Upload
              </NavLink>
              <NavLink to="/dashboard/create_repertoires"
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors">
                <Plus size={14} /> Repertoire
              </NavLink>
            </div>
          </div>

          {/* ═══ PRIMARY STATS ═══ */}
          <div className="db-f2 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Music2,  label: "Songs",       value: songs.length,       accent: "border-l-red-500",    iconColor: "text-red-600",    iconBg: "bg-red-50" },
              { icon: BookOpen,label: "Repertoires", value: repertoires.length, accent: "border-l-blue-500",   iconColor: "text-blue-600",   iconBg: "bg-blue-50" },
              { icon: Tag,     label: "Categories",  value: categories.length,  accent: "border-l-violet-500", iconColor: "text-violet-600", iconBg: "bg-violet-50" },
              { icon: Layers,  label: "PDF Sheets",  value: songHasPDF,         accent: "border-l-amber-500",  iconColor: "text-amber-600",  iconBg: "bg-amber-50" },
            ].map(({ icon: Icon, label, value, accent, iconColor, iconBg }) => (
              <div key={label} className={`stat-card bg-white border border-gray-200 border-l-[3px] ${accent} p-5 flex items-center gap-4`}>
                <div className={`w-11 h-11 ${iconBg} flex items-center justify-center shrink-0`}>
                  <Icon size={20} className={iconColor} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.15em]">{label}</p>
                  <p className="db-display text-2xl font-black text-gray-900 leading-none mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ═══ MEDIA BREAKDOWN ═══ */}
          <div className="db-f3 grid grid-cols-3 gap-3">
            {[
              { icon: Headphones, label: "Audio", value: songHasAudio, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
              { icon: Film,       label: "Video", value: songHasVideo, color: "text-blue-600",  bg: "bg-blue-50",  border: "border-blue-100"  },
              { icon: FileMusic,  label: "Sheets", value: songHasPDF,  color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
            ].map(({ icon: Icon, label, value, color, bg, border }) => (
              <div key={label} className={`bg-white border ${border} flex items-center gap-3 px-4 py-3.5`}>
                <div className={`w-9 h-9 ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={color} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.14em]">{label}</p>
                  <p className="db-display text-xl font-black text-gray-900 leading-none mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ═══ ENGAGEMENT PANEL ═══ */}
          <div className="db-f4 bg-white border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <TrendingUp size={16} className="text-red-500" />
              <h2 className="db-display font-bold text-gray-900">Audience Engagement</h2>
              <span className="ml-auto text-[10px] font-bold text-gray-400 uppercase tracking-[.18em]">All-time</span>
            </div>

            {/* Metric trio */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
              {[
                { icon: Heart,         label: "Likes",    value: totalLikes,    color: "text-rose-500",   bg: "bg-rose-50",   border: "border-l-rose-500" },
                { icon: Eye,           label: "Views",    value: totalViews,    color: "text-blue-500",   bg: "bg-blue-50",   border: "border-l-blue-500" },
                { icon: MessageCircle, label: "Comments", value: totalComments, color: "text-violet-500", bg: "bg-violet-50", border: "border-l-violet-500" },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="flex items-center gap-3 px-5 py-5">
                  <div className={`w-9 h-9 ${bg} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={color} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.14em]">{label}</p>
                    <p className="db-display text-2xl font-black text-gray-900 leading-none mt-0.5">{value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Top songs table */}
            {topSongs.length > 0 ? (
              <>
                <div className="px-6 py-2.5 bg-gray-50 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.18em]">Top by Engagement</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[.14em] text-gray-400 border-b border-gray-100">
                      <th className="px-6 py-2 text-left w-8">#</th>
                      <th className="px-4 py-2 text-left">Song</th>
                      <th className="px-4 py-2 text-center"><Heart size={10} className="inline text-rose-400 mr-1" />Likes</th>
                      <th className="px-4 py-2 text-center"><Eye size={10} className="inline text-blue-400 mr-1" />Views</th>
                      <th className="px-4 py-2 hidden md:table-cell">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSongs.map((song, i) => {
                      const score = (song.likes || 0) + (song.view_count || 0);
                      const pct = topSongs[0] ? Math.round((score / ((topSongs[0].likes || 0) + (topSongs[0].view_count || 0))) * 100) : 0;
                      return (
                        <tr key={song.id} className="song-row border-t border-gray-50">
                          <td className="px-6 py-3">
                            <span className={`db-display text-sm font-black ${i === 0 ? "text-amber-400" : "text-gray-300"}`}>
                              {i === 0 ? "①" : `${i + 1}`}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800 text-sm truncate max-w-[180px]">{song.name}</p>
                            <p className="text-gray-400 text-[11px] truncate max-w-[180px]">{song.artist}</p>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-bold text-rose-500 text-sm">{(song.likes || 0).toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-bold text-blue-500 text-sm">{(song.view_count || 0).toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-100 overflow-hidden">
                                <div className="bar-fill h-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[11px] font-semibold text-gray-400 w-8 shrink-0">{score}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="flex flex-col items-center py-10 text-center gap-2">
                <TrendingUp size={28} className="text-gray-200" />
                <p className="text-gray-400 text-sm">Upload songs to track engagement.</p>
              </div>
            )}
          </div>

          {/* ═══ RECENT SONGS + REPERTOIRES ═══ */}
          <div className="db-f5 grid lg:grid-cols-3 gap-5">

            {/* Songs — 2/3 */}
            <div className="lg:col-span-2 bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music2 size={15} className="text-red-600" />
                  <h2 className="db-display font-bold text-gray-900">Recent Songs</h2>
                </div>
                <NavLink to="/dashboard/songs" className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-800 uppercase tracking-wider transition-colors">
                  All <ArrowRight size={12} />
                </NavLink>
              </div>

              {recentSongs.length === 0 ? (
                <div className="flex flex-col items-center py-14 text-center px-6 gap-4">
                  <div className="w-14 h-14 bg-red-50 flex items-center justify-center">
                    <MicVocal size={24} className="text-red-300" />
                  </div>
                  <div>
                    <p className="db-display font-bold text-gray-700 mb-1">No songs yet</p>
                    <p className="text-gray-400 text-xs">Start building your vault.</p>
                  </div>
                  <NavLink to="/dashboard/upload" className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
                    Upload first song
                  </NavLink>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[.14em] text-gray-400 bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-2.5 text-left">Song</th>
                      <th className="px-4 py-2.5 text-left hidden md:table-cell">Category</th>
                      <th className="px-4 py-2.5 text-left hidden md:table-cell">Media</th>
                      <th className="px-4 py-2.5 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSongs.map((song) => (
                      <tr key={song.id} className="song-row border-t border-gray-50">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-600 flex items-center justify-center shrink-0">
                              <Music2 size={13} className="text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm truncate max-w-[150px]">{song.name}</p>
                              <p className="text-gray-400 text-[11px] truncate max-w-[150px]">{song.artist}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          {song.category && (
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wide">
                              {song.category}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            {song.audio_file && <span title="Audio" className="flex items-center"><Headphones size={12} className="text-green-500" /></span>}
                            {song.video_file && <span title="Video" className="flex items-center"><Film size={12} className="text-blue-500" /></span>}
                            {song.pdf_sheet  && <span title="PDF" className="flex items-center"><FileMusic size={12} className="text-amber-500" /></span>}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right text-gray-400 text-[11px] whitespace-nowrap">
                          {fmtDate(song.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Repertoires — 1/3 */}
            <div className="bg-white border border-gray-200 flex flex-col">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={15} className="text-blue-600" />
                  <h2 className="db-display font-bold text-gray-900">Repertoires</h2>
                </div>
                <NavLink to="/dashboard/repertoires" className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider transition-colors">
                  All <ArrowRight size={12} />
                </NavLink>
              </div>

              <div className="flex-1 divide-y divide-gray-50">
                {recentRepertoires.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center px-5 gap-4">
                    <div className="w-12 h-12 bg-blue-50 flex items-center justify-center">
                      <BookOpen size={22} className="text-blue-300" />
                    </div>
                    <div>
                      <p className="db-display font-bold text-gray-700 text-sm mb-1">No repertoires</p>
                      <p className="text-gray-400 text-xs">Organize songs for events.</p>
                    </div>
                    <NavLink to="/dashboard/create_repertoires" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors">
                      Create one
                    </NavLink>
                  </div>
                ) : (
                  recentRepertoires.map((rep) => (
                    <div key={rep.id} className="rep-row px-5 py-4 flex items-start gap-3 group">
                      <div className="w-8 h-8 bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen size={13} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{rep.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[11px] text-gray-400">{rep.event_type}</span>
                          <NavLink to={`/dashboard/edit_repertoire/${rep.id}`}
                            className="text-[11px] text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            Edit <ExternalLink size={9} />
                          </NavLink>
                        </div>
                        {rep.createdAt && (
                          <p className="text-[10px] text-gray-300 flex items-center gap-1 mt-1">
                            <Clock size={9} /> {fmtDate(rep.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {repertoires.length > 0 && (
                <div className="p-4 border-t border-gray-100">
                  <NavLink to="/dashboard/create_repertoires"
                    className="flex items-center justify-center gap-2 w-full py-2.5 border border-dashed border-gray-200 text-xs font-bold text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors uppercase tracking-wider">
                    <Plus size={13} /> New Repertoire
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* ═══ CATEGORIES ═══ */}
          {categories.length > 0 && (
            <div className="db-f6 bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Tag size={15} className="text-violet-600" />
                <h2 className="db-display font-bold text-gray-900">Your Categories</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const count = songs.filter(s => s.category === cat).length;
                  return (
                    <div key={cat} className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-100">
                      <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">{cat}</span>
                      <span className="text-[10px] font-bold text-violet-400 bg-violet-100 px-1.5 py-0.5">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ QUICK ACTIONS ═══ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: "/dashboard/upload",             label: "Upload Song",    icon: Upload,      bg: "bg-red-600",    hover: "hover:bg-red-700",    text: "text-red-700",    lightBg: "bg-red-50 border-red-100"    },
              { to: "/dashboard/create_repertoires", label: "New Repertoire", icon: Plus,        bg: "bg-blue-600",   hover: "hover:bg-blue-700",   text: "text-blue-700",   lightBg: "bg-blue-50 border-blue-100"  },
              { to: "/dashboard/songs",              label: "My Library",     icon: Music2,      bg: "bg-violet-600", hover: "hover:bg-violet-700", text: "text-violet-700", lightBg: "bg-violet-50 border-violet-100" },
              { to: "/songs",                        label: "Explore",        icon: ExternalLink, bg: "bg-gray-800",  hover: "hover:bg-gray-900",   text: "text-gray-700",   lightBg: "bg-gray-50 border-gray-200"  },
            ].map(({ to, label, icon: Icon, bg, hover, text, lightBg }) => (
              <NavLink key={to} to={to}
                className={`qa-card group flex flex-col items-center justify-center gap-3 p-5 border ${lightBg} text-center`}>
                <div className={`w-10 h-10 ${bg} ${hover} flex items-center justify-center transition-colors group-hover:scale-110 duration-200`}>
                  <Icon size={17} className="text-white" />
                </div>
                <span className={`text-xs font-bold ${text} uppercase tracking-[.12em]`}>{label}</span>
              </NavLink>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}