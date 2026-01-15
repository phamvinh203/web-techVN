// hooks/review/useProductReviews.ts
import { useEffect, useState, useCallback } from "react";
import { reviewService } from "@/services/ReviewService/reviewService";
import type {
  Review,
  ReviewStats,
  GetProductReviewsResponse
} from "@/services/ReviewService/reviewTypes";

interface UseProductReviewsParams {
  productId: string;
  page?: number;
  limit?: number;
}

export const useProductReviews = ({
  productId,
  page = 1,
  limit = 10
}: UseProductReviewsParams) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [pagination, setPagination] =
    useState<GetProductReviewsResponse["pagination"] | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await reviewService.getReviewsByProductId(
        productId,
        { page, limit }
      );

      setReviews(res.reviews);
      setStats(res.stats);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Không thể tải đánh giá sản phẩm"
      );
    } finally {
      setLoading(false);
    }
  }, [productId, page, limit]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    stats,
    pagination,
    loading,
    error,
    refetch: fetchReviews
  };
};
