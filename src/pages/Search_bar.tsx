import { useState, useEffect } from "react";
import { searchSong } from "../api/song.api";
import { Link } from "react-router-dom";

const Search_bar = () => {
  const [results, setResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchSong(searchQuery);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleClose = () => {
    localStorage.setItem("search_bar", "off");
    // Triggering a reload to update the parent, though a state prop is usually better!
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-10 sm:pt-20 px-4">
      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* SEARCH CONTAINER */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* INPUT AREA */}
        <div className="flex items-center p-4 border-b border-gray-100">
          <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            autoFocus
            type="text"
            className="flex-1 px-4 py-2 text-lg outline-none text-gray-800 placeholder:text-gray-400"
            placeholder="Search songs, artists, or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* RESULTS AREA */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium">Searching for "{searchQuery}"</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="py-2">
              <div className="px-4 mb-2 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Top Results</span>
                <span className="text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full">{results.length} found</span>
              </div>
              {results.map((result) => (
                <Link 
                  to={`/songs/${result.id}`} 
                  key={result.id}
                  className="group flex items-center p-3 mx-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                    <span className="text-lg">🎵</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-bold text-gray-800 group-hover:text-red-700 transition-colors">{result.name}</p>
                    <div className="flex space-x-3 text-xs text-gray-500">
                      <span>{result.artist || 'Unknown Artist'}</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-semibold text-red-600/70">{result.category}</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-red-400 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}

          {!loading && searchQuery && results.length === 0 && (
            <div className="py-12 text-center">
              <span className="text-4xl">🔎</span>
              <p className="mt-2 text-gray-500 font-medium">No results found for "{searchQuery}"</p>
              <p className="text-xs text-gray-400">Try checking your spelling or use a broader term.</p>
            </div>
          )}

          {!searchQuery && (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm italic">Start typing to find your favorite music...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search_bar;