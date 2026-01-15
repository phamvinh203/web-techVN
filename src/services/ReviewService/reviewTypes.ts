// services/ReviewService/reviewTypes.ts

export interface ReviewUser {
  _id: string;
  full_name: string;
  avatar?: string;
}

export interface AdminReply {
  content: string;
  replied_at: string;
  admin_id: string;
}

export interface Review {
  _id: string;
  user_id: ReviewUser;
  product_id: string;
  rating: number;
  comment: string;
  images?: string[];
  is_hidden: boolean;
  admin_reply?: AdminReply;
  createdAt: string;
  updatedAt: string;
}

/** ===== CREATE REVIEW ===== */
export interface CreateReviewPayload {
  product_id: string;
  rating: number;
  comment: string;
}

export interface CreateReviewResponse {
  message: string;
  data: Review;
}

/** ===== REVIEW STATS ===== */
export interface ReviewStats {
  avgRating: number;
  totalReviews: number;
}

/** ===== GET REVIEWS BY PRODUCT ===== */
export interface GetProductReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}
