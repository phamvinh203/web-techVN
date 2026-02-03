import { TokenManager } from "@/utils/tokenManager";
import { login, register } from "@/services/AuthService/authService";
import type { UserInfo } from "@/services/AuthService/authTypes";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (full_name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (userData: UserInfo) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (error) {
          console.error("Failed to parse user from localStorage:", error);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);

      if (response.success && response.data) {
        const { access_token, refresh_token, ...userData } = response.data;

        // Lưu tokens
        TokenManager.setTokens(access_token, refresh_token);

        // Lưu user info
        setUser(userData as UserInfo);
        localStorage.setItem("user", JSON.stringify(userData));

        return { success: true, message: response.message };
      }

      return { success: false, message: response.message || "Đăng nhập thất bại" };
    } catch (error: any) {
      return {
        success: false,
        message: (error as Error).message || "Đăng nhập thất bại",
      };
    }
  };

  const handleRegister = async (full_name: string, email: string, password: string) => {
    try {
      const response = await register(full_name, email, password);

      if (response.success) {
        return { success: true, message: response.message };
      }

      return { success: false, message: response.message || "Đăng ký thất bại" };
    } catch (error: any) {
      return {
        success: false,
        message: (error as Error).message || "Đăng ký thất bại",
      };
    }
  };

  const handleLogout = () => {
    TokenManager.clearTokens();
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleUpdateUser = (userData: UserInfo) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
