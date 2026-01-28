import api from "./axios";

export const registerUser = (data: any) =>
  api.post("/register", data);

export const loginUser = (data: any) =>
  api.post("/login", data);

export const getProfile = () =>
  api.get("auth/profile");
