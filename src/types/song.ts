export interface Song {
    id: string;
    name: string;
    album: string;
    artist: string;
    category: string;
    description: string;
    releaseDate?: string;
    external_link?: string;
    pdf_sheet?: string;
    audio_file?: string;
    video_file?: string;
    coverImage?: string;
    uploaderId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface DashboardData {
    songs: Song[];
    categories: string[]; // Assuming categories are strings based on SongUpload
}
