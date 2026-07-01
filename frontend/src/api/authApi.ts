import axios from "axios";
import type { AuthResponse, LoginRequest } from "../types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

const authClient = axios.create({ baseURL: API_BASE_URL });

export const authApi = {
  login: (payload: LoginRequest) =>
    authClient
      .post<AuthResponse>("/auth/login", payload)
      .then((res) => res.data),

  refresh: (refreshToken: string) =>
    authClient
      .post<AuthResponse>("/auth/refresh", { refreshToken })
      .then((res) => res.data),

  logout: (refreshToken: string) =>
    authClient.post("/auth/logout", { refreshToken }),
};
