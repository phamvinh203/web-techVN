export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/* =========================
   ADDRESS MODEL (FRONTEND)
========================= */

export interface Address {
  _id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address: string;
  ward?: string;
  district?: string;
  province?: string;
  is_default: boolean;
}

/* =========================
   REQUEST TYPES
========================= */

export interface CreateAddressRequest {
  full_name: string;
  phone: string;
  address: string;
  ward?: string;
  district?: string;
  province?: string;
  is_default?: boolean;
}
