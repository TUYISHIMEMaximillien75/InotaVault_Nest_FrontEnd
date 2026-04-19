import { uploadSong } from "../api/song.api";
import { useEffect, useState } from "react";
import { getAllCategories } from "../api/song.api";
import { isLoggedIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import {
  FileMusic, Headphones, Film, ImageIcon, Link2,
  CalendarDays, Tag, Mic2, BookOpen, AlignLeft,
  Upload, AlertTriangle, CheckCircle2, Loader2, Plus, X
} from "lucide-react";

export default function UploadSong() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const [form, setForm] = useState({
    name: "", album: "Uknown", artist: "", category: "",
    description: "", external_link: "", releaseDate: "",
  });

  const [files, setFiles] = useState<{
    pdf_sheet: File | null; audio_file: File | null;
    video_file: File | null; coverImage: File | null;
  }>({ pdf_sheet: null, audio_file: null, video_file: null, coverImage: null });

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/login"); return; }
    getAllCategories()
      .then(res => setCategories(res.data.categories || []))
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (key: keyof typeof files, file?: File) => {
    setFiles({ ...files, [key]: file || null });
  };

  const submit = async () => {
    setError("");
    if (!form.name || !form.album || !form.artist || !form.category || !form.description) {
      setError("Please fill in all required fields."); return;
    }
    if (!files.pdf_sheet) {
      setError("PDF Sheet is required."); return;
    }
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v); });
    Object.entries(files).forEach(([k, f]) => { if (f) data.append(k, f); });
    try {
      setLoading(true);
      await uploadSong(data);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/songs"), 1800);
    } catch {
      setError("Upload failed. Please check your files and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900&family=DM+Sans:wght@400;500;600&display=swap');
        .up-display { font-family: 'Playfair Display', serif; }
        .up-body    { font-family: 'DM Sans', sans-serif; }
        @keyframes upFadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .up-f1 { animation: upFadeUp .4s .04s both; }
        .up-f2 { animation: upFadeUp .4s .10s both; }
        .up-f3 { animation: upFadeUp .4s .16s both; }
        .up-f4 { animation: upFadeUp .4s .22s both; }
        .up-f5 { animation: upFadeUp .4s .28s both; }

        .up-input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          background: #fff;
          border: 1px solid #e5e7eb;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #111827;
          outline: none;
          transition: border-color .16s, box-shadow .16s;
        }
        .up-input::placeholder { color: #9ca3af; }
        .up-input:focus { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,.07); }
        .up-input.no-icon { padding-left: 12px; }

        .up-select {
          width: 100%;
          padding: 10px 30px 10px 38px;
          background: #fff;
          border: 1px solid #e5e7eb;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #111827;
          outline: none;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          transition: border-color .16s, box-shadow .16s;
          cursor: pointer;
        }
        .up-select:focus { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,.07); }

        .up-textarea {
          width: 100%;
          padding: 10px 12px;
          background: #fff;
          border: 1px solid #e5e7eb;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #111827;
          outline: none;
          resize: vertical;
          min-height: 100px;
          transition: border-color .16s, box-shadow .16s;
        }
        .up-textarea::placeholder { color: #9ca3af; }
        .up-textarea:focus { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,.07); }

        .up-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: .14em;
          margin-bottom: 6px;
          font-family: 'DM Sans', sans-serif;
        }
        .up-required::after { content: ' *'; color: #dc2626; }

        @keyframes upSuccessIn {
          from { opacity:0; transform:scale(.95) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .up-success-in { animation: upSuccessIn .4s cubic-bezier(.34,1.3,.64,1) both; }
      `}</style>

      <div className="p-5 lg:p-8 max-w-4xl mx-auto up-body">

        {/* ── Success overlay ── */}
        {success && (
          <div className="up-success-in fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white border border-gray-200 shadow-2xl w-full max-w-sm">
              <div className="h-[3px] bg-green-500" />
              <div className="px-8 py-10 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 bg-green-50 border border-green-100 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-500" />
                </div>
                <div>
                  <p className="up-display text-xl font-black text-gray-900 mb-1">Uploaded!</p>
                  <p className="text-gray-400 text-sm">Redirecting to your library…</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">

          {/* ── Page header ── */}
          <div className="up-f1 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[.22em] mb-2">Dashboard</p>
              <h1 className="up-display text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                Upload Song<span className="text-red-600">.</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">Fill in song details and attach media files.</p>
            </div>
          </div>

          {/* ── Error banner ── */}
          {error && (
            <div className="up-f1 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200">
              <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
              <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">
                <X size={14} />
              </button>
            </div>
          )}

          {/* ── Section: Song Details ── */}
          <div className="up-f2 bg-white border border-gray-200">
            <div className="h-[3px] bg-red-600" />
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.2em]">Song Details</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Song Name */}
              <div>
                <label className="up-label up-required">Song Name</label>
                <div className="relative">
                  <Mic2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Nyagasani Urakarama" className="up-input" />
                </div>
              </div>

              {/* Album */}
              <div>
                <label className="up-label up-required">Album</label>
                <div className="relative">
                  <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input name="album" value={form.album} onChange={handleChange} placeholder="Album name" className="up-input" />
                </div>
              </div>

              {/* Artist */}
              <div>
                <label className="up-label up-required">Artist</label>
                <div className="relative">
                  <Mic2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input name="artist" value={form.artist} onChange={handleChange} placeholder="Artist name" className="up-input" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="up-label up-required">Category</label>
                <div className="relative">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                  <select
                    name="category"
                    value={isNewCategory ? "__new__" : form.category}
                    onChange={(e) => {
                      if (e.target.value === "__new__") {
                        setIsNewCategory(true);
                        setForm({ ...form, category: "" });
                      } else {
                        setIsNewCategory(false);
                        handleChange(e);
                      }
                    }}
                    className="up-select"
                  >
                    <option value="">Select category…</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option value="__new__">+ Add new category</option>
                  </select>
                </div>
              </div>

              {/* New Category input */}
              {isNewCategory && (
                <div className="md:col-span-2">
                  <label className="up-label up-required">New Category Name</label>
                  <div className="relative">
                    <Plus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. GUTURA, GUHAZWA, BIKIRAMARIYA…"
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="up-input"
                    />
                  </div>
                </div>
              )}

              {/* Release Date */}
              <div>
                <label className="up-label">Release Date</label>
                <div className="relative">
                  <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} className="up-input" />
                </div>
              </div>

              {/* External Link */}
              <div>
                <label className="up-label">External Link</label>
                <div className="relative">
                  <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input name="external_link" value={form.external_link} onChange={handleChange} placeholder="https://youtube.com/..." className="up-input" />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="up-label up-required">Description</label>
                <div className="relative">
                  <AlignLeft size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                  <textarea
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe this song — its context, usage, or significance…"
                    className="up-textarea"
                    style={{ paddingLeft: "38px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section: Media Files ── */}
          <div className="up-f3 bg-white border border-gray-200">
            <div className="h-[3px] bg-gray-950" />
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.2em]">Media Files</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UploadBox
                label="PDF Sheet"
                required
                accept="application/pdf"
                file={files.pdf_sheet}
                icon={<FileMusic size={20} />}
                color="red"
                onChange={f => handleFile("pdf_sheet", f)}
              />
              <UploadBox
                label="Audio File"
                accept="audio/*"
                file={files.audio_file}
                icon={<Headphones size={20} />}
                color="green"
                onChange={f => handleFile("audio_file", f)}
              />
              <UploadBox
                label="Video File"
                accept="video/*"
                file={files.video_file}
                icon={<Film size={20} />}
                color="blue"
                onChange={f => handleFile("video_file", f)}
              />
              <UploadBox
                label="Cover Image"
                accept="image/*"
                file={files.coverImage}
                icon={<ImageIcon size={20} />}
                color="amber"
                onChange={f => handleFile("coverImage", f)}
              />
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="up-f4">
            <button
              onClick={submit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gray-950 text-white text-sm font-semibold uppercase tracking-wider hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-[0_8px_24px_rgba(0,0,0,.12)]"
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Uploading…</>
                : <><Upload size={16} /> Upload Song</>
              }
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

/* ── Upload Box Component ── */
function UploadBox({
  label, required, accept, file, icon, color, onChange,
}: {
  label: string; required?: boolean; accept: string;
  file: File | null; icon: React.ReactNode; color: "red" | "green" | "blue" | "amber";
  onChange: (file?: File) => void;
}) {
  const colors = {
    red:   { border: "#fca5a5", bg: "#fef2f2", icon: "#dc2626" },
    green: { border: "#86efac", bg: "#f0fdf4", icon: "#16a34a" },
    blue:  { border: "#93c5fd", bg: "#eff6ff", icon: "#2563eb" },
    amber: { border: "#fcd34d", bg: "#fffbeb", icon: "#d97706" },
  }[color];

  return (
    <label
      className="cursor-pointer block group"
      style={{ outline: "none" }}
    >
      <input type="file" accept={accept} className="hidden" onChange={e => onChange(e.target.files?.[0])} />
      <div
        className="border-2 border-dashed p-5 flex flex-col items-center text-center gap-3 transition-all duration-200 group-hover:border-solid"
        style={{
          borderColor: file ? colors.border : "#e5e7eb",
          background: file ? colors.bg : "#fafaf9",
        }}
      >
        <div className="w-10 h-10 flex items-center justify-center" style={{ color: file ? colors.icon : "#9ca3af" }}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700" style={{ fontFamily:"'DM Sans',sans-serif" }}>
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
          </p>
          {file ? (
            <p className="text-xs mt-1 font-medium truncate max-w-[180px]" style={{ color: colors.icon }}>
              {file.name}
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-1">Click to upload</p>
          )}
        </div>
        {file && (
          <div
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5"
            style={{ background: colors.border + "50", color: colors.icon }}
          >
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>
        )}
      </div>
    </label>
  );
}