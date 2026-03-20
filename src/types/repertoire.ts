export type EventType = "Holy Mass" | "Wedding" | "Concert" | "Funeral" | string;

export type SongSource = "existing" | "typed" | "uploaded";

export interface SongItem {
    id?: string;
    /** DB id of the Song record created when a PDF is uploaded inside the repertoire builder */
    song_id?: string;
    title: string;
    source: SongSource;
    uri?: string;           // Cloudinary URL after upload
    uploading?: boolean;    // true while the PDF is being sent to the server
    uploadError?: boolean;  // true if the upload failed
}

export interface Section {
    id: string;
    name: string;
    songs: SongItem[];
}
