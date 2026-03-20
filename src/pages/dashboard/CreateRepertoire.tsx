import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import EventTypeSelect from "../../components/repertoire/EventTypeSelect";
import SectionCard from "../../components/repertoire/SectionCard";
import { HolyMassTemplate } from "../../components/repertoire/HolyMassTemplate";
import type { EventType, Section, SongItem } from "../../types/repertoire";
import { createRepertoire } from "../../api/repertoire.api";
import { useNavigate } from "react-router-dom";

const CreateRepertoire: React.FC = () => {
    const navigate = useNavigate();
    const [eventType, setEventType] = useState<EventType | "">("");
    const [sections, setSections] = useState<Section[]>([]);
    const [repertoireTitle, setRepertoireTitle] = useState("");
    const [saving, setSaving] = useState(false);

    // Auto-load template for Holy Mass
    useEffect(() => {
        if (eventType === "Holy Mass") {
            // Deep copy to avoid reference issues
            setSections(JSON.parse(JSON.stringify(HolyMassTemplate)));
        } else if (eventType && !sections.length) {
            // For other types, maybe start with one empty section or keep previous if switching?
            // Prompt implies "Automatically load... when selected".
            // If switching FROM Holy Mass TO Custom, should we clear?
            // Let's clear if switching to a non-template type to be safe, or maybe just leave it.
            // "Automatically load a Holy Mass template when selected" implies explicit action.
            // If user built a custom list and switches to Holy Mass, it SHOULD override.
            // If user has Holy Mass and switches to Custom, maybe keep it?
            // Let's start with empty for others for now to avoid confusion.
            setSections([]);
        }
    }, [eventType]);

    const handleAddSection = () => {
        const newSection: Section = {
            id: crypto.randomUUID(),
            name: "New Section",
            songs: [],
        };
        setSections([...sections, newSection]);
    };

    const handleRemoveSection = (id: string) => {
        setSections(sections.filter((s) => s.id !== id));
    };

    const handleMoveSection = (index: number, direction: "up" | "down") => {
        const newSections = [...sections];
        if (direction === "up" && index > 0) {
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
        } else if (direction === "down" && index < newSections.length - 1) {
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        }
        setSections(newSections);
    };

    const handleAddSong = (sectionId: string, song: SongItem) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return { ...section, songs: [...section.songs, song] };
            }
            return section;
        }));
    };

    const handleRemoveSong = (sectionId: string, songId: string) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return { ...section, songs: section.songs.filter(s => s.id !== songId) };
            }
            return section;
        }));
    };

    const handleUpdateSong = (sectionId: string, songId: string, updates: Partial<SongItem>) => {
        setSections(prev => prev.map(section => {
            if (section.id !== sectionId) return section;
            return {
                ...section,
                songs: section.songs.map(s => s.id === songId ? { ...s, ...updates } : s),
            };
        }));
    };

    const handleRenameSection = (id: string, newName: string) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, name: newName } : section
        ));
    };

    const handleSave = async () => {
        if (!repertoireTitle.trim()) {
            alert("Please enter a repertoire title.");
            return;
        }
        if (!eventType) {
            alert("Please select an event type.");
            return;
        }
        setSaving(true);
        try {
            await createRepertoire({
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
            // alert("Repertoire saved successfully!");
            navigate("/dashboard/repertoires");
        } catch (err) {
            console.error("Failed to save repertoire", err);
            alert("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-red-700 ">Create New Repertoire</h1>
                <p className="text-gray-500 ">Assemble your perfect song list for any occasion.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-red-700 ">
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
                    <EventTypeSelect selectedType={eventType} onSelect={setEventType} />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Sections
                    </h2>
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
                                No sections yet. Select an event type or add a section manually.
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

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                    {saving ? "Saving..." : "Save Repertoire"}
                </button>
            </div>
        </div>
    );
};

export default CreateRepertoire;
