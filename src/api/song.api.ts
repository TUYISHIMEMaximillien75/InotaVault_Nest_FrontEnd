import api from "./axios";

export const getAllSongs = () =>
  api.get("/allsongs");

export const getSongById = (id: string) =>
  api.get(`/songs/${id}`);

export const uploadSong = (data: FormData) =>
  api.post("/songs", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateSong = (id: string, data: any) =>
  api.put(`/songs/${id}`, data);

export const deleteSong = (id: string) =>
  api.delete(`/deletesongs/${id}`);
