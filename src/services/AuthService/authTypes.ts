export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/* User Info */

export interface UserInfo {
  _id: string;
  full_name: string;
  email: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  birthday?: string;
  address?: string;
  avatar?: string;
  isRole: string;
}


/* Auth Response Data */

export interface RegisterResponseData {
  _id: string;
  full_name: string;
  email: string;
  isRole: string;
}

export interface LoginResponseData {
  _id: string;
  full_name: string;
  email: string;
  isRole: string;
  access_token: string;
  refresh_token: string;
}

// User profile response data
export interface GetMeResponse {
  user: UserInfo;
}

export interface UpdateMeRequest {
  full_name?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  birthday?: string;
  address?: string[];
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface UpdateAvatarResponse {
  avatarUrl: string;
  filePath: string;
}
