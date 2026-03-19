import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRepertoirePublic } from "../api/repertoire.api";
import {
    Music,
    FileAudio,
    FileText,
    Calendar,
    List,
    AlertCircle,
    BookOpen,
} from "lucide-react";

// ─── Type helpers ────────────────────────────────────────────────────────────
interface PublicSong {
    id: string;
    song_id?: string;
    title: string;
    artist?: string;  // Added artist
    source: "existing" | "typed" | "uploaded";
    position: number;
}

interface PublicSection {
    id: string;
    name: string;
    position: number;
    songs: PublicSong[];
}

interface PublicRepertoire {
    id: string;
    title: string;
    event_type: string;
    createdAt: string;
    sections: PublicSection[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getSongIcon = (source: PublicSong["source"]) => {
    switch (source) {
        case "uploaded":
            return <FileAudio className="w-4 h-4 text-blue-500 shrink-0" />;
        case "typed":
            return <FileText className="w-4 h-4 text-purple-500 shrink-0" />;
        default:
            return <Music className="w-4 h-4 text-red-400 shrink-0" />;
    }
};

const getSourceLabel = (source: PublicSong["source"]) => {
    if (source === "uploaded") return "File";
    if (source === "typed") return "Custom";
    return null;
};

const formatDate = (iso: string) => {
    try {
        return new Date(iso).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return "";
    }
};

// ─── Main component ───────────────────────────────────────────────────────────
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
                // Sort sections and songs by position
                rep.sections = (rep.sections ?? [])
                    .slice()
                    .sort((a: PublicSection, b: PublicSection) => a.position - b.position)
                    .map((sec: PublicSection) => ({
                        ...sec,
                        songs: (sec.songs ?? [])
                            .slice()
                            .sort((a: PublicSong, b: PublicSong) => a.position - b.position),
                    }));
                setRepertoire(rep);
            } catch {
                setError("This repertoire could not be found or is no longer available.");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    // ── Loading ──
    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-red-100 border-t-red-600 animate-spin" />
                        <Music className="absolute inset-0 m-auto w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Loading repertoire…</p>
                </div>
            </div>
        );
    }

    // ── Error ──
    if (error || !repertoire) {
        return (
            <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Repertoire Not Found</h1>
                    <p className="text-gray-500 mb-8">
                        {error || "This repertoire doesn't exist or the link may have expired."}
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                    >
                        Go to InotaVault
                    </Link>
                </div>
            </div>
        );
    }

    const totalSongs = repertoire.sections.reduce((sum, s) => sum + s.songs.length, 0);

    // ── Viewer ──
    return (
        <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-rose-50">
            {/* ── Top bar ──────────────────────────────────────────── */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                            <Music className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-800 text-sm">InotaVault</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Shared Repertoire</span>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
                {/* ── Hero card ────────────────────────────────────── */}
                <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Decorative top strip */}
                    <div className="h-1.5 bg-linear-to-r from-red-500 via-rose-500 to-red-700" />

                    <div className="p-6 sm:p-8">
                        {/* Event type badge */}
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 mb-4">
                            <Calendar className="w-3 h-3" />
                            {repertoire.event_type}
                        </span>

                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">
                            {repertoire.title}
                        </h1>

                        {/* Stats row */}
                        <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <List className="w-4 h-4 text-red-400" />
                                <span>
                                    <strong className="text-gray-700">{repertoire.sections.length}</strong> section{repertoire.sections.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Music className="w-4 h-4 text-red-400" />
                                <span>
                                    <strong className="text-gray-700">{totalSongs}</strong> song{totalSongs !== 1 ? "s" : ""}
                                </span>
                            </div>
                            {repertoire.createdAt && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 text-red-400" />
                                    <span>{formatDate(repertoire.createdAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Sections ─────────────────────────────────────── */}
                {repertoire.sections.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">No sections in this repertoire yet.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {repertoire.sections.map((section, idx) => (
                            <div
                                key={section.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
                            >
                                {/* Section header */}
                                <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-100 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold shrink-0">
                                        {idx + 1}
                                    </span>
                                    <h2 className="font-semibold text-gray-800 text-lg">{section.name}</h2>
                                    <span className="ml-auto text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                                        {section.songs.length} song{section.songs.length !== 1 ? "s" : ""}
                                    </span>
                                </div>

                                {/* Song list */}
                                {section.songs.length === 0 ? (
                                    <div className="px-6 py-5 text-center text-sm text-gray-400">
                                        No songs in this section.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-50">
                                        {section.songs.map((song, songIdx) => {
                                            const label = getSourceLabel(song.source);
                                            const hasLink = song.source === "existing" && song.song_id;

                                            const content = (
                                                <div className="flex items-center gap-4 px-6 py-3.5 hover:bg-red-50/40 transition-colors group">
                                                    {/* Position number */}
                                                    <span className="text-xs font-mono text-gray-300 w-5 text-right shrink-0 group-hover:text-red-400 transition-colors">
                                                        {songIdx + 1}
                                                    </span>

                                                    {/* Icon */}
                                                    <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center shrink-0 shadow-sm transition-colors">
                                                        {getSongIcon(song.source)}
                                                    </div>

                                                    {/* Title & Artist */}
                                                    <div className="flex-1 min-w-0 pr-2">
                                                        <p className={`text-sm font-medium truncate transition-colors ${hasLink ? 'text-gray-800 group-hover:text-red-600' : 'text-gray-700'}`}>
                                                            {song.title}
                                                        </p>
                                                        {(song.artist || song.source === "existing") && (
                                                            <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate uppercase tracking-widest">
                                                                {song.artist || "Unknown Artist"}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Source badge */}
                                                    {label && (
                                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 shrink-0">
                                                            {label}
                                                        </span>
                                                    )}
                                                </div>
                                            );

                                            return (
                                                <li key={song.id} className="block w-full">
                                                    {hasLink ? (
                                                        <Link to={`/songs/${song.song_id}`} className="block w-full h-full">
                                                            {content}
                                                        </Link>
                                                    ) : (
                                                        content
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Footer branding ──────────────────────────────── */}
                <div className="text-center pt-4 pb-8">
                    <p className="text-xs text-gray-400">
                        Powered by{" "}
                        <Link to="/" className="font-semibold text-red-500 hover:text-red-700 transition-colors">
                            InotaVault
                        </Link>
                        {" — "}Your Sacred Music Platform
                    </p>
                </div>
            </main>
        </div>
    );
};

export default RepertoireViewer;
