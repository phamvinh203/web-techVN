import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { TokenService } from '@/services/token.service';
import type { ApiResponse } from '@/services/AuthService/authTypes';

/**
 * Axios Instance Configuration
 * - Request interceptor: Auto attach Bearer token
 * - Response interceptor: Handle 401 with refresh token queue
 */

// Main axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Axios riêng cho refresh token (KHÔNG có interceptor để tránh infinite loop)
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// =====================
// REFRESH TOKEN QUEUE
// =====================
// Giải quyết race condition: chỉ 1 request refresh, các request khác chờ

interface QueueItem {
  resolve: (token: string | null) => void;
  reject: (error: Error) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

// Logout callback - sẽ được inject từ AuthContext
let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void): void => {
  logoutCallback = callback;
};

/**
 * Process tất cả requests đang chờ trong queue
 */
const processQueue = (error: Error | null, token: string | null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Thực hiện logout: clear tokens và gọi callback
 */
const performLogout = (): void => {
  TokenService.clearAll();
  if (logoutCallback) {
    logoutCallback();
  }
};

// =====================
// REQUEST INTERCEPTOR
// =====================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = TokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================
// RESPONSE INTERCEPTOR
// =====================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Debug log để xem status code thực tế
    console.log('[API Interceptor] Error status:', error.response?.status, 'URL:', originalRequest?.url);

    // Handle cả 401 và 403 (unauthorized/forbidden)
    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
    
    // Chỉ handle auth error và chưa retry
    if (!isAuthError || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Nếu đang refresh, thêm request vào queue chờ
    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Đánh dấu request này đã retry
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = TokenService.getRefreshToken();

    // Không có refresh token -> logout
    if (!refreshToken) {
      isRefreshing = false;
      performLogout();
      return Promise.reject(error);
    }

    try {
      // Gọi API refresh token
      const response = await refreshApi.post<ApiResponse<{ access_token: string }>>(
        '/auth/refresh-token',
        { refresh_token: refreshToken }
      );

      const newAccessToken = response.data.data.access_token;

      // Lưu access token mới
      TokenService.setAccessToken(newAccessToken);

      // Process các requests đang chờ
      processQueue(null, newAccessToken);

      // Retry request gốc với token mới
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh thất bại -> logout
      processQueue(refreshError as Error, null);
      performLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
