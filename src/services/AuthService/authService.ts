import api from '@/config/api';
import type {
  ApiResponse,
  LoginResponseData,
  RegisterResponseData,
  UpdateAvatarResponse,
  UpdateMeRequest,
  UpdatePasswordRequest,
  UserInfo,
} from './authTypes';

/**
 * Auth Service
 * Chứa các API calls liên quan đến authentication
 * KHÔNG xử lý token trong service - để axios interceptor lo
 */

export const register = async (
  full_name: string,
  email: string,
  password: string
): Promise<ApiResponse<RegisterResponseData>> => {
  const response = await api.post<ApiResponse<RegisterResponseData>>('/auth/register', {
    full_name,
    email,
    password,
  });
  return response.data;
};

export const login = async (
  email: string,
  password: string
): Promise<ApiResponse<LoginResponseData>> => {
  const response = await api.post<ApiResponse<LoginResponseData>>('/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const logout = async (): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/auth/logout');
  return response.data;
};

// =====================
// USER PROFILE APIs
// =====================

export const getMe = async (): Promise<ApiResponse<UserInfo>> => {
  const res = await api.get<ApiResponse<UserInfo>>('/auth/me');
  return res.data;
};

export const updateMe = async (
  payload: UpdateMeRequest
): Promise<ApiResponse<UserInfo>> => {
  const res = await api.put<ApiResponse<UserInfo>>('/auth/me', payload);
  return res.data;
};

export const updateAvatar = async (
  file: File
): Promise<ApiResponse<UpdateAvatarResponse>> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await api.post<ApiResponse<UpdateAvatarResponse>>(
    '/auth/me/avatar',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data;
};

export const updatePassword = async (
  payload: UpdatePasswordRequest
): Promise<ApiResponse<null>> => {
  const res = await api.put<ApiResponse<null>>('/auth/me/password', payload);
  return res.data;
};
