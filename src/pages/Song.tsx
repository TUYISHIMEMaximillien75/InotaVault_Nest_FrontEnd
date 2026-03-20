import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api.ts";
import icon from "../assets/icon.png";
import NavBar from "../authorizedPages/NavBar.tsx";
import Search_bar from "./Search_bar.tsx";
import { Eye, Heart, MessageSquare, FileMusic, Headphones, ChevronLeft, ChevronRight } from "lucide-react";

interface Song {
  id: string;
  name: string;
  pdf_sheet?: string;
  video_file?: string;
  audio_file?: string;
  external_link?: string;
  view_count: number;
  category: string;
}

export default function Songs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [limit] = useState(6);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, number>>({});

  const navigate = useNavigate();

  const fetchSongs = async (pageNumber: number) => {
    const filter = localStorage.getItem("filter") || "all";
    setLoading(true);
    try {
      const res = await api.get(`/songs/allsong?category=${filter}&page=${pageNumber}&limit=${limit}`);
      setSongs(res.data.paginatedSong);
      setTotalPages(Math.ceil(res.data.total / limit));
    } catch (error) {
      console.error("Failed to load songs", error);
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeEmbedUrl = (url: string): string | null => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtube.com")) {
        const videoId = parsed.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      if (parsed.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed${parsed.pathname}`;
      }
      return null;
    } catch { return null; }
  };

  const getLikes = async (songId: string) => {
    try { return Number((await api.get(`/likes?song_id=${songId}`)).data); }
    catch { return 0; }
  };

  const getComments = async (songId: string) => {
    try { return Number((await api.get(`/comments/allCommentsNumber?song_id=${songId}`)).data); }
    catch { return 0; }
  };

  useEffect(() => { fetchSongs(page); }, [page]);

  useEffect(() => {
    if (!songs.length) return;
    const fetchStats = async () => {
      const lMap: Record<string, number> = {};
      const cMap: Record<string, number> = {};
      await Promise.all(songs.map(async (s) => {
        lMap[s.id] = await getLikes(s.id);
        cMap[s.id] = await getComments(s.id);
      }));
      setLikes(lMap);
      setComments(cMap);
    };
    fetchStats();
  }, [songs]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f5f0]">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');`}</style>
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 border-[3px] border-gray-200 border-t-red-600 rounded-full animate-spin" />
          <img src={icon} className="absolute w-7 opacity-80" alt="Loading" />
        </div>
        <p className="text-gray-400 text-sm tracking-[.2em] uppercase" style={{ fontFamily:"'DM Sans',sans-serif" }}>
          Loading collection…
        </p>
      </div>
    );
  }

  const filter = localStorage.getItem("filter") || "all";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .songs-display { font-family:'Playfair Display',serif; }
        .songs-body    { font-family:'DM Sans',sans-serif; }
        .song-card { transition: transform .35s cubic-bezier(.34,1.4,.64,1), box-shadow .35s ease; }
        .song-card:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(0,0,0,.10); }
        .media-overlay {
          background: linear-gradient(to top, rgba(10,8,5,.85) 0%, rgba(10,8,5,.25) 55%, transparent 100%);
        }
      `}</style>

      <div className="min-h-screen bg-[#f8f5f0] songs-body">
        <NavBar />

        {localStorage.getItem("search_bar") === "on" && (
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <Search_bar />
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* ── Page header ── */}
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-red-600 text-[10px] font-semibold tracking-[.22em] uppercase mb-2">InotaVault</p>
              <h1 className="songs-display text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
                {filter === "all" ? "The Collection." : <>{filter}<span className="text-red-600">.</span></>}
              </h1>
            </div>
            <p className="songs-body text-gray-400 text-sm">
              Page <strong className="text-gray-700">{page}</strong> of <strong className="text-gray-700">{totalPages}</strong>
            </p>
          </div>

          {/* Thin rule */}
          <div className="h-px bg-gray-200 mb-10" />

          {/* ── Song grid ── */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {songs.map((song, idx) => (
              <div
                key={song.id}
                onClick={() => navigate(`/songs/${song.id}`)}
                className="song-card bg-white border border-gray-100 cursor-pointer overflow-hidden group rounded-none"
              >
                {/* Media area */}
                <div className="aspect-video relative overflow-hidden bg-gray-100">

                  {song.video_file ? (
                    <video src={song.video_file} muted
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : song.external_link && getYoutubeEmbedUrl(song.external_link) ? (
                    <iframe src={getYoutubeEmbedUrl(song.external_link)!}
                      className="w-full h-full pointer-events-none"
                      allow="encrypted-media" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 gap-3">
                      {song.pdf_sheet
                        ? <FileMusic size={40} className="text-gray-300" />
                        : <Headphones size={40} className="text-gray-300" />
                      }
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[.2em]">
                        {song.pdf_sheet ? "Sheet Music" : "Audio Track"}
                      </span>
                    </div>
                  )}

                  {/* Gradient overlay on photo/video */}
                  {(song.video_file || (song.external_link && getYoutubeEmbedUrl(song.external_link))) && (
                    <div className="absolute inset-0 media-overlay pointer-events-none" />
                  )}

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 bg-[#f8f5f0] border border-gray-200 px-2.5 py-1 text-[9px] font-bold text-gray-700 uppercase tracking-[.15em]">
                    {song.category}
                  </div>

                  {/* Index number */}
                  <div className="absolute top-3 right-3 songs-display text-white/30 text-2xl font-black leading-none select-none">
                    {String((page - 1) * limit + idx + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Song info */}
                <div className="p-5">
                  <h2 className="songs-display text-lg font-bold text-gray-900 mb-4 line-clamp-1 group-hover:text-red-700 transition-colors duration-200">
                    {song.name}
                  </h2>

                  {/* Stats row */}
                  <div className="flex items-center gap-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Eye size={13} />
                      <span className="text-xs font-medium">{song.view_count}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Heart size={13} />
                      <span className="text-xs font-medium">{likes[song.id] ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <MessageSquare size={13} />
                      <span className="text-xs font-medium">{comments[song.id] ?? 0}</span>
                    </div>

                    {/* Subtle right arrow that appears on hover */}
                    <div className="ml-auto text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all duration-200">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Pagination ── */}
          <div className="flex items-center justify-center mt-16 gap-3">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:border-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-none"
            >
              <ChevronLeft size={15} /> Prev
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce<(number | "…")[]>((acc, n, i, arr) => {
                  if (i > 0 && n - (arr[i-1] as number) > 1) acc.push("…");
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === "…"
                    ? <span key={`e${i}`} className="px-2 text-gray-400 text-sm">…</span>
                    : <button key={n}
                        onClick={() => setPage(n as number)}
                        className={`w-9 h-9 text-sm font-semibold transition-all ${
                          page === n
                            ? "bg-red-600 text-white"
                            : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                        }`}
                      >{n}</button>
                )
              }
            </div>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:border-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-none"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>

        </main>
      </div>
    </>
  );
}