import { uploadSong } from "../api/song.api";
import { useState } from "react";

export default function UploadSong() {
  const [title, setTitle] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);

  const submit = async () => {
    if (!pdf) return;

    const form = new FormData();
    form.append("title", title);
    form.append("pdf", pdf);

    await uploadSong(form);
    alert("Song uploaded");
  };

  return (
    <div className="p-6">
      <input
        placeholder="Song title"
        onChange={e => setTitle(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="file"
        accept="application/pdf"
        onChange={e => setPdf(e.target.files?.[0] || null)}
        className="mt-4"
      />
      <button
        onClick={submit}
        className="mt-4 px-4 py-2 bg-black text-white"
      >
        Upload
      </button>
    </div>
  );
}
