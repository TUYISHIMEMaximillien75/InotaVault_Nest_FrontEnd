import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import logo from "../assets/logo.png";
import icon from "../assets/icon.png";
import CommentsSection from "../components/CommentSection";
import { getLikes, postLikes } from "../api/likes.api";
import SuccessMessage from "../components/SuccessMessage";
import FailMessage from "../components/FailMessage";

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
  useEffect(() => {
    fetchSong();
    logInteraction();
    getComments();
    getLikesCount();
  }, [id]);

  const logInteraction = async () => {
    try {
      await api.post('/song-interactions', {
        action: "view",
        song_id: id,
        user_id: localStorage.getItem("user_id")
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
      console.log(res.data)
      setLikes(res.data)
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
      setLikes(res.data)
    } catch (error) {
      console.error(error);
    }
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
    } catch (error) {
      console.error(error);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const videoId = parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    } catch { return null; }
  };

  if (loading || !song) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading Song...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* PROFESSIONAL NAVBAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <img src={logo} className="h-9 cursor-pointer hover:opacity-80 transition" onClick={() => navigate("/songs")} alt="Logo" />
          <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block" />
          <h1 className="text-lg font-bold text-gray-800 truncate max-w-md">{song.name}</h1>
        </div>
        <button onClick={() => navigate("/songs")} className="text-sm font-semibold text-gray-500 hover:text-red-700 transition">
          {showSuccess && <SuccessMessage success_message={success_message} />}
          {showFail && <FailMessage fail_message={fail_message} />}
          Back to Library
        </button>
      </header>


      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">

        {/* LEFT COLUMN: PLAYER & INFO */}
        <div className="lg:col-span-8 space-y-6">

          {/* MEDIA VIEWER */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <div className="flex bg-gray-900 p-2 gap-2">
              {song.video_file || song.external_link && (
                <button
                  onClick={() => setActiveTab("video")}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${activeTab === "video" ? 'bg-red-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  Video
                </button>
              )}
              {song.pdf_sheet && (
                <button
                  onClick={() => setActiveTab("pdf")}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${activeTab === "pdf" ? 'bg-red-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  Sheet Music
                </button>
              )}
              {song.audio_file && (
                <button
                  onClick={() => setActiveTab("audio")}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${activeTab === "audio" ? 'bg-red-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  Audio Only
                </button>
              )}
            </div>

            <div className="aspect-video bg-black flex items-center justify-center">
              {activeTab === "video" && (
                song.video_file ? (
                  <video controls src={song.video_file} className="w-full h-full" />
                ) : (
                  <iframe src={getYoutubeEmbedUrl(song.external_link!)!} className="w-full h-full" allowFullScreen />
                )
              )}
              {activeTab === "pdf" && (
                <iframe src={song.pdf_sheet} className="w-full h-full bg-white" title="PDF" />
              )}
              {activeTab === "audio" && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-12">
                  <img src={icon} className="w-24 mb-8 opacity-20" alt="" />
                  <audio controls className="w-full max-w-md shadow-lg rounded-full"><source src={song.audio_file} /></audio>
                </div>
              )}
            </div>
          </div>

          {/* SONG INFO & ACTIONS */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">{song.name}</h2>
                <p className="text-red-700 font-semibold mt-1">Artist: {song.artist} <span className="text-gray-300 mx-2">|</span> {song.category}</p>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                {/* Views Count */}
                <div className="px-4 py-2 text-gray-400 text-sm font-medium">
                  <span>{song.view_count.toLocaleString()}</span> Views
                </div>

                {/* Like Button */}
                <button onClick={handleLike} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${isLiked ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  <span>{likes}</span>
                </button>

                {/* Comment Button */}
                <button onClick={() => setActiveComments(!active_comments)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${active_comments ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  <span>{comments.length}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  <span className="hidden md:inline">Comments</span>
                </button>

                {/* NEW: Download Button */}
                <a
                  href={song.pdf_sheet} download
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-red-700 hover:text-white transition-all group"
                >
                  <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden md:inline">Download</span>
                </a>

                {/* Share Button */}
                <button onClick={handleShare} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
              </div>
            </div>

            {active_comments && (
              <CommentsSection songId={song.id} />
            )}
            {!active_comments && (
              <div className="mt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{song.description || "No description provided for this song."}</p>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: RELATED CONTENT */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span>Up Next</span>
              <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full uppercase tracking-tighter">Similar</span>
            </h3>

            <div className="space-y-4">
              {relatedSongs.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/songs/${s.id}`)}
                  className="flex gap-3 group cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                >
                  <div className="w-28 h-16 bg-gray-900 rounded-lg overflow-hidden shrink-0 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-lg opacity-40 group-hover:opacity-100 transition">
                      {s.video_file ? "🎬" : s.pdf_sheet ? "📄" : "🎧"}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="font-bold text-sm text-gray-800 line-clamp-1 group-hover:text-red-700 transition">{s.name}</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-1 uppercase tracking-wider">{s.artist}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{s.view_count.toLocaleString()} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}