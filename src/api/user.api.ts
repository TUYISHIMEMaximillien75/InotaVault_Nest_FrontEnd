import api from "./axios";

export const getMe = () => api.get("/users/me");
export const updateMe = (data: any) => api.patch("/users/me", data);
