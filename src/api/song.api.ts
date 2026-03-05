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

export const searchSong = (query: string) =>{
  return api.get(`/songs/search?query=${query}`);
}
export const searchSongInCategory = (query: string, category: string) =>{
  // console.log("category",category);
  // console.log("query",query);
  return api.get(`/songs/searchincategory?query=${query}&category=${category}`);
}

export const searchInSong = (query: string) =>
  api.get(`/songs/searchinmylibrary?query=${query}`);

export const getSongByUploaderId = async (uploaderId: string) =>{
  return await api.get(`/songs/uploader?uploader_id=${uploaderId}`);
}

export const updateSong = (id: string, data: any) =>
  api.put(`/songs/${id}`, data);

export const deleteSong = (id: string) =>
  api.delete(`/deletesongs/${id}`);
