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

  const handleShare = async (repertoire: RepertoireItem) => {
    const shareText = `🎵 Repertoire: ${repertoire.title}\n📅 Type: ${repertoire.event_type}\n📆 Created: ${formatDate(repertoire.createdAt)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: repertoire.title, text: shareText });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(repertoire.id);
      setTimeout(() => setCopied(null), 2000);
    }
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
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 origin-top-right scale-95 group-hover:scale-100">
                    <button
                      onClick={() => handleShare(rep)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-t-xl transition-colors"
                    >
                      <Share2 className="w-4 h-4 shrink-0" />
                      {copied === rep.id ? "Shared!" : "Share"}
                    </button>
                    <div className="h-px bg-gray-100 mx-2" />
                    <button
                      onClick={() => handleCopyLink(rep)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-b-xl transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
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
