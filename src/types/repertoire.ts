export type EventType = "Holy Mass" | "Wedding" | "Concert" | "Funeral" | string;

export type SongSource = "existing" | "typed" | "uploaded";

export interface SongItem {
    id?: string;
    title: string;
    source: SongSource;
    uri?: string; // For uploaded files
}

export interface Section {
    id: string;
    name: string;
    songs: SongItem[];
}
