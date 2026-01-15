// components/product/ReviewSection.tsx
import { useState } from "react";
import { useProductReviews } from "@/hooks/useProductReviews";
import { useAuth } from "@/contexts/AuthContext";
import { reviewService } from "@/services/ReviewService/reviewService";
import { Star, User, MessageSquare, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const { user, isAuthenticated } = useAuth();
  const { reviews, stats, pagination, loading, error, refetch } = useProductReviews({
    productId,
    page: currentPage,
    limit,
  });

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Check if user has already reviewed
  const hasUserReviewed = user && reviews.some(
    (review) => review.user_id._id === user._id
  );

  /** ===== Handle submit review ===== */
  const handleSubmitReview = async () => {
    if (!isAuthenticated) return;
    if (rating === 0) {
      setSubmitError("Vui lòng chọn số sao đánh giá");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await reviewService.create({
        product_id: productId,
        rating,
        comment,
      });
      
      // Reset form
      setRating(0);
      setComment("");
      // Refetch reviews
      refetch();
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại!"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /** ===== Helper: format thời gian "x phút trước" ===== */
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 30) return `${days} ngày trước`;
    if (months < 12) return `${months} tháng trước`;
    return `${years} năm trước`;
  };

  /** ===== Rating summary from stats ===== */
  const averageRating = stats?.avgRating?.toFixed(1) || "0";
  const totalReviews = stats?.totalReviews || 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const renderStars = (ratingValue: number, size: "sm" | "md" = "sm") => {
    const sizeClass = size === "md" ? "w-5 h-5" : "w-4 h-4";
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= ratingValue
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderInteractiveStars = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 ${
              star <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {rating === 1 && "Rất tệ"}
          {rating === 2 && "Tệ"}
          {rating === 3 && "Bình thường"}
          {rating === 4 && "Tốt"}
          {rating === 5 && "Tuyệt vời"}
        </span>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-blue-600 mb-4">Đánh giá sản phẩm</h2>
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-blue-600 mb-4">Đánh giá sản phẩm</h2>
        <p className="text-red-500 text-center py-8">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-blue-600 mb-6">Đánh giá sản phẩm</h2>

      {/* Review Form */}
      <div className="mb-8 pb-6 border-b">
        {!isAuthenticated ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Vui lòng <span className="text-blue-600 font-medium">đăng nhập</span> để đánh giá sản phẩm
            </p>
          </div>
        ) : hasUserReviewed ? (
          <div className="text-center py-6 bg-green-50 rounded-lg border border-green-200">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-green-500" />
            <p className="text-green-700 font-medium">Bạn đã đánh giá sản phẩm này</p>
            <p className="text-sm text-green-600 mt-1">Cảm ơn bạn đã chia sẻ trải nghiệm!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Viết đánh giá của bạn</h3>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Đánh giá của bạn *</label>
              {renderInteractiveStars()}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Nhận xét</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>

            {submitError && (
              <p className="text-red-500 text-sm">{submitError}</p>
            )}

            <Button
              onClick={handleSubmitReview}
              disabled={submitting || rating === 0}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin h-4 w-4 rounded-full border-b-2 border-white" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Gửi đánh giá
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Chưa có đánh giá nào cho sản phẩm này</p>
          <p className="text-sm mt-1">Hãy là người đầu tiên đánh giá!</p>
        </div>
      ) : (
        <>
          {/* Rating Summary */}
          <div className="flex flex-col md:flex-row gap-8 mb-8 pb-6 border-b">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold">{averageRating}</div>
              {renderStars(Math.round(Number(averageRating)), "md")}
              <p className="text-sm text-gray-500 mt-1">
                {totalReviews} đánh giá
              </p>
            </div>

            <div className="flex-1 space-y-2">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-12 text-sm">{star} sao</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{
                        width: `${totalReviews ? (count / totalReviews) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-sm text-gray-500">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-6 last:border-b-0">
                <div className="flex justify-between mb-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                      {review.user_id?.avatar ? (
                        <img 
                          src={review.user_id.avatar} 
                          alt={review.user_id.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {review.user_id?.full_name || "Người dùng ẩn danh"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {review.comment && (
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                )}

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {review.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Review image ${i + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}

                {review.admin_reply?.content && (
                  <div className="ml-6 mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex gap-2 mb-1">
                      <span className="font-semibold text-blue-700 text-sm">
                        Phản hồi từ Shop
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(review.admin_reply.replied_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {review.admin_reply.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="text-sm text-gray-600">
                Trang {currentPage}/{pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === pagination.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
