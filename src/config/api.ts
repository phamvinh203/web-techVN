import axios from "axios";
import { TokenManager } from "../utils/tokenManager";
import logout from "../utils/logout";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Tạo instance riêng cho refresh API (không có interceptor)
const refreshApi = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use((config) => {
  const token = TokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý response và refresh token nếu cần
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config: originalRequest, response } = error;

    // Chỉ xử lý lỗi 401 và chưa retry
    if (response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Nếu là API delete board với verification token, không auto logout
    if (
      originalRequest.url?.includes("/api/home/") &&
      originalRequest.method === "delete"
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshToken = TokenManager.getRefreshToken();

    // Không có refresh token -> logout
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    try {
      // Refresh token
      const { data } = await refreshApi.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefreshToken } = data;
      TokenManager.setTokens(access_token, newRefreshToken);

      // Retry với token mới
      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return api(originalRequest);
    } catch {
      // Refresh thất bại -> logout
      logout();
      return Promise.reject(error);
    }
  }
);

export default api;
