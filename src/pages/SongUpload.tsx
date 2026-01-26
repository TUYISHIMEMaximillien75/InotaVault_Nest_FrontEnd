import { uploadSong } from "../api/song.api";
import { useEffect, useState } from "react";
import { getAllCategories } from "../api/song.api";
import { isLoggedIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function UploadSong() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const [isNewCategory, setIsNewCategory] = useState(false);

  const fetchCategories = async () => {
    try {
      await getAllCategories().then((res) => {
        console.log(res.data.categories);
        setCategories(res.data.categories);
      });
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };
  useEffect(() => {
    fetchCategories();
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, []);

  const [form, setForm] = useState({
    name: "",
    album: "",
    artist: "",
    category: "",
    description: "",
    external_link: "",
    releaseDate: "",
  });

  const [files, setFiles] = useState<{
    pdf_sheet: File | null;
    audio_file: File | null;
    video_file: File | null;
    coverImage: File | null;
  }>({
    pdf_sheet: null,
    audio_file: null,
    video_file: null,
    coverImage: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (key: keyof typeof files, file?: File) => {
    setFiles({ ...files, [key]: file || null });
  };

  const submit = async () => {
    setError("");

    if (!form.name || !form.album || !form.artist || !form.category || !form.description) {
      setError("Please fill in all required fields");
      return;
    }

    if (!files.pdf_sheet) {
      setError("PDF Sheet is required");
      return;
    }

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) data.append(key, file);
    });

    try {
      setLoading(true);
      for (const pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }
      await uploadSong(data);
      // console.log(data);
      alert("✅ Song uploaded successfully");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Upload Song</h1>
          <p className="text-gray-500 text-sm">
            Fill in song details and upload related media
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* TEXT FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ["name", "Song Name *"],
            ["album", "Album *"],
            ["artist", "Artist *"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                {label}
              </label>
              <input
                name={key}
                value={(form as any)[key]}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => {
                if (e.target.value === "__new__") {
                  setIsNewCategory(true);
                } else {
                  handleChange(e);
                }
              }}
              name="category"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none">
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="__new__">➕ Add New Category</option>
            </select>
          </div>
          {isNewCategory && (
            <div className="mt-3">
              <label className="text-sm font-semibold text-gray-700">
                New Category Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Worship, Praise, Traditional"
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 mt-1"
              />
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Description *
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Release Date *
            </label>
            <input
              type="date"
              name="releaseDate"
              value={form.releaseDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              External Link
            </label>
            <input
              name="external_link"
              value={form.external_link}
              onChange={handleChange}
              placeholder="https://"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>
        </div>

        {/* FILE UPLOADS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UploadBox
            label="📄 PDF Sheet *"
            accept="application/pdf"
            file={files.pdf_sheet}
            onChange={(f) => handleFile("pdf_sheet", f)}
          />
          <UploadBox
            label="🎧 Audio File (Optional)"
            accept="audio/*"
            file={files.audio_file}
            onChange={(f) => handleFile("audio_file", f)}
          />
          <UploadBox
            label="🎬 Video File (Optional)"
            accept="video/*"
            file={files.video_file}
            onChange={(f) => handleFile("video_file", f)}
          />
          <UploadBox
            label="🖼️ Cover Image (Optional)"
            accept="image/*"
            file={files.coverImage}
            onChange={(f) => handleFile("coverImage", f)}
          />
        </div>

        {/* SUBMIT */}
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition
            ${loading ? "bg-gray-400" : "bg-red-700 hover:bg-red-600"}`}
        >
          {loading ? "Uploading..." : "Upload Song"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Upload Box ---------------- */

function UploadBox({
  label,
  accept,
  file,
  onChange,
}: {
  label: string;
  accept: string;
  file: File | null;
  onChange: (file?: File) => void;
}) {
  return (
    <label className="cursor-pointer border-2 border-dashed rounded-xl p-6 text-center hover:border-red-600 transition block">
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0])}
      />
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-sm text-gray-500 mt-1">
        {file ? file.name : "Click to upload"}
      </p>
    </label>
  );
}
