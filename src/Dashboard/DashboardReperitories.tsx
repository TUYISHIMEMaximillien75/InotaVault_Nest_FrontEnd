import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Share2, Pencil, Music2, Calendar, Tag, Loader2 } from "lucide-react";
import { getAllRepertoires } from "../api/repertoire.api";

interface RepertoireItem {
  id: string;
  title: string;
  event_type: string;
  createdAt: string;
}

export default function DashboardReperitories() {
  const [repertoires, setRepertoires] = useState<RepertoireItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepertoires = async () => {
      try {
        const res = await getAllRepertoires();
        setRepertoires(res.data);
      } catch (err) {
        console.error("Failed to load repertoires", err);
        setError("Could not load your repertoires. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRepertoires();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + " · " + d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

    const handleCopyLink = async (repertoire: RepertoireItem) => {
        const link = `${window.location.origin}/repertoire/${repertoire.id}`;
        await navigator.clipboard.writeText(link);
        setCopied(`link-${repertoire.id}`);
        setTimeout(() => setCopied(null), 2000);
    };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/edit_repertoire/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-red-700">My Repertoires</h1>
          <p className="text-gray-500">Your saved song lists for every occasion.</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/create_repertoires")}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Repertoire</span>
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : repertoires.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 space-y-3">
          <Music2 className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-gray-500">You haven't created any repertoires yet.</p>
          <button
            onClick={() => navigate("/dashboard/create_repertoires")}
            className="mt-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
          >
            Create your first
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {repertoires.map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex items-center justify-between gap-4"
            >
              {/* Left: Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {rep.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-red-500" />
                    <span className="font-medium text-red-700">{rep.event_type}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {formatDate(rep.createdAt)}
                  </span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Share dropdown */}
                <div className="relative group">
                  <button
                    title="Share options"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>

                  {/* Dropdown panel — appears on hover */}
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 origin-top-right scale-95 group-hover:scale-100">
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Check out this repertoire: ${rep.title}\n\n${window.location.origin}/repertoire/${rep.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-t-xl transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                      WhatsApp
                    </a>
                    
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/repertoire/${rep.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.394.9-.394 1.439v1.61h3.343l-.537 3.667h-2.806v8.038a11.967 11.967 0 0 0 11.531-11.814C23.965 5.253 18.665.011 11.983.011 5.3.011 0 5.253 0 11.928a11.967 11.967 0 0 0 9.101 11.763Z"/>
                      </svg>
                      Facebook
                    </a>
                    
                    {/* X (formerly Twitter) */}
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/repertoire/${rep.id}`)}&text=${encodeURIComponent(`Check out this repertoire: ${rep.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      X (Twitter)
                    </a>
                    
                    <div className="h-px bg-gray-100 mx-2" />
                    
                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopyLink(rep)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-b-xl transition-colors"
                    >
                      {copied === `link-${rep.id}` ? (
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                      )}
                      {copied === `link-${rep.id}` ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>

                {/* Edit button */}
                <button
                  onClick={() => handleEdit(rep.id)}
                  title="Edit"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
