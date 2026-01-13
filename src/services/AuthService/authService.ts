import api from "@/config/api";
import type {
  ApiResponse,
  LoginResponseData,
  RegisterResponseData,
} from "./authTypes";

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

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
}

export const refreshToken = async (): Promise<ApiResponse<{ access_token: string }>> => {
  const refresh_token = localStorage.getItem("refresh_token");

  const response = await api.post<ApiResponse<{ access_token: string }>>(
    "/auth/refresh-token",
    { refresh_token }
  );

  return response.data;
};
