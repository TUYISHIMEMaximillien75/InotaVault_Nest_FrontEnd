import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRepertoirePublic } from "../api/repertoire.api";
import {
  Music, FileAudio, FileText, Calendar,
  List, AlertTriangle, BookOpen, ChevronRight, ArrowUpRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PublicSong {
  id: string; song_id?: string; title: string; artist?: string;
  source: "existing" | "typed" | "uploaded"; position: number;
}
interface PublicSection {
  id: string; name: string; position: number; songs: PublicSong[];
}
interface PublicRepertoire {
  id: string; title: string; event_type: string;
  createdAt: string; sections: PublicSection[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getSongIcon = (source: PublicSong["source"]) => {
  if (source === "uploaded") return <FileAudio size={14} className="text-blue-500" />;
  if (source === "typed")    return <FileText  size={14} className="text-violet-500" />;
  return                            <Music     size={14} className="text-red-500" />;
};

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch { return ""; }
};

// ─── Component ────────────────────────────────────────────────────────────────
const RepertoireViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [repertoire, setRepertoire] = useState<PublicRepertoire | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getRepertoirePublic(id);
        const rep = res.data;
        rep.sections = (rep.sections ?? [])
          .slice()
          .sort((a: PublicSection, b: PublicSection) => a.position - b.position)
          .map((sec: PublicSection) => ({
            ...sec,
            songs: (sec.songs ?? []).slice().sort((a: PublicSong, b: PublicSong) => a.position - b.position),
          }));
        setRepertoire(rep);
      } catch {
        setError("This repertoire could not be found or is no longer available.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#f8f5f0] flex flex-col items-center justify-center gap-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');`}</style>
      <div className="relative">
        <div className="w-12 h-12 border-[2.5px] border-gray-200 border-t-red-600 rounded-full animate-spin" />
        <Music className="absolute inset-0 m-auto w-4 h-4 text-red-500" />
      </div>
      <p className="text-gray-400 text-xs tracking-[.2em] uppercase" style={{ fontFamily:"'DM Sans',sans-serif" }}>
        Loading repertoire…
      </p>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !repertoire) return (
    <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center px-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <div className="bg-white border border-gray-200 w-full max-w-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>
        <div className="h-[3px] bg-red-600" />
        <div className="px-8 py-10 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 bg-red-50 border border-red-100 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-400" />
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-1" style={{ fontFamily:"'Playfair Display',serif" }}>
              Repertoire Not Found
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              {error || "This repertoire doesn't exist or the link may have expired."}
            </p>
          </div>
          <Link to="/"
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-700 transition-colors">
            Go to InotaVault <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );

  const totalSongs = repertoire.sections.reduce((sum, s) => sum + s.songs.length, 0);

  // ── Viewer ───────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .rv-display { font-family: 'Playfair Display', serif; }
        .rv-body    { font-family: 'DM Sans', sans-serif; }
        @keyframes rvFadeUp {
          from { opacity:0; transform: translateY(14px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .rv-f1 { animation: rvFadeUp .45s .05s both; }
        .rv-f2 { animation: rvFadeUp .45s .12s both; }
        .rv-f3 { animation: rvFadeUp .45s .19s both; }
        .rv-sec { animation: rvFadeUp .45s both; }
        .rv-song-row { transition: background .12s; }
        .rv-song-row:hover { background: #faf9f7; }
        .rv-song-row.linked:hover { background: #fef2f2; }
      `}</style>

      <div className="min-h-screen bg-[#f8f5f0] rv-body">

        {/* ── Header ── */}
        <header className="sticky top-0 z-20 bg-[#f8f5f0]/95 backdrop-blur-sm border-b border-gray-200">
          <div className="h-[3px] bg-red-600" />
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 bg-red-600 flex items-center justify-center">
                <Music size={13} className="text-white" />
              </div>
              <span className="rv-display font-bold text-gray-900 text-sm group-hover:text-red-700 transition-colors">
                InotaVault
              </span>
            </Link>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[.22em]">
              Shared Repertoire
            </span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">

          {/* ── Hero card ── */}
          <div className="rv-f1 bg-white border border-gray-200">
            <div className="h-[3px] bg-red-600" />
            <div className="px-6 sm:px-8 py-7">

              {/* Event type badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 uppercase tracking-[.2em] px-3 py-1 bg-red-50 border border-red-100">
                  <Calendar size={10} /> {repertoire.event_type}
                </span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              <h1 className="rv-display text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-6">
                {repertoire.title}<span className="text-red-600">.</span>
              </h1>

              {/* Stats strip */}
              <div className="flex flex-wrap gap-6 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <List size={14} className="text-red-400" />
                  <span><strong className="text-gray-800 font-bold">{repertoire.sections.length}</strong> section{repertoire.sections.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Music size={14} className="text-red-400" />
                  <span><strong className="text-gray-800 font-bold">{totalSongs}</strong> song{totalSongs !== 1 ? "s" : ""}</span>
                </div>
                {repertoire.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} className="text-red-400" />
                    <span>{fmtDate(repertoire.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Sections ── */}
          {repertoire.sections.length === 0 ? (
            <div className="rv-f2 bg-white border border-dashed border-gray-200 flex flex-col items-center py-16 gap-3 text-center">
              <div className="w-12 h-12 bg-gray-50 flex items-center justify-center">
                <BookOpen size={22} className="text-gray-300" />
              </div>
              <p className="rv-display font-bold text-gray-500">No sections yet.</p>
            </div>
          ) : (
            <div className="rv-f2 space-y-4">
              {repertoire.sections.map((section, idx) => (
                <div key={section.id} className="rv-sec bg-white border border-gray-200 overflow-hidden"
                  style={{ animationDelay: `${0.18 + idx * 0.06}s` }}>

                  {/* Section header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
                    <span className="rv-display w-7 h-7 bg-red-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h2 className="rv-display font-bold text-gray-900 text-lg leading-tight">{section.name}</h2>
                    <span className="ml-auto text-[10px] font-bold text-gray-400 uppercase tracking-[.16em]">
                      {section.songs.length} song{section.songs.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Song list */}
                  {section.songs.length === 0 ? (
                    <p className="px-6 py-5 text-sm text-gray-400 text-center italic">No songs in this section.</p>
                  ) : (
                    <ul className="divide-y divide-gray-50">
                      {section.songs.map((song, songIdx) => {
                        const hasLink = (song.source === "existing" || song.source === "uploaded") && song.song_id;

                        const inner = (
                          <div className={`rv-song-row ${hasLink ? "linked" : ""} flex items-center gap-4 px-5 py-3.5 group`}>

                            {/* Position */}
                            <span className="rv-display text-[11px] font-black text-gray-300 w-5 text-right shrink-0 group-hover:text-red-400 transition-colors leading-none">
                              {String(songIdx + 1).padStart(2, "0")}
                            </span>

                            {/* Icon box */}
                            <div className="w-8 h-8 bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:border-gray-200 transition-colors">
                              {getSongIcon(song.source)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className={`rv-display text-sm font-bold truncate transition-colors ${hasLink ? "text-gray-900 group-hover:text-red-700" : "text-gray-700"}`}>
                                {song.title}
                              </p>
                              {(song.artist || song.source !== "typed") && (
                                <p className="rv-body text-[10px] text-gray-400 font-medium mt-0.5 truncate uppercase tracking-[.15em]">
                                  {song.artist || "Unknown Artist"}
                                </p>
                              )}
                            </div>

                            {/* Source badge */}
                            {song.source !== "existing" && (
                              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-gray-100 text-gray-500 shrink-0">
                                {song.source === "uploaded" ? "File" : "Custom"}
                              </span>
                            )}

                            {/* Arrow (linked only) */}
                            {hasLink && (
                              <ChevronRight size={14} className="text-gray-300 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all duration-150 shrink-0" />
                            )}
                          </div>
                        );

                        return (
                          <li key={song.id}>
                            {hasLink
                              ? <Link to={`/songs/${song.song_id}`} className="block w-full">{inner}</Link>
                              : inner
                            }
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Footer ── */}
          <div className="rv-f3 pt-4 pb-10 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-gray-400">
              <div className="h-px w-8 bg-gray-200" />
              Powered by{" "}
              <Link to="/" className="font-semibold text-red-500 hover:text-red-700 transition-colors">
                InotaVault
              </Link>
              · Sacred Music Platform
              <div className="h-px w-8 bg-gray-200" />
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default RepertoireViewer;