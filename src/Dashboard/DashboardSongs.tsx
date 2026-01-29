import { Plus, Pencil, Music, Search, Filter, MoreVertical, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getSongByUploaderId } from "../api/song.api";
import { useState, useEffect } from "react";
import { getProfile } from "../api/auth.api";
import { searchInSong } from "../api/song.api";

export default function DashboardSongs() {
    const [songs, setSongs] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [minLoading, setMinLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("")


    useEffect(()=>{
        if (searchQuery) {
            const delayDebounce = setTimeout(async() => {
            setMinLoading(true)

            try {
                const res = await searchInSong(searchQuery)
                        setSongs(res.data)
            } catch (error:any) {
                setError(error)
            }
            setMinLoading(false)
        }, 500)

        return() => clearTimeout(delayDebounce)
        }
        

    },[searchQuery])
    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const userResponse = await getProfile();
                const userId = userResponse.data?.id;

                if (userId) {
                    const songsResponse = await getSongByUploaderId(userId);
                    setSongs(songsResponse.data);
                }
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- PAGINATION LOGIC ---
    const songList = songs?.songs || []; // Extract the array
    const totalItems = songList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Calculate current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSongs = songList.slice(indexOfFirstItem, indexOfLastItem);

    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Loading your library...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Songs Library</h1>
                    <p className="text-gray-500 text-sm">Manage and organize your sheet music and recordings.</p>
                </div>

                <NavLink to="/dashboard/upload" className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 active:scale-95">
                    <Plus size={20} />
                    <span>Add New Song</span>
                </NavLink>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title or composer..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-700 transition-all text-sm"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm w-full md:w-auto justify-center">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            {/* SONGS TABLE */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Song Detail</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Added</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentSongs.length > 0 ? (
                                currentSongs.map((song: any) => (
                                    <tr key={song.id} className="hover:bg-red-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-red-100 text-red-700 rounded-lg flex items-center justify-center">
                                                    <Music size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{song.name}</div>
                                                    <div className="text-sm text-gray-500">{song.artist || 'Unknown Artist'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 lowercase first-letter:uppercase">
                                                {song.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(song.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all">
                                                    <Pencil size={18} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                                        No songs found in your library.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- FUNCTIONAL PAGINATION FOOTER --- */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium text-gray-900">{totalItems > 0 ? indexOfFirstItem + 1 : 0}</span> to{' '}
                        <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
                        <span className="font-medium text-gray-900">{totalItems}</span> songs
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg border border-gray-200 transition-all ${currentPage === 1
                                ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-50 hover:border-red-200"
                                }`}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`p-2 rounded-lg border border-gray-200 transition-all ${(currentPage === totalPages || totalPages === 0)
                                ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-50 hover:border-red-200"
                                }`}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}