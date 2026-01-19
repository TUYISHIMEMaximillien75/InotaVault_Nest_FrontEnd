import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import logo from "../assets/logo.png";

interface Song {
  id: string;
  title: string;
  sheet_pdf?: string;
  audio_url?: string;
  video_url?: string;
  external_link?: string;
  description?: string;
  view_count: number;
  category?: string;
}

export default function SongView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [song, setSong] = useState<Song | null>(null);
  const [relatedSongs, setRelatedSongs] = useState<Song[]>([]);
  const [activeTab, setActiveTab] = useState<"video" | "pdf" | "audio">("video");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSong();
  }, [id]);

  const fetchSong = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/songs/${id}`);
      setSong(res.data.data);


      // fetch related songs (same category or fallback)
      const related = await api.get(
        `/allsongs?filter=${res.data.data.usage || "ALL"}&page=1&limit=6`
      );
      setRelatedSongs(
        related.data.data.filter((s: Song) => s.id !== String(id))
      );

      console.log("Those are related ", res.data.data.usage);
    } catch (error) {
      console.error("Failed to load song", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !song) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading song...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="flex items-center gap-4 p-4 bg-white shadow">
        <img src={logo} className="h-10 cursor-pointer" onClick={() => navigate("/songs")} />
        <h1 className="text-xl font-bold">{song.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* MAIN VIEW */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
          {/* TABS */}
          <div className="flex gap-3 mb-4">
            {(song.video_url || song.external_link) && (
              <button
                onClick={() => setActiveTab("video")}
                className={`px-4 py-2 rounded ${
                  activeTab === "video"
                    ? "bg-red-700 text-white"
                    : "bg-gray-200"
                }`}
              >
                🎬 Video
              </button>
            )}

            {song.sheet_pdf && (
              <button
                onClick={() => setActiveTab("pdf")}
                className={`px-4 py-2 rounded ${
                  activeTab === "pdf"
                    ? "bg-red-700 text-white"
                    : "bg-gray-200"
                }`}
              >
                📄 PDF
              </button>
            )}

            {song.audio_url && (
              <button
                onClick={() => setActiveTab("audio")}
                className={`px-4 py-2 rounded ${
                  activeTab === "audio"
                    ? "bg-red-700 text-white"
                    : "bg-gray-200"
                }`}
              >
                🎧 Audio
              </button>
            )}
          </div>

          {/* CONTENT */}
          <div className="bg-black rounded-lg overflow-hidden">
            {activeTab === "video" && (
              <>
                {song.video_url ? (
                  <video
                    controls
                    src={song.video_url}
                    className="w-full h-[420px]"
                  />
                ) : song.external_link ? (
                  <iframe
                    src={song.external_link.replace("watch?v=", "embed/")}
                    className="w-full h-[420px]"
                    allowFullScreen
                  />
                ) : (
                  <div className="p-10 text-white text-center">
                    No video available
                  </div>
                )}
              </>
            )}

            {activeTab === "pdf" && song.sheet_pdf && (
              <iframe
                src={song.sheet_pdf}
                className="w-full h-[500px]"
              />
            )}

            {activeTab === "audio" && song.audio_url && (
              <div className="p-6 bg-gray-900">
                <audio controls className="w-full">
                  <source src={song.audio_url} />
                </audio>
              </div>
            )}
          </div>

          <div className="mt-4 text-gray-600">
            Views: {song.view_count}
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
                  {s.video_url ? "🎬" : s.sheet_pdf ? "📄" : "🎧"}
                </div>
                <div>
                  <p className="font-medium text-sm">{s.title}</p>
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
