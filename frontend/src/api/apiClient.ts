import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { authApi } from "./authApi";
import { refreshTokenStorage } from "../services/tokenStorage";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8080/api" : "");

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_URL is not configured. Please set it in your environment variables."
  );
}

let accessToken: string | null = null;

let onTokenRefreshed: ((accessToken: string) => void) | null = null;
let onRefreshFailed: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function registerAuthCallbacks(callbacks: {
  onTokenRefreshed: (accessToken: string) => void;
  onRefreshFailed: () => void;
}) {
  onTokenRefreshed = callbacks.onTokenRefreshed;
  onRefreshFailed = callbacks.onRefreshFailed;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  pendingRequests.push(callback);
}

function notifyPendingRequests(token: string) {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isUnauthorized = error.response?.status === 401;

    if (!isUnauthorized || originalRequest?._retry || !originalRequest) {
      return Promise.reject(error);
    }

    const refreshToken = refreshTokenStorage.get();

    if (!refreshToken) {
      onRefreshFailed?.();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshed = await authApi.refresh(refreshToken);

      setAccessToken(refreshed.accessToken);
      refreshTokenStorage.set(refreshed.refreshToken);

      onTokenRefreshed?.(refreshed.accessToken);
      notifyPendingRequests(refreshed.accessToken);

      originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;

      return apiClient(originalRequest);
    } catch (err) {
      pendingRequests = [];
      refreshTokenStorage.clear();
      setAccessToken(null);
      onRefreshFailed?.();

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
