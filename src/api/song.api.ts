import api from "./axios";

export const getAllSongs = () =>
  api.get("/allsongs");

export const getSongById = (id: string) =>
  api.get(`/songs/${id}`);

export const uploadSong = (data: FormData) => {
  return api.post("/songs/upload", data);
};

export const getAllCategories = () =>
  api.get("/songs/categories");

export const searchSong = (query: string) =>
  api.get(`/songs/search?query=${query}`);

export const updateSong = (id: string, data: any) =>
  api.put(`/songs/${id}`, data);

export const deleteSong = (id: string) =>
  api.delete(`/deletesongs/${id}`);
