import { useState, useEffect } from "react";
import { getSongByUploaderId } from "../api/song.api";
import { getProfile } from "../api/auth.api";
import icon from "../assets/icon.png";
import type { DashboardData } from "../types/song";
import { NavLink } from "react-router-dom";

export default function DashboardHome() {
    const [user, setUser] = useState(null);
    const [songs, setSongs] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
    }
    const userDetails = JSON.parse(localStorage.getItem("user") || "{}");
    if(!userDetails){
        setUser(userDetails);
    }
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getProfile();
                // setUser(response.data);
                return response.data;
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        const fetchSongs = async () => {
            try {
                const theuser = await fetchUser();
                setUser(theuser);
                const response = await getSongByUploaderId(theuser?.id);
                setSongs(response.data);
                // console.log("songs",response.data);
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSongs();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    {/* Spinner */}
                    <div className="w-12 h-12 border-4 border-red-700 border-t-transparent border-solid rounded-full animate-spin"></div>

                    {/* Animated text */}
                    <div className="flex space-x-1">
                        <span className="animate-ping">.</span>
                        <span className="animate-ping animation-delay-200">.</span>
                        <span className="animate-ping animation-delay-400">.</span>
                    </div>

                    <p className="text-gray-600 text-lg font-medium">Loading songs</p>
                    <img src={icon} className=" animate-bounce max-w-20" alt="" />
                </div>
            </div>

        );
    }

    return (

        <div className="p-6 space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back 👋 {user?.name}
                </h1>
                <p className="text-gray-500 mt-1">
                    Manage your songs, repertoires, and sheet music in one place
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-sm text-gray-500">Total Songs</p>
                    <h2 className="text-3xl font-bold text-gray-800">{songs?.songs?.length}</h2>
                </div>

                <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-sm text-gray-500">PDF Sheets</p>
                    <h2 className="text-3xl font-bold text-gray-800">18</h2>
                </div>

                <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-sm text-gray-500">Repertoires</p>
                    <h2 className="text-3xl font-bold text-gray-800">6</h2>
                </div>

                <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-sm text-gray-500">Categories</p>
                    <h2 className="text-3xl font-bold text-gray-800">{songs?.categories?.length}</h2>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Quick Actions
                </h3>

                <div className="flex flex-wrap gap-4">
                    <NavLink to="/dashboard/upload" className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition">
                        ➕ Upload Song
                    </NavLink>

                    <NavLink to="/dashboard/create_repertoires" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                        📚 Create Repertoire
                    </NavLink>

                    <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition">
                        📄 Generate PDF
                    </button>

                    <button className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition">
                        🔗 Share Repertoire
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Recent Activity
                </h3>

                <ul className="space-y-3 text-gray-600 text-sm">
                    <li>🎵 YEZU WANJYE uploaded</li>
                    <li>📄 PDF sheet added to GUSHIMIRA</li>
                    <li>📚 Sunday Mass repertoire created</li>
                </ul>
            </div>

            {/* Tips / Notices */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <p className="text-sm text-yellow-800">
                    💡 Tip: You can create a repertoire and share the link with choir members or export it as PDF.
                </p>
            </div>
        </div>
    );
}
