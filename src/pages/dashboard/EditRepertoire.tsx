import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Loader2 } from "lucide-react";
import EventTypeSelect from "../../components/repertoire/EventTypeSelect";
import SectionCard from "../../components/repertoire/SectionCard";
import { HolyMassTemplate } from "../../components/repertoire/HolyMassTemplate";
import type { EventType, Section, SongItem } from "../../types/repertoire";
import { getRepertoireById, updateRepertoire } from "../../api/repertoire.api";

// Helper: map API-shaped songs back into front-end SongItem shape
function mapApiSong(s: any): SongItem {
    return {
        id: s.id,
        song_id: s.song_id ?? undefined,
        title: s.title,
        source: s.source,
        uri: s.file_uri ?? undefined,
    };
}

// Helper: map API-shaped sections back into front-end Section shape
function mapApiSection(sec: any): Section {
    return {
        id: sec.id,
        name: sec.name,
        songs: (sec.songs ?? [])
            .slice()
            .sort((a: any, b: any) => a.position - b.position)
            .map(mapApiSong),
    };
}

const EditRepertoire: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fetchError, setFetchError] = useState("");

    const [repertoireTitle, setRepertoireTitle] = useState("");
    const [eventType, setEventType] = useState<EventType | "">("");
    const [sections, setSections] = useState<Section[]>([]);

    // ── Load existing repertoire ──────────────────────────────────────────────
    useEffect(() => {
        if (!id) return;
        const load = async () => {
            try {
                const res = await getRepertoireById(id);
                const rep = res.data;
                setRepertoireTitle(rep.title);
                setEventType(rep.event_type);
                const sorted = (rep.sections ?? [])
                    .slice()
                    .sort((a: any, b: any) => a.position - b.position)
                    .map(mapApiSection);
                setSections(sorted);
            } catch {
                setFetchError("Could not load this repertoire. Please go back and try again.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    // ── Section / Song handlers (same logic as CreateRepertoire) ─────────────
    const handleAddSection = () => {
        setSections(prev => [...prev, {
            id: crypto.randomUUID(),
            name: "New Section",
            songs: [],
        }]);
    };

    const handleRemoveSection = (sectionId: string) => {
        setSections(prev => prev.filter(s => s.id !== sectionId));
    };

    const handleMoveSection = (index: number, direction: "up" | "down") => {
        const next = [...sections];
        if (direction === "up" && index > 0) {
            [next[index], next[index - 1]] = [next[index - 1], next[index]];
        } else if (direction === "down" && index < next.length - 1) {
            [next[index], next[index + 1]] = [next[index + 1], next[index]];
        }
        setSections(next);
    };

    const handleAddSong = (sectionId: string, song: SongItem) => {
        setSections(prev => prev.map(sec =>
            sec.id === sectionId ? { ...sec, songs: [...sec.songs, song] } : sec
        ));
    };

    const handleRemoveSong = (sectionId: string, songId: string) => {
        setSections(prev => prev.map(sec =>
            sec.id === sectionId
                ? { ...sec, songs: sec.songs.filter(s => s.id !== songId) }
                : sec
        ));
    };

    const handleUpdateSong = (sectionId: string, songId: string, updates: Partial<SongItem>) => {
        setSections(prev => prev.map(sec => {
            if (sec.id !== sectionId) return sec;
            return { ...sec, songs: sec.songs.map(s => s.id === songId ? { ...s, ...updates } : s) };
        }));
    };

    const handleRenameSection = (id: string, newName: string) => {
        setSections(prev => prev.map(sec =>
            sec.id === id ? { ...sec, name: newName } : sec
        ));
    };

    // ── Template reload when event type changes ──────────────────────────────
    // Only auto-load template if user actively changes event type
    const hasLoadedRef = React.useRef(false);
    const handleEventTypeChange = (type: EventType | "") => {
        setEventType(type);
        if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            return; // Ignore the first programmatic set from useEffect
        }
        if (type === "Holy Mass") {
            setSections(JSON.parse(JSON.stringify(HolyMassTemplate)));
        }
    };

    // ── Save ─────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!repertoireTitle.trim()) {
            alert("Please enter a repertoire title.");
            return;
        }
        if (!eventType) {
            alert("Please select an event type.");
            return;
        }
        if (!id) return;

        setSaving(true);
        try {
            await updateRepertoire(id, {
                title: repertoireTitle,
                event_type: eventType,
                sections: sections.map((section, i) => ({
                    name: section.name,
                    position: i,
                    songs: section.songs.map((song, j) => ({
                        song_id: song.source === "existing" ? song.id : (song.source === "uploaded" ? song.song_id : undefined),
                        title: song.title,
                        source: song.source,
                        file_uri: song.uri ?? undefined,
                        position: j,
                    })),
                })),
            });
            navigate("/dashboard/repertoires");
        } catch (err) {
            console.error("Failed to update repertoire", err);
            alert("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // ── Render states ─────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader2 className="w-9 h-9 text-red-500 animate-spin" />
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center py-20">
                <p className="text-red-500 font-medium">{fetchError}</p>
                <button
                    onClick={() => navigate("/dashboard/repertoires")}
                    className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Back to Repertoires
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <button
                        onClick={() => navigate("/dashboard/repertoires")}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Repertoires
                    </button>
                    <h1 className="text-3xl font-bold text-red-700">Edit Repertoire</h1>
                    <p className="text-gray-500">Update your song list for this event.</p>
                </div>
            </div>

            {/* Title + Event Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-red-700">
                        Repertoire Title
                    </label>
                    <input
                        type="text"
                        value={repertoireTitle}
                        onChange={(e) => setRepertoireTitle(e.target.value)}
                        placeholder="e.g., Sunday Mass - Easter"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-transparent"
                    />
                </div>
                <div>
                    <EventTypeSelect
                        selectedType={eventType}
                        onSelect={handleEventTypeChange}
                    />
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Sections</h2>
                    <button
                        onClick={handleAddSection}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Section</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {sections.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">
                                No sections yet. Add a section or reload a template.
                            </p>
                        </div>
                    ) : (
                        sections.map((section, index) => (
                            <SectionCard
                                key={section.id}
                                section={section}
                                index={index}
                                totalSections={sections.length}
                                onRemoveSection={handleRemoveSection}
                                onMoveSection={handleMoveSection}
                                onAddSong={handleAddSong}
                                onUpdateSong={handleUpdateSong}
                                onRemoveSong={handleRemoveSong}
                                onRenameSection={handleRenameSection}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <button
                    onClick={() => navigate("/dashboard/repertoires")}
                    className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default EditRepertoire;
