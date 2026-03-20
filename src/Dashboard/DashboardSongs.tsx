import { Plus, Pencil, Music, Search, ChevronLeft, ChevronRight, Film, Headphones, FileMusic, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getSongByUploaderId, searchInSong, deleteSong } from "../api/song.api";
import { getProfile } from "../api/auth.api";
import { useState, useEffect } from "react";
import icon from "../assets/icon.png";

export default function DashboardSongs() {
  const [songs, setSongs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Initial load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await getProfile();
        const userId = userRes.data?.id;
        if (userId) {
          const songsRes = await getSongByUploaderId(userId);
          setSongs(songsRes.data);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) return;
    setCurrentPage(1);
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await searchInSong(searchQuery);
        setSongs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const songList: any[] = Array.isArray(songs) ? songs : (songs?.songs || songs?.data || []);
  const totalItems = songList.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const idxFirst = (currentPage - 1) * ITEMS_PER_PAGE;
  const idxLast  = idxFirst + ITEMS_PER_PAGE;
  const currentSongs = songList.slice(idxFirst, idxLast);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteSong(id);
        const userRes = await getProfile();
        const userId = userRes.data?.id;
        if (userId) {
          const songsRes = await getSongByUploaderId(userId);
          setSongs(songsRes.data);
        }
      } catch (err) {
        console.error("Failed to delete song", err);
        alert("Failed to delete the song. Please try again.");
      }
    }
  };

  const mediaIcons = (song: any) => (
    <div className="flex items-center gap-1.5">
      {song.audio_file   && <span title="Audio" className="flex"><Headphones size={12} className="text-green-500" /></span>}
      {(song.video_file || song.external_link) && <span title="Video" className="flex"><Film size={12} className="text-blue-500" /></span>}
      {song.pdf_sheet    && <span title="Sheet" className="flex"><FileMusic size={12} className="text-amber-500" /></span>}
    </div>
  );

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#f8f5f0]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');`}</style>
      <div className="relative">
        <div className="w-12 h-12 border-[2.5px] border-gray-200 border-t-red-600 rounded-full animate-spin" />
        <img src={icon} className="absolute inset-0 m-auto w-5 opacity-60" alt="" />
      </div>
      <p className="text-gray-400 text-xs tracking-[.2em] uppercase" style={{ fontFamily:"'DM Sans',sans-serif" }}>
        Loading library…
      </p>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900&family=DM+Sans:wght@400;500;600&display=swap');
        .ds-display { font-family: 'Playfair Display', serif; }
        .ds-body    { font-family: 'DM Sans', sans-serif; }
        @keyframes dsFadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .ds-f1 { animation: dsFadeUp .4s .04s both; }
        .ds-f2 { animation: dsFadeUp .4s .10s both; }
        .ds-f3 { animation: dsFadeUp .4s .16s both; }
        .ds-row { transition: background .12s; }
        .ds-row:hover { background: #faf9f7; }
        .ds-input {
          width: 100%;
          padding: 9px 12px 9px 38px;
          background: #fff;
          border: 1px solid #e5e7eb;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #111827;
          outline: none;
          transition: border-color .16s, box-shadow .16s;
        }
        .ds-input::placeholder { color: #9ca3af; }
        .ds-input:focus { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,.07); }
      `}</style>

      <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6 ds-body">

        {/* ── Header ── */}
        <div className="ds-f1 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-[.22em] mb-2">Your Vault</p>
            <h1 className="ds-display text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
              Songs Library<span className="text-red-600">.</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {totalItems} {totalItems === 1 ? "song" : "songs"} in your collection
            </p>
          </div>
          <NavLink
            to="/dashboard/upload"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-[0_4px_16px_rgba(220,38,38,.25)] shrink-0"
          >
            <Plus size={15} /> Add New Song
          </NavLink>
        </div>

        {/* ── Search bar ── */}
        <div className="ds-f2">
          <div className="bg-white border border-gray-200 p-4 flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative w-full sm:max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title or composer…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ds-input"
              />
            </div>
            {searching && (
              <p className="text-[11px] text-gray-400 uppercase tracking-widest animate-pulse">Searching…</p>
            )}
            <p className="sm:ml-auto text-[11px] text-gray-400 uppercase tracking-[.18em] shrink-0">
              {totalPages > 0 ? `Page ${currentPage} / ${totalPages}` : "No results"}
            </p>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="ds-f3 bg-white border border-gray-200 overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-[.16em]">
                  <th className="px-6 py-3">Song</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 hidden md:table-cell">Media</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Added</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentSongs.length > 0 ? (
                  currentSongs.map((song: any, idx: number) => (
                    <tr key={song.id} className="ds-row">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Index + icon box */}
                          <div className="relative w-9 h-9 bg-red-600 flex items-center justify-center shrink-0">
                            <Music size={14} className="text-white" />
                            <span className="absolute top-1 left-1 ds-display text-[9px] font-black text-white leading-none select-none">
                              {String(idxFirst + idx + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="ds-display text-sm font-bold text-gray-900 truncate max-w-[180px]">{song.name}</p>
                            <p className="text-gray-400 text-[11px] truncate max-w-[180px]">{song.artist || "Unknown Artist"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        {song.category && (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wide">
                            {song.category}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        {mediaIcons(song)}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-[11px] text-gray-400">
                        {song.createdAt ? fmtDate(song.createdAt) : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <NavLink
                            to={`/dashboard/edit_song/${song.id}`}
                            className="w-8 h-8 flex items-center justify-center border border-transparent text-gray-400 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </NavLink>
                          <button
                            onClick={() => handleDelete(song.id, song.name)}
                            className="w-8 h-8 flex items-center justify-center border border-transparent text-gray-400 hover:border-red-200 hover:text-red-700 hover:bg-red-50 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-200 flex items-center justify-center">
                          <Music size={20} className="text-gray-300" />
                        </div>
                        <p className="ds-display font-bold text-gray-600">No songs found</p>
                        <p className="text-gray-400 text-xs">
                          {searchQuery ? `No results for "${searchQuery}"` : "Start building your vault by uploading a song."}
                        </p>
                        {!searchQuery && (
                          <NavLink to="/dashboard/upload"
                            className="mt-1 px-5 py-2 bg-red-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-700 transition-colors">
                            Upload first song
                          </NavLink>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination footer ── */}
          <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
            <p className="text-[11px] text-gray-400 ds-body">
              Showing{" "}
              <span className="font-semibold text-gray-700">{totalItems > 0 ? idxFirst + 1 : 0}</span>
              {" – "}
              <span className="font-semibold text-gray-700">{Math.min(idxLast, totalItems)}</span>
              {" of "}
              <span className="font-semibold text-gray-700">{totalItems}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={14} />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
                .reduce<(number | "…")[]>((acc, n, i, arr) => {
                  if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push("…");
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === "…"
                    ? <span key={`e${i}`} className="w-8 text-center text-gray-400 text-xs">…</span>
                    : <button key={n}
                        onClick={() => setCurrentPage(n as number)}
                        className={`w-8 h-8 text-xs font-semibold border transition-all ${
                          currentPage === n
                            ? "bg-red-600 border-red-600 text-white"
                            : "bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
                        }`}
                      >{n}</button>
                )
              }

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}