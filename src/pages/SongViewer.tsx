import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import logo from "../assets/logo.png";
import icon from "../assets/icon.png"

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
  const [activeTab, setActiveTab] = useState<"video" | "pdf" | "audio">("video");
  const [loading, setLoading] = useState(true);

  console.log("The song is ", song);

  useEffect(() => {
    fetchSong();
  }, [id]);

  const fetchSong = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/songs/song/${id}`);
      setSong(res.data);
      // console.log("The song is set ", res.data);


      // fetch related songs (same category or fallback)
      const related = await api.get(
        `songs/allsong?category=${res.data.category || "ALL"}&page=1&limit=6`
      );
      // console.log("Those are related ", related.data.paginatedSong.filter((s: Song) => s.id !== String(id)));
      setRelatedSongs(
        related.data.paginatedSong.filter((s: Song) => s.id !== String(id))
      );

      // console.log("Those are related ", res.data.category);
    } catch (error) {
      console.error("Failed to load song", error);
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeEmbedUrl = (url: string): string | null => {
    try {
      const parsed = new URL(url);

      // https://www.youtube.com/watch?v=VIDEO_ID
      if (parsed.hostname.includes("youtube.com")) {
        const videoId = parsed.searchParams.get("v");
        return videoId
          ? `https://www.youtube.com/embed/${videoId}`
          : null;
      }

      // https://youtu.be/VIDEO_ID
      if (parsed.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed${parsed.pathname}`;
      }

      return null;
    } catch {
      return null;
    }
  };

  const likeSong = async () => {
    await api.post(`/likes?song_id=${id}`).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      alert(err.response.data.message + "\nLog In to like the song");
    })
  }


  if (loading || !song) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-red-700 border-t-transparent border-solid rounded-full animate-spin"></div>

          {/* Animated text */}
          <div className="flex space-x-1">
            <span className="animate-ping">.</span>
            <span className="animate-ping animation-delay-200">.</span>
            <span className="animate-ping animation-delay-400">.</span>
          </div>

          <p className="text-gray-600 text-lg font-medium">Loading a song</p>
          <img src={icon} className=" animate-bounce max-w-20" alt="" />
        </div>
      </div>

    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="flex items-center gap-4 p-4 bg-white shadow">
        <img src={logo} className="h-10 cursor-pointer" onClick={() => navigate("/songs")} />
        <h1 className="text-xl font-bold">{song.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* MAIN VIEW */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
          {/* TABS */}
          <div className="flex gap-3 mb-4">
            {(song.video_file || song.external_link) && (
              <button
                onClick={() => setActiveTab("video")}
                className={`px-4 py-2 rounded ${activeTab === "video"
                  ? "bg-red-700 text-white"
                  : "bg-gray-200"
                  }`}
              >
                🎬 Video
              </button>
            )}

            {song.pdf_sheet && (
              <button
                onClick={() => setActiveTab("pdf")}
                className={`px-4 py-2 rounded ${activeTab === "pdf"
                  ? "bg-red-700 text-white"
                  : "bg-gray-200"
                  }`}
              >
                📄 PDF
              </button>
            )}

            {song.audio_file && (
              <button
                onClick={() => setActiveTab("audio")}
                className={`px-4 py-2 rounded ${activeTab === "audio"
                  ? "bg-red-700 text-white"
                  : "bg-gray-200"
                  }`}
              >
                🎧 Audio
              </button>
            )}
          </div>

          {/* CONTENT */}
          <div className="bg-white rounded-lg overflow-hidden border">
            {/* VIDEO */}
            {activeTab === "video" && (
              <>
                {song.video_file ? (
                  <video
                    controls
                    src={song.video_file}
                    className="w-full h-[420px]"
                  />
                ) : song.external_link && getYoutubeEmbedUrl(song.external_link) ? (
                  <iframe
                    src={getYoutubeEmbedUrl(song.external_link)!}
                    className="w-full h-[420px]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="p-10 text-gray-500 text-center">
                    No video available
                  </div>
                )}
              </>
            )}

            {/* PDF */}
            {activeTab === "pdf" && song.pdf_sheet && (
              <div className="relative h-[600px]">
                <iframe
                  src={`${song.pdf_sheet}`}
                  className="w-full h-full"
                  title="PDF Preview"
                />
                <p className="absolute bottom-2 right-2 text-xs text-gray-400">
                  PDF Preview
                </p>
              </div>
            )}

            {/* AUDIO */}
            {activeTab === "audio" && song.audio_file && (
              <div className="p-6 bg-gray-100">
                <audio controls className="w-full">
                  <source src={song.audio_file} />
                </audio>
              </div>
            )}
          </div>

          <div className="more flex gap-4 mt-4">
            <div className="artist">
              <span>Par: {song.artist}</span>
            </div>
            <div className="category">
              <span className="text-gray-600 font-bold">{song.category}</span>
            </div>
            {/* Views */}
            <div className=" text-gray-600">
              Views: {song.view_count}
            </div>
            <div className="like_button">
              <button onClick={likeSong}
                className="bg-gray-200 text-gray-600 px-2 py-1 rounded font-bold">Like: {song.likes}</button>
            </div>
          </div>
          <div className="description">
            <p> <span className=" italic text-gray-600">Descripion:</span><br />{song.description}</p>
          </div>
        </div>

        {/* RELATED SONGS */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">Related Songs</h2>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {relatedSongs.map((s) => (
              <div
                key={s.id}
                onClick={() => navigate(`/songs/${s.id}`)}
                className="flex gap-3 items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <div className="w-16 h-12 bg-gray-200 flex items-center justify-center">
                  {s.video_file ? "🎬" : s.pdf_sheet ? "📄" : "🎧"}
                </div>
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">
                    {s.view_count} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
