import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSongById } from "../api/song.api";

export default function SongDetail() {
  const { id } = useParams();
  const [song, setSong] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getSongById(id).then(res => setSong(res.data.data));
    }
  }, [id]);

  if (!song) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{song.title}</h1>

      <a
        href={song.sheet_pdf}
        className="block mt-4 text-blue-600"
        download
      >
        📄 Download PDF
      </a>

      {song.audio_url && (
        <audio controls className="mt-4">
          <source src={song.audio_url} />
        </audio>
      )}
    </div>
  );
}
