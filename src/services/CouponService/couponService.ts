import api from "@/config/api";
import type {
  ValidateCouponRequest,
  ValidateCouponResponse,
  AvailableCouponsResponse,
  ApplyCouponResponse,
  RemoveCouponResponse,
} from "./couponTypes";

/* =======================
   VALIDATE COUPON
======================= */
export const validateCoupon = async (
  payload: ValidateCouponRequest
): Promise<ValidateCouponResponse> => {
  const response = await api.post<ValidateCouponResponse>(
    "/coupons/validate",
    payload
  );
  return response.data;
};

/* =======================
   GET AVAILABLE COUPONS
======================= */
export const getAvailableCoupons =
  async (): Promise<AvailableCouponsResponse> => {
    const response = await api.get<AvailableCouponsResponse>(
      "/coupons/available"
    );
    return response.data;
  };

/* =======================
   APPLY COUPON TO CART
======================= */
export const applyCoupon = async (code: string): Promise<ApplyCouponResponse> => {
  const response = await api.post<ApplyCouponResponse>("/cart/apply-coupon", {
    code,
  });
  return response.data;
};

/* =======================
   REMOVE COUPON FROM CART
======================= */
export const removeCoupon = async (): Promise<RemoveCouponResponse> => {
  const response = await api.delete<RemoveCouponResponse>("/cart/coupon");
  return response.data;
};
