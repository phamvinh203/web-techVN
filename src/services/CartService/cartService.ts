import api from "@/config/api";
import type {
  AddToCartPayload,
  AddToCartResponse,
  CartResponse,
  UpdateCartPayload,
  UpdateCartResponse,
  RemoveCartResponse,
  ClearCartResponse,
} from "./cartTypes";

/* =======================
   ADD TO CART
======================= */
export const addToCart = async (
  payload: AddToCartPayload
): Promise<AddToCartResponse> => {
  const response = await api.post<AddToCartResponse>("/cart/add", payload);
  return response.data;
};

/* =======================
   GET CART
======================= */
export const getCart = async (): Promise<CartResponse> => {
  const response = await api.get<CartResponse>("/cart");
  return response.data;
};

/* =======================
   UPDATE CART ITEM
======================= */
export const updateCartItem = async (
  payload: UpdateCartPayload
): Promise<UpdateCartResponse> => {
  const response = await api.put<UpdateCartResponse>(
    "/cart/update",
    payload
  );

  return response.data;
};

/* =======================
   REMOVE CART ITEM
======================= */
export const removeFromCart = async (
  productId: string
): Promise<RemoveCartResponse> => {
  const response = await api.delete<RemoveCartResponse>(
    `/cart/remove/${productId}`
  );

  return response.data;
};

/* =======================
   CLEAR CART
======================= */
export const clearCart = async (): Promise<ClearCartResponse> => {
  const response = await api.delete<ClearCartResponse>("/cart/clear");

  return response.data;
};

/* =======================
   APPLY COUPON
======================= */
export const applyCoupon = async (code: string): Promise<CartResponse> => {
  const response = await api.post<CartResponse>("/cart/apply-coupon", { code });
  return response.data;
};

/* =======================
   REMOVE COUPON
======================= */
export const removeCoupon = async (): Promise<CartResponse> => {
  const response = await api.delete<CartResponse>("/cart/coupon");
  return response.data;
};
