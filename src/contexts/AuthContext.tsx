import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { TokenService } from '@/services/token.service';
import { setLogoutCallback } from '@/config/api';
import { login as loginApi, register as registerApi, logout as logoutApi } from '@/services/AuthService/authService';
import type { UserInfo } from '@/services/AuthService/authTypes';

/**
 * Auth Context
 * Quản lý authentication state và cung cấp các methods: login, register, logout
 * - Inject logout callback vào axios instance để xử lý 401/403
 * - Persist user state qua localStorage
 */

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (full_name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: UserInfo) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Logout handler
   * 1. Gọi API logout (best effort - không fail nếu API lỗi)
   * 2. Clear tokens và user state
   * 3. Redirect về homepage
   */
  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      // Ignore logout API errors - vẫn clear local state
      console.warn('Logout API failed:', error);
    }

    TokenService.clearAll();
    setUser(null);
    window.location.href = '/';
  }, []);

  /**
   * Logout sync (không gọi API) - dùng cho axios interceptor
   * Khi refresh token thất bại, không cần gọi API logout
   */
  const handleLogoutSync = useCallback(() => {
    TokenService.clearAll();
    setUser(null);
    window.location.href = '/';
  }, []);

  // Inject logout callback vào axios instance khi mount
  useEffect(() => {
    setLogoutCallback(handleLogoutSync);
  }, [handleLogoutSync]);

  // Load user từ localStorage khi mount
  useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          const userData = JSON.parse(userStr) as UserInfo;
          setUser(userData);
        } catch (error) {
          console.error('Failed to parse user from localStorage:', error);
          localStorage.removeItem(USER_KEY);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Login handler
   * 1. Gọi API login
   * 2. Lưu tokens vào localStorage
   * 3. Lưu user info vào state và localStorage
   */
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password);

      if (response.success && response.data) {
        const { access_token, refresh_token, ...userData } = response.data;

        // Lưu tokens
        TokenService.setTokens(access_token, refresh_token);

        // Lưu user info (không bao gồm tokens)
        const userInfo: UserInfo = {
          _id: userData._id,
          full_name: userData.full_name,
          email: userData.email,
          avatar: userData.avatar,
          isRole: userData.isRole,
        };

        setUser(userInfo);
        localStorage.setItem(USER_KEY, JSON.stringify(userInfo));

        return { success: true, message: response.message };
      }

      return { success: false, message: response.message || 'Đăng nhập thất bại' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Register handler
   */
  const handleRegister = async (full_name: string, email: string, password: string) => {
    try {
      const response = await registerApi(full_name, email, password);

      if (response.success) {
        return { success: true, message: response.message };
      }

      return { success: false, message: response.message || 'Đăng ký thất bại' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại';
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Update user info (dùng sau khi update profile)
   */
  const handleUpdateUser = (userData: UserInfo) => {
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateUser: handleUpdateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
