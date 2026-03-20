import { updateSong, getSongById, getAllCategories } from "../../api/song.api";
import { useEffect, useState } from "react";
import { isLoggedIn } from "../../utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import {
  Link2, CalendarDays, Tag, Mic2, BookOpen, AlignLeft,
  AlertTriangle, CheckCircle2, Loader2, Plus, X, Save
} from "lucide-react";

export default function EditSong() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const [form, setForm] = useState({
    name: "", album: "", artist: "", category: "",
    description: "", external_link: "", releaseDate: "",
  });

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/login"); return; }
    
    // Fetch categories and song details
    Promise.all([
      getAllCategories().catch(() => ({ data: { categories: [] } })),
      getSongById(id!).catch(() => {
        setError("Failed to load song details.");
        return { data: null };
      })
    ]).then(([catRes, songRes]) => {
      setCategories(catRes.data.categories || []);
      if (songRes.data) {
        const d = songRes.data;
        setForm({
          name: d.name || "",
          album: d.album || "",
          artist: d.artist || "",
          category: d.category || "",
          description: d.description || "",
          external_link: d.external_link || "",
          releaseDate: d.releaseDate ? new Date(d.releaseDate).toISOString().split('T')[0] : "",
        });
      }
      setFetching(false);
    });
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setError("");
    if (!form.name || !form.category) {
      setError("Song name and category are required."); return;
    }
    try {
      setLoading(true);
      const payload = { ...form };
      // Remove empty releaseDate so it doesn't fail backend date validation
      if (!payload.releaseDate) delete (payload as any).releaseDate;
      
      await updateSong(id!, payload);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/songs"), 1800);
    } catch {
      setError("Update failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

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
                  <p className="up-display text-xl font-black text-gray-900 mb-1">Updated!</p>
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
                Edit Song<span className="text-red-600">.</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">Update the song details and metadata.</p>
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
                <label className="up-label">Album</label>
                <div className="relative">
                  <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input name="album" value={form.album} onChange={handleChange} placeholder="Album name" className="up-input" />
                </div>
              </div>

              {/* Artist */}
              <div>
                <label className="up-label">Artist</label>
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
                <label className="up-label">Description</label>
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

          {/* ── Submit ── */}
          <div className="up-f3">
            <button
              onClick={submit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gray-950 text-white text-sm font-semibold uppercase tracking-wider hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-[0_8px_24px_rgba(0,0,0,.12)]"
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
                : <><Save size={16} /> Save Changes</>
              }
            </button>
          </div>

        </div>
      </div>
    </>
  );
}