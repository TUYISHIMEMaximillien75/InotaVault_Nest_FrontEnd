import React from "react";
import { ArrowUp, ArrowDown, Trash2, X, FileAudio, FileText, Music } from "lucide-react";
import type { Section, SongItem } from "../../types/repertoire";
import SmartSongInput from "./SmartSongInput";

interface SectionCardProps {
    section: Section;
    index: number;
    totalSections: number;
    onRemoveSection: (id: string) => void;
    onMoveSection: (index: number, direction: "up" | "down") => void;
    onAddSong: (sectionId: string, song: SongItem) => void;
    onRemoveSong: (sectionId: string, songId: string) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
    section,
    index,
    totalSections,
    onRemoveSection,
    onMoveSection,
    onAddSong,
    onRemoveSong,
}) => {

    const getSongIcon = (source: SongItem["source"]) => {
        switch (source) {
            case "uploaded": return <FileAudio className="w-4 h-4 text-blue-500" />;
            case "typed": return <FileText className="w-4 h-4 text-purple-500" />;
            default: return <Music className="w-4 h-4 text-gray-500" />;
        }
    }

    return (
        // return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-700/30 rounded-t-xl">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                    {section.name}
                </h3>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => onMoveSection(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move Up"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onMoveSection(index, "down")}
                        disabled={index === totalSections - 1}
                        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move Down"
                    >
                        <ArrowDown className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    <button
                        onClick={() => onRemoveSection(section.id)}
                        className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 transition-colors"
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
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 group hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                                        {getSongIcon(song.source)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {song.title}
                                    </span>
                                    {song.source === "uploaded" && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full">FILE</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => onRemoveSong(section.id, song.id!)}
                                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Input */}
                <SmartSongInput onAddSong={(song) => onAddSong(section.id, song)} category={section.name} />
            </div>
        </div>
    );
};

export default SectionCard;
