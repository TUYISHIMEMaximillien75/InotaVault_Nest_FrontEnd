import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, ArrowDown, Trash2, X, FileAudio, FileText, Music, Pencil, Check, Loader2, AlertCircle } from "lucide-react";
import type { Section, SongItem } from "../../types/repertoire";
import SmartSongInput from "./SmartSongInput";

interface SectionCardProps {
    section: Section;
    index: number;
    totalSections: number;
    onRemoveSection: (id: string) => void;
    onMoveSection: (index: number, direction: "up" | "down") => void;
    onAddSong: (sectionId: string, song: SongItem) => void;
    onUpdateSong: (sectionId: string, songId: string, updates: Partial<SongItem>) => void;
    onRemoveSong: (sectionId: string, songId: string) => void;
    onRenameSection: (id: string, newName: string) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
    section,
    index,
    totalSections,
    onRemoveSection,
    onMoveSection,
    onAddSong,
    onUpdateSong,
    onRemoveSong,
    onRenameSection,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(section.name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    useEffect(() => {
        setDraftName(section.name);
    }, [section.name]);

    const handleStartEdit = () => {
        setDraftName(section.name);
        setIsEditing(true);
    };

    const handleConfirmRename = () => {
        const trimmed = draftName.trim();
        if (trimmed && trimmed !== section.name) {
            onRenameSection(section.id, trimmed);
        } else {
            setDraftName(section.name);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleConfirmRename();
        if (e.key === "Escape") {
            setDraftName(section.name);
            setIsEditing(false);
        }
    };

    const getSongIcon = (song: SongItem) => {
        if (song.uploading) return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
        if (song.uploadError) return <AlertCircle className="w-4 h-4 text-red-500" />;
        switch (song.source) {
            case "uploaded": return <FileAudio className="w-4 h-4 text-blue-500" />;
            case "typed": return <FileText className="w-4 h-4 text-purple-500" />;
            default: return <Music className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
                {/* Inline editable section name */}
                <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                    {isEditing ? (
                        <>
                            <input
                                ref={inputRef}
                                type="text"
                                value={draftName}
                                onChange={(e) => setDraftName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={handleConfirmRename}
                                className="flex-1 min-w-0 text-lg font-semibold text-gray-800 border-b-2 border-red-500 bg-transparent outline-none px-0 py-0.5"
                            />
                            <button
                                onMouseDown={(e) => { e.preventDefault(); handleConfirmRename(); }}
                                className="p-1 rounded-md text-red-600 hover:bg-red-100 transition-colors shrink-0"
                                title="Confirm rename"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <h3 className="font-semibold text-lg text-gray-800 truncate">
                                {section.name}
                            </h3>
                            <button
                                onClick={handleStartEdit}
                                className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-gray-200 transition-colors shrink-0"
                                title="Rename section"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-1 shrink-0">
                    <button
                        onClick={() => onMoveSection(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move Up"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onMoveSection(index, "down")}
                        disabled={index === totalSections - 1}
                        className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move Down"
                    >
                        <ArrowDown className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button
                        onClick={() => onRemoveSection(section.id)}
                        className="p-1.5 rounded-md hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove Section"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Song List */}
                {section.songs.length > 0 && (
                    <ul className="space-y-2">
                        {section.songs.map((song) => (
                            <li
                                key={song.id}
                                className={`flex items-center justify-between p-3 rounded-lg border group hover:border-red-200 transition-all ${
                                    song.uploadError
                                        ? "bg-red-50 border-red-200"
                                        : song.uploading
                                        ? "bg-blue-50 border-blue-200"
                                        : "bg-gray-50 border-gray-100"
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        {getSongIcon(song)}
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {song.title}
                                        </span>
                                        {song.uploading && (
                                            <p className="text-xs text-blue-500">Uploading Into Your <span className="text-black font-bold">Vault</span> <span className="text-2xl text-red-600">. . .</span></p>
                                        )}
                                        {song.uploadError && (
                                            <p className="text-xs text-red-500">Upload failed — please remove and try again</p>
                                        )}
                                    </div>
                                    {song.source === "uploaded" && !song.uploading && !song.uploadError && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full">PDF</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => onRemoveSong(section.id, song.id!)}
                                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    disabled={song.uploading}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Input */}
                <SmartSongInput
                    onAddSong={(song) => onAddSong(section.id, song)}
                    onUpdateSong={(tempId, updates) => onUpdateSong(section.id, tempId, updates)}
                    category={section.name}
                />
            </div>
        </div>
    );
};

export default SectionCard;


