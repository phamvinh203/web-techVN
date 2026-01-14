import api from "@/config/api";
import type {
  ApiResponse,
  LoginResponseData,
  RegisterResponseData,
  UpdateAvatarResponse,
  UpdateMeRequest,
  UpdatePasswordRequest,
  UserInfo,
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


// user profile
export const getMe = async (): Promise<ApiResponse<UserInfo>> => {
  const res = await api.get<ApiResponse<UserInfo>>("/auth/me");
  return res.data;
};

export const updateMe = async (
  payload: UpdateMeRequest
): Promise<ApiResponse<UserInfo>> => {
  const res = await api.put<ApiResponse<UserInfo>>("/auth/me", payload);
  return res.data;
};

export const updateAvatar = async (
  file: File
): Promise<ApiResponse<UpdateAvatarResponse>> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await api.post<ApiResponse<UpdateAvatarResponse>>(
    "/auth/me/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const updatePassword = async (
  payload: UpdatePasswordRequest
): Promise<ApiResponse<null>> => {
  const res = await api.put<ApiResponse<null>>(
    "/auth/me/password",
    payload
  );
  return res.data;
};

// user addresses
