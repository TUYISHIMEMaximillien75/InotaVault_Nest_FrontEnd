import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api.ts";
import icon from "../assets/icon.png";
import NavBar from "../authorizedPages/NavBar.tsx";
import Search_bar from "./Search_bar.tsx";

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
    const filter = localStorage.getItem("filter");
    setLoading(true);
    try {
      const res = await api.get(`/songs/allsong?category=${filter}&page=${pageNumber}&limit=${limit}`);
      setSongs(res.data.paginatedSong);
      const totalItems = res.data.total;
      setTotalPages(Math.ceil(totalItems / limit));
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
    } catch {
      return null;
    }
  };

  const getLikes = async (songId: string): Promise<number> => {
    try {
      const res = await api.get(`/likes?song_id=${songId}`);
      return Number(res.data);
    } catch (error) {
      return 0;
    }
  };

  const getComments = async (songId: string) => {
    try {
      const res = await api.get(`/comments/allCommentsNumber?song_id=${songId}`);
      return Number(res.data);
    } catch (error) {
      return 0;
    }
  };

  useEffect(() => {
    fetchSongs(page);
  }, [page]);

  useEffect(() => {
    const fetchStats = async () => {
      const likesMap: Record<string, number> = {};
      const commentsMap: Record<string, number> = {};

      await Promise.all(
        songs.map(async (song) => {
          likesMap[song.id] = await getLikes(song.id);
          commentsMap[song.id] = await getComments(song.id);
        })
      );
      setLikes(likesMap);
      setComments(commentsMap);
    };

    if (songs.length > 0) fetchStats();
  }, [songs]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-red-100 border-t-red-700 rounded-full animate-spin"></div>
            <img src={icon} className="absolute w-8 animate-pulse" alt="Loading" />
        </div>
        <p className="mt-4 text-gray-500 font-medium tracking-wide animate-pulse">Loading collection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {localStorage.getItem("search_bar") === "on" && (
        <div className="bg-white border-b border-gray-100 shadow-sm">
           <Search_bar />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {songs.map((song) => (
            <div
              key={song.id}
              onClick={() => navigate(`/songs/${song.id}`)}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* MEDIA PREVIEW CONTAINER */}
              <div className="aspect-video bg-gray-900 relative overflow-hidden">
                {song.video_file ? (
                  <video src={song.video_file} muted className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                ) : song.external_link && getYoutubeEmbedUrl(song.external_link) ? (
                  <iframe
                    src={getYoutubeEmbedUrl(song.external_link)!}
                    className="w-full h-full pointer-events-none"
                    allow="encrypted-media"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                    {song.pdf_sheet ? (
                        <span className="text-4xl mb-2">📄</span>
                    ) : (
                        <span className="text-4xl mb-2">🎧</span>
                    )}
                    <span className="text-xs font-semibold uppercase tracking-wider">{song.pdf_sheet ? 'Sheet Music' : 'Audio Track'}</span>
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-gray-700 uppercase shadow-sm">
                  {song.category}
                </div>
              </div>

              {/* SONG INFO */}
              <div className="p-5">
                <h2 className="font-bold text-gray-800 text-lg mb-4 line-clamp-1 group-hover:text-red-700 transition-colors">
                  {song.name}
                </h2>
                
                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        <span className="text-xs font-medium">{song.view_count}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        <span className="text-xs font-medium">{likes[song.id] ?? 0}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        <span className="text-xs font-medium">{comments[song.id] ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center mt-16 space-x-2">
          <button
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700">
            Page {page} <span className="text-gray-400 font-normal mx-1">of</span> {totalPages}
          </div>

          <button
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </main>
    </div>
  );
}