import axios from "axios";
import { TokenManager } from "../utils/tokenManager";

import type { ApiResponse } from "@/services/AuthService/authTypes";
import { logout } from "@/services/AuthService/authService";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Axios riêng để refresh (KHÔNG interceptor)
const refreshApi = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = TokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = TokenManager.getRefreshToken();

    if (!refreshToken) {
      await logout();
      TokenManager.clearTokens();
      return Promise.reject(error);
    }

    try {
      const response = await refreshApi.post<
        ApiResponse<{ access_token: string }>
      >("/auth/refresh-token", {
        refresh_token: refreshToken,
      });

      const access_token = response.data.data.access_token;

      TokenManager.setTokens(access_token, refreshToken);

      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return api(originalRequest);
    } catch (err) {
      await logout();
      TokenManager.clearTokens();
      return Promise.reject(err);
    }
  }
);

export default api;
