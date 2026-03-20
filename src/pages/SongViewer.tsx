import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import logo from "../assets/logo.png";
import icon from "../assets/icon.png";
import CommentsSection from "../components/CommentSection";
import { getLikes, postLikes } from "../api/likes.api";
import SuccessMessage from "../components/SuccessMessage";
import FailMessage from "../components/FailMessage";
import {
  ArrowLeft, Heart, MessageSquare, Share2, Download,
  Eye, Music, Film, Headphones, ChevronRight
} from "lucide-react";

interface Song {
  id: string;
  name: string;
  artist: string;
  pdf_sheet?: string;
  audio_file?: string;
  video_file?: string;
  external_link?: string;
  description?: string;
  view_count: number;
  category?: string;
  likes?: number;
}

export default function SongView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [song, setSong] = useState<Song | null>(null);
  const [relatedSongs, setRelatedSongs] = useState<Song[]>([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState<"video" | "pdf" | "audio">("pdf");
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [active_comments, setActiveComments] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [success_message, setSuccessMessage] = useState("");
  const [showFail, setShowFail] = useState(false);
  const [fail_message, setFailMessage] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetchSong();
    logInteraction();
    getComments();
    getLikesCount();
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [id]);

  // Auto-select best available tab on song load
  useEffect(() => {
    if (!song) return;
    if (song.video_file || song.external_link) setActiveTab("video");
    else if (song.pdf_sheet) setActiveTab("pdf");
    else if (song.audio_file) setActiveTab("audio");
  }, [song]);

  const logInteraction = async () => {
    try {
      await api.post('/song-interactions', {
        action: "view",
        song_id: id
      });
    } catch (error) { console.log(error); }
  };

  const fetchSong = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/songs/song/${id}`);
      setSong(res.data);
      const related = await api.get(`songs/allsong?category=${res.data.category || "ALL"}&page=1&limit=6`);
      setRelatedSongs(related.data.paginatedSong.filter((s: Song) => s.id !== String(id)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const res = await postLikes(id!);
      setLikes(res.data);
      setIsLiked(true);
      if (song) setSong({ ...song, likes: (song.likes || 0) + 1 });
    } catch (err: any) {
      setShowFail(true);
      setFailMessage("Please log in to like this song");
      setTimeout(() => setShowFail(false), 3000);
    }
  };

  const getLikesCount = async () => {
    try {
      const res = await getLikes(id!);
      setLikes(res.data);
    } catch (error) { console.error(error); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSuccessMessage("Link copied to clipboard!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getComments = async () => {
    try {
      const res = await api.get(`/comments/allComments?song_id=${id}`);
      setComments(res.data);
    } catch (error) { console.error(error); }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const videoId = parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    } catch { return null; }
  };

  /* ── LOADING ── */
  if (loading || !song) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f5f0]">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');`}</style>
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 border-[3px] border-gray-200 border-t-red-600 rounded-full animate-spin" />
          <img src={icon} className="absolute w-7 opacity-70" alt="Loading" />
        </div>
        <p className="text-gray-400 text-sm tracking-[.2em] uppercase" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          Loading Song…
        </p>
      </div>
    );
  }

  const hasTabs = [song.video_file || song.external_link, song.pdf_sheet, song.audio_file].filter(Boolean).length > 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .sv-display { font-family: 'Playfair Display', serif; }
        .sv-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes svFadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .sv-fade-1 { animation: svFadeUp .5s .05s both; }
        .sv-fade-2 { animation: svFadeUp .5s .15s both; }
        .sv-fade-3 { animation: svFadeUp .5s .25s both; }

        .tab-active {
          background: #dc2626;
          color: #fff;
        }
        .tab-inactive {
          color: rgba(255,255,255,.45);
        }
        .tab-inactive:hover {
          color: rgba(255,255,255,.8);
          background: rgba(255,255,255,.06);
        }
        .related-card:hover .related-title { color: #dc2626; }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .06em;
          text-transform: uppercase;
          border: 1px solid #e5e7eb;
          background: white;
          color: #374151;
          transition: all .2s ease;
          cursor: pointer;
          white-space: nowrap;
        }
        .action-btn:hover { border-color: #dc2626; color: #dc2626; background: #fef2f2; }
        .action-btn.liked  { border-color: #dc2626; color: #dc2626; background: #fef2f2; }
        .action-btn.primary { background: #dc2626; border-color: #dc2626; color: white; }
        .action-btn.primary:hover { background: #b91c1c; }
      `}</style>

      <div className="min-h-screen bg-[#f8f5f0] sv-body">

        {/* ── Notifications ── */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
          {showSuccess && <SuccessMessage success_message={success_message} />}
          {showFail && <FailMessage fail_message={fail_message} />}
        </div>

        {/* ═══════════════ STICKY HEADER ═══════════════ */}
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#f8f5f0]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,.08)] border-b border-gray-200"
            : "bg-[#f8f5f0] border-b border-gray-200"
        }`}>
          {/* Red top rule */}
          <div className="h-[3px] bg-red-600" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 gap-4">
              {/* Back */}
              <button
                onClick={() => navigate("/songs")}
                className="flex items-center gap-2 text-gray-500 hover:text-red-700 text-sm font-medium transition-colors shrink-0"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Library</span>
              </button>

              {/* Song title — center */}
              <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
                <img src={logo} alt="InotaVault" className="h-6 w-auto shrink-0 hidden md:block" />
                <span className="hidden md:block w-px h-4 bg-gray-300" />
                <h1 className="sv-display text-sm sm:text-base font-bold text-gray-900 truncate">
                  {song.name}
                </h1>
              </div>

              {/* Category badge */}
              {song.category && (
                <div className="shrink-0 hidden sm:flex items-center px-3 py-1 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-[.15em]">
                  {song.category}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

            {/* ═══════════════ LEFT / MAIN COLUMN ═══════════════ */}
            <div className="lg:col-span-8 space-y-0 sv-fade-1">

              {/* ── Media Player ── */}
              <div className="bg-gray-950 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,.22)]">

                {/* Tab bar */}
                {hasTabs && (
                  <div className="flex items-center gap-1 px-4 pt-3 pb-0">
                    {(song.video_file || song.external_link) && (
                      <button
                        onClick={() => setActiveTab("video")}
                        className={`flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all rounded-t-sm ${activeTab === "video" ? "tab-active" : "tab-inactive"}`}
                      >
                        <Film size={12} /> Video
                      </button>
                    )}
                    {song.pdf_sheet && (
                      <button
                        onClick={() => setActiveTab("pdf")}
                        className={`flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all rounded-t-sm ${activeTab === "pdf" ? "tab-active" : "tab-inactive"}`}
                      >
                        <Music size={12} /> Sheet
                      </button>
                    )}
                    {song.audio_file && (
                      <button
                        onClick={() => setActiveTab("audio")}
                        className={`flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all rounded-t-sm ${activeTab === "audio" ? "tab-active" : "tab-inactive"}`}
                      >
                        <Headphones size={12} /> Audio
                      </button>
                    )}
                  </div>
                )}

                {/* Viewer */}
                <div className="aspect-video bg-black flex items-center justify-center">
                  {activeTab === "video" && (
                    song.video_file
                      ? <video controls src={song.video_file} className="w-full h-full" />
                      : <iframe src={getYoutubeEmbedUrl(song.external_link!)!} className="w-full h-full" allowFullScreen />
                  )}
                  {activeTab === "pdf" && (
                    <iframe src={song.pdf_sheet} className="w-full h-full bg-white" title="Sheet Music PDF" />
                  )}
                  {activeTab === "audio" && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 p-10 gap-8">
                      {/* Vinyl-style visual */}
                      <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center animate-spin" style={{ animationDuration: "4s" }}>
                          <div className="w-8 h-8 rounded-full bg-gray-950 border-2 border-gray-700" />
                        </div>
                        <img src={icon} className="absolute inset-0 m-auto w-6 opacity-40" alt="" />
                      </div>
                      <audio controls className="w-full max-w-sm">
                        <source src={song.audio_file} />
                      </audio>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Song Info Card ── */}
              <div className="bg-white border border-gray-100 shadow-sm sv-fade-2">

                {/* Title + meta */}
                <div className="px-6 pt-6 pb-5 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="sv-display text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-2">
                        {song.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <span className="text-red-600 font-semibold">{song.artist}</span>
                        {song.category && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="text-gray-500">{song.category}</span>
                          </>
                        )}
                        <span className="text-gray-300">·</span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Eye size={13} /> {song.view_count.toLocaleString()} views
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button onClick={handleLike} className={`action-btn ${isLiked ? "liked" : ""}`}>
                        <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                        <span>{likes}</span>
                      </button>

                      <button
                        onClick={() => setActiveComments(!active_comments)}
                        className={`action-btn ${active_comments ? "liked" : ""}`}
                      >
                        <MessageSquare size={14} />
                        <span>{comments.length}</span>
                        <span className="hidden sm:inline">Comments</span>
                      </button>

                      {song.pdf_sheet && (
                        <a href={song.pdf_sheet} download className="action-btn primary">
                          <Download size={14} />
                          <span className="hidden sm:inline">Sheet</span>
                        </a>
                      )}

                      <button onClick={handleShare} className="action-btn">
                        <Share2 size={14} />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description / Comments toggle area */}
                <div className="px-6 py-5">
                  {active_comments ? (
                    <CommentsSection songId={song.id} />
                  ) : (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.2em] mb-3">About this song</p>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line sv-body text-sm">
                        {song.description || "No description has been provided for this song."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ═══════════════ RIGHT / ASIDE ═══════════════ */}
            <aside className="lg:col-span-4 sv-fade-3">
              <div className="bg-white border border-gray-100 shadow-sm sticky top-[71px]">

                {/* Aside header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.2em]">Up Next</p>
                    <h3 className="sv-display text-lg font-bold text-gray-900 leading-tight">Similar Songs</h3>
                  </div>
                  {song.category && (
                    <span className="text-[9px] bg-red-50 text-red-600 border border-red-100 px-2 py-1 font-bold uppercase tracking-wider">
                      {song.category}
                    </span>
                  )}
                </div>

                {/* Related list */}
                <div className="divide-y divide-gray-50">
                  {relatedSongs.length === 0 && (
                    <p className="px-5 py-8 text-sm text-gray-400 text-center sv-body italic">No related songs found.</p>
                  )}
                  {relatedSongs.map((s, idx) => (
                    <div
                      key={s.id}
                      onClick={() => navigate(`/songs/${s.id}`)}
                      className="related-card flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                    >
                      {/* Thumbnail placeholder */}
                      <div className="w-14 h-14 shrink-0 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                        <div className="text-gray-300 group-hover:scale-110 transition-transform duration-300">
                          {s.video_file ? <Film size={22} /> : s.pdf_sheet ? <Music size={22} /> : <Headphones size={22} />}
                        </div>
                        {/* Index */}
                        <span className="absolute top-0.5 left-1 sv-display text-[10px] font-black text-gray-300 leading-none">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="related-title sv-display text-sm font-bold text-gray-900 line-clamp-1 transition-colors duration-200">
                          {s.name}
                        </p>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5 truncate">{s.artist}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <Eye size={10} /> {s.view_count.toLocaleString()}
                        </p>
                      </div>

                      <ChevronRight size={14} className="text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </main>
      </div>
    </>
  );
}