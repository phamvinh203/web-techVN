// services/ReviewService/reviewService.ts
import api from "@/config/api";
import type {
  CreateReviewPayload,
  CreateReviewResponse,
  GetProductReviewsResponse
} from "./reviewTypes";

export const reviewService = {
  /**
   * POST /reviews
   * User tạo review cho sản phẩm (phải login)
   */
  create: async (
    payload: CreateReviewPayload
  ): Promise<CreateReviewResponse> => {
    const res = await api.post("/reviews", payload);
    return res.data;
  },

  /**
   * GET /reviews/products/:id/reviews
   * Lấy tất cả review của một product (public)
   */
  getReviewsByProductId: async (
    productId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<GetProductReviewsResponse> => {
    const res = await api.get(
      `/reviews/products/${productId}/reviews`,
      { params }
    );
    return res.data;
  }
};
