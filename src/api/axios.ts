import axios from "axios";

const api = axios.create({
  // baseURL: "https://backendinotavault-production.up.railway.app/"
  baseURL: "https://backend-inotavault.vercel.app/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
