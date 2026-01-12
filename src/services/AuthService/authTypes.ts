/* Request Types */

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
  isRole: string;
}

/* API Response Wrapper */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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


