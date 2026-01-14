import { useCallback, useEffect, useState } from "react";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  updateAddress,
} from "@/services/AddressService/addressService";
import type {
  Address,
  CreateAddressRequest,
} from "@/services/AddressService/addressTypes";

export function useAddress() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAddresses();
      setAddresses(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Không thể tải địa chỉ"
      );
    } finally {
      setLoading(false);
    }
  }, []);


  const onAddAddress = async (
    payload: CreateAddressRequest
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await addAddress(payload);
      setAddresses((prev) => [res.data, ...prev]);

      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Thêm địa chỉ thất bại"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onUpdateAddress = async (
  addressId: string,
  payload: CreateAddressRequest
): Promise<boolean> => {
  try {
    setLoading(true);
    setError(null);

    const res = await updateAddress(addressId, payload);

    setAddresses((prev) =>
      prev.map((item) => {
        if (item._id === addressId) {
          return res.data;
        }

        if (payload.is_default === true && item.is_default) {
          return { ...item, is_default: false };
        }

        return item;
      })
    );

    return true;
  } catch (err: any) {
    setError(
      err?.response?.data?.message || "Cập nhật địa chỉ thất bại"
    );
    return false;
  } finally {
    setLoading(false);
  }
};


  const onDeleteAddress = async (
    addressId: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteAddress(addressId);
      setAddresses((prev) =>
        prev.filter((item) => item._id !== addressId)
      );

      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Xóa địa chỉ thất bại"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    onAddAddress,
    onUpdateAddress,
    onDeleteAddress,
  };
}
