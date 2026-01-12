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