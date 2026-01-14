import { getMe, updateAvatar, updateMe, updatePassword } from "@/services/AuthService/authService";
import type { UpdateMeRequest, UpdatePasswordRequest, UserInfo } from "@/services/AuthService/authTypes";
import { useCallback, useEffect, useState } from "react";


interface UseProfileReturn {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  onUpdateProfile: (payload: UpdateMeRequest) => Promise<boolean>;
  onUpdateAvatar: (file: File) => Promise<boolean>;
  onUpdatePassword: (payload: UpdatePasswordRequest) => Promise<boolean>;
}

export const useProfile = (): UseProfileReturn => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMe();
      setUser(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể lấy thông tin người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile info
  const onUpdateProfile = async (
    payload: UpdateMeRequest
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await updateMe(payload);
      setUser(res.data);

      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Cập nhật thông tin thất bại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update avatar
  const onUpdateAvatar = async (file: File): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await updateAvatar(file);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              avatar: res.data.avatarUrl,
            }
          : prev
      );

      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Cập nhật avatar thất bại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const onUpdatePassword = async (
    payload: UpdatePasswordRequest
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await updatePassword(payload);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đổi mật khẩu thất bại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch profile khi mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    user,
    loading,
    error,
    fetchProfile,
    onUpdateProfile,
    onUpdateAvatar,
    onUpdatePassword,
  };
};
