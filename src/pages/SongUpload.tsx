import { uploadSong } from "../api/song.api";
import { useState } from "react";

export default function UploadSong() {
  const [title, setTitle] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    if (!title.trim()) {
      setError("Song title is required");
      return;
    }

    if (!pdf) {
      setError("PDF sheet is required");
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("pdf", pdf);

    if (audio) form.append("audio", audio);
    if (video) form.append("video", video);
    if (image) form.append("image", image);

    try {
      setLoading(true);
      await uploadSong(form);
      alert("✅ Song uploaded successfully");

      // reset form
      setTitle("");
      setPdf(null);
      setAudio(null);
      setVideo(null);
      setImage(null);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold">Upload Song</h2>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      {/* TITLE */}
      <input
        placeholder="Song title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full rounded"
      />

      {/* PDF (REQUIRED) */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Sheet Music (PDF) *
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files?.[0] || null)}
        />
      </div>

      {/* PDF PREVIEW */}
      {pdf && (
        <div className="border rounded h-64 overflow-hidden">
          <iframe
            src={URL.createObjectURL(pdf)}
            className="w-full h-full"
          />
        </div>
      )}

      {/* OPTIONAL FILES */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Audio (optional)
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files?.[0] || null)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Video (optional)
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Cover Image (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>

      {/* SUBMIT */}
      <button
        onClick={submit}
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-red-700 hover:bg-red-600"
        }`}
      >
        {loading ? "Uploading..." : "Upload Song"}
      </button>
    </div>
  );
}
