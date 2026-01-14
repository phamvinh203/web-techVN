
import api from "@/config/api";
import type {
  CheckoutRequest,
  CheckoutResponse,
  OrdersResponse
} from "./checkoutTypes";

/** Checkout */
export const checkoutService = {
  checkout: async (
    payload: CheckoutRequest
  ): Promise<CheckoutResponse> => {
    const res = await api.post("/orders/checkout", payload);
    return res.data;
  }
};

// danh sách đơn mua của user
export const getUserOrders = async (
  page = 1,
  limit = 10,
  status?: string
): Promise<OrdersResponse> => {
  const res = await api.get("/orders/me", {
    params: { page, limit, status },
  });
  return res.data;
};
