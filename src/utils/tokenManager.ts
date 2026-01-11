export const TokenManager = {
  // Lưu tokens
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  },

  // Lấy access token
  getAccessToken: (): string | null => {
    return localStorage.getItem("access_token");
  },

  // Lấy refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem("refresh_token");
  },

  // Xóa tất cả tokens
  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  // Kiểm tra user đã đăng nhập
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("access_token");
  },
};
