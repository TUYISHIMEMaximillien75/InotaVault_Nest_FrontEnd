import { useState, useEffect, useRef } from "react";
import { searchSong } from "../api/song.api";
import { Link } from "react-router-dom";
import { Search, X, Music, Film, Headphones, ChevronRight, Loader2 } from "lucide-react";

const Search_bar = () => {
  const [results, setResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // autofocus with a slight delay so the animation settles first
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setResults([]); return; }
    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchSong(searchQuery);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 380);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleClose = () => {
    localStorage.setItem("search_bar", "off");
    window.location.reload();
  };

  const mediaIcon = (r: any) => {
    if (r.video_file || r.external_link) return <Film size={15} className="text-gray-400" />;
    if (r.pdf_sheet) return <Music size={15} className="text-gray-400" />;
    return <Headphones size={15} className="text-gray-400" />;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        .sb-display { font-family: 'Playfair Display', serif; }
        .sb-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(-14px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes resultIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .sb-backdrop { animation: backdropIn .22s ease forwards; }
        .sb-panel    { animation: panelIn .28s cubic-bezier(.34,1.2,.64,1) forwards; }
        .sb-result   { animation: resultIn .2s ease both; }
      `}</style>

      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 sb-body">

        {/* Backdrop */}
        <div
          className="sb-backdrop absolute inset-0"
          style={{ background: "rgba(15,10,5,.65)", backdropFilter: "blur(6px)" }}
          onClick={handleClose}
        />

        {/* Panel */}
        <div className="sb-panel relative w-full max-w-xl bg-[#f8f5f0] border border-gray-200 shadow-[0_32px_80px_rgba(0,0,0,.22)] overflow-hidden">

          {/* Top red rule */}
          <div className="h-[3px] bg-red-600" />

          {/* Input row */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
            <Search size={18} className="text-red-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && handleClose()}
              placeholder="Search songs, artists, categories…"
              className="flex-1 bg-transparent text-gray-900 text-base font-medium placeholder:text-gray-400 outline-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            {loading
              ? <Loader2 size={17} className="text-gray-400 animate-spin shrink-0" />
              : searchQuery
                ? <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"><X size={17} /></button>
                : null
            }
            <button
              onClick={handleClose}
              className="shrink-0 w-7 h-7 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 transition-colors ml-1"
              title="Close (Esc)"
            >
              <X size={15} />
            </button>
          </div>

          {/* Results area */}
          <div className="max-h-[58vh] overflow-y-auto">

            {/* Loading */}
            {loading && (
              <div className="py-10 flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 border-[2.5px] border-gray-200 border-t-red-600 rounded-full animate-spin" />
                </div>
                <p className="text-sm text-gray-400 sb-body">
                  Searching for <em className="text-gray-600 not-italic font-semibold">"{searchQuery}"</em>…
                </p>
              </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
              <div className="py-2">
                {/* Results header */}
                <div className="flex items-center justify-between px-4 py-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.2em]">Results</p>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 uppercase tracking-wider">
                    {results.length} found
                  </span>
                </div>

                {results.map((result, idx) => (
                  <Link
                    to={`/songs/${result.id}`}
                    key={result.id}
                    // onClick={handleClose}
                    className="sb-result group flex items-center gap-4 px-4 py-3 hover:bg-white border-b border-gray-100 last:border-0 transition-colors"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    {/* Media type icon box */}
                    <div className="shrink-0 w-9 h-9 bg-gray-100 border border-gray-200 flex items-center justify-center group-hover:border-red-200 group-hover:bg-red-50 transition-colors">
                      {mediaIcon(result)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="sb-display text-sm font-bold text-gray-900 truncate group-hover:text-red-700 transition-colors">
                        {result.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-gray-500 truncate">{result.artist || "Unknown Artist"}</span>
                        {result.category && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="text-[11px] text-red-500 font-semibold uppercase tracking-wide">{result.category}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <ChevronRight size={14} className="text-gray-300 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                  </Link>
                ))}
              </div>
            )}

            {/* No results */}
            {!loading && searchQuery && results.length === 0 && (
              <div className="py-14 flex flex-col items-center gap-3 text-center px-6">
                <div className="w-12 h-12 border border-gray-200 bg-white flex items-center justify-center">
                  <Search size={20} className="text-gray-300" />
                </div>
                <div>
                  <p className="sb-display text-base font-bold text-gray-700 mb-1">
                    Nothing found
                  </p>
                  <p className="text-sm text-gray-400">
                    No songs match <em className="not-italic font-semibold text-gray-600">"{searchQuery}"</em>. Try a different spelling or broader term.
                  </p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!searchQuery && !loading && (
              <div className="py-12 flex flex-col items-center gap-4 text-center px-6">
                <div className="flex gap-2">
                  {[Music, Film, Headphones].map((Icon, i) => (
                    <div key={i} className="w-9 h-9 bg-white border border-gray-200 flex items-center justify-center">
                      <Icon size={16} className="text-gray-300" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic sb-body">
                  Start typing to search the vault…
                </p>
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2.5 border-t border-gray-200 bg-white flex items-center justify-between">
            <p className="text-[10px] text-gray-400 tracking-wide">Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 text-gray-500 text-[10px] font-mono">Esc</kbd> to close</p>
            <p className="text-[10px] text-gray-400 tracking-[.15em] uppercase">InotaVault</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search_bar;