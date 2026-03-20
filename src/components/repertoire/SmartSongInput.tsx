import React, { useState, useRef, useEffect } from "react";
import { Search, Upload, Type, Music, Loader2 } from "lucide-react";
import type { SongItem } from "../../types/repertoire";
import { searchSongInCategory, uploadSongForRepertoire } from "../../api/song.api";

interface SmartSongInputProps {
    onAddSong: (song: SongItem) => void;
    onUpdateSong?: (id: string, updates: Partial<SongItem>) => void;
    category: string;
}

const SmartSongInput: React.FC<SmartSongInputProps> = ({ onAddSong, onUpdateSong, category }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Debounced search
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await searchSongInCategory(searchTerm, category);
                setSearchResults(res.data);
            } catch (err) {
                console.error("Failed to search songs", err);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Reset so same file can be re-selected after an error
        e.target.value = "";

        const displayName = file.name.replace(/\.[^/.]+$/, "");

        // Add a loading placeholder immediately
        const tempId = crypto.randomUUID();
        onAddSong({
            id: tempId,
            title: displayName,
            source: "uploaded",
            uploading: true,
        });
        setIsOpen(false);
        setSearchTerm("");

        try {
            const res = await uploadSongForRepertoire(displayName, file);
            const { id: song_id, pdf_sheet } = res.data;
            if (onUpdateSong) {
                onUpdateSong(tempId, { song_id, uri: pdf_sheet, uploading: false });
            }
        } catch (err) {
            console.error("Failed to upload PDF to Cloudinary", err);
            if (onUpdateSong) {
                onUpdateSong(tempId, { uploading: false, uploadError: true });
            }
        }
    };


    const handleManualEntry = () => {
        if (searchTerm.trim()) {
            onAddSong({
                id: crypto.randomUUID(),
                title: searchTerm,
                source: "typed",
            });
            setIsOpen(false);
            setSearchTerm("");
        }
    };

    const handleSelectSong = (song: any) => {
        onAddSong({
            id: song.id,
            title: song.name, // Mapping API 'name' to 'title'
            source: "existing",
        });
        setIsOpen(false);
        setSearchTerm("");
    }

    return (
        <div className="relative w-full">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="Search song or type to add custom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                    </div>
                )}
            </div>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden"
                >
                    {/* Action Buttons */}
                    <div className="p-2 border-b border-gray-100 grid grid-cols-2 gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors text-sm font-medium"
                        >
                            <Upload className="w-4 h-4" />
                            <span>Upload PDF</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="application/pdf"
                            onChange={handleFileUpload}
                        />

                        <button
                            onClick={handleManualEntry}
                            disabled={!searchTerm}
                            className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${searchTerm
                                ? "bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                                : "bg-gray-50 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <Type className="w-4 h-4" />
                            <span>Add as Text</span>
                        </button>
                    </div>

                    {/* Search Results */}
                    <div className="max-h-60 overflow-y-auto">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {searchResults.length > 0 ? "Suggestions" : searchTerm ? "No existing songs found" : "Start typing to search..."}
                        </div>
                        {searchResults.map((song) => (
                            <button
                                key={song.id}
                                onClick={() => handleSelectSong(song)}
                                className="w-full flex items-center px-4 py-3 hover:bg-red-50 transition-colors text-left group"
                            >
                                <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-500 group-hover:text-red-500 group-hover:bg-white transition-colors">
                                    <Music className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 group-hover:text-red-700">
                                        {song.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {song.artist || "Unknown Artist"}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartSongInput;
