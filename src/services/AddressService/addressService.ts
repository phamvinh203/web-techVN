import api from "@/config/api";
import type {
  ApiResponse,
  Address,
  CreateAddressRequest,
} from "./addressTypes";

export const getAddresses = async (): Promise<ApiResponse<Address[]>> => {
  const res = await api.get<ApiResponse<Address[]>>("auth/me/address");
  return res.data;
};


export const addAddress = async (
  payload: CreateAddressRequest
): Promise<ApiResponse<Address>> => {
  const res = await api.post<ApiResponse<Address>>(
    "auth/me/address/create",
    payload
  );
  return res.data;
};

export const updateAddress = async (
  addressId: string,
  payload: CreateAddressRequest
): Promise<ApiResponse<Address>> => {
  const res = await api.put<ApiResponse<Address>>(
    `auth/me/address/update/${addressId}`,
    payload
  );
  return res.data;
}


export const deleteAddress = async (
  addressId: string
): Promise<ApiResponse<null>> => {
  const res = await api.delete<ApiResponse<null>>(
    `auth/me/address/delete/${addressId}`
  );
  return res.data;
};
