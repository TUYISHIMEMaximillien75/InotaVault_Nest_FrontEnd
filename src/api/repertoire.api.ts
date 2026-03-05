import api from "./axios";

export interface RepertoireSongPayload {
    song_id?: string;
    title: string;
    source: "existing" | "typed" | "uploaded";
    file_uri?: string;
    position?: number;
}

export interface RepertoireSectionPayload {
    name: string;
    position: number;
    songs: RepertoireSongPayload[];
}

export interface CreateRepertoirePayload {
    title: string;
    event_type: string;
    sections: RepertoireSectionPayload[];
}

export const createRepertoire = (data: CreateRepertoirePayload) =>
    api.post("/repertoire", data);

export const updateRepertoire = (id: string, data: CreateRepertoirePayload) =>
    api.put(`/repertoire/${id}`, data);

export const getAllRepertoires = () =>
    api.get("/repertoire");

export const getRepertoireById = (id: string) =>
    api.get(`/repertoire/${id}`);

export const deleteRepertoire = (id: string) =>
    api.delete(`/repertoire/${id}`);
