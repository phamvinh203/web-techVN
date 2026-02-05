import { useEffect, useState } from 'react';
import { useCoupon } from '@/hooks/useCoupon';
import { Button } from '@/components/ui/button';
import type { AvailableCoupon } from '@/services/CouponService/couponTypes';

interface AvailableCouponsProps {
  className?: string;
  onSelectCoupon?: (code: string) => void;
}

export default function AvailableCoupons({
  className = '',
  onSelectCoupon,
}: AvailableCouponsProps) {
  const { availableCoupons, loading, fetchAvailableCoupons } = useCoupon();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchAvailableCoupons();
  }, [fetchAvailableCoupons]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('vi-VN').format(value) + 'đ';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getCouponTypeLabel = (type: string) => {
    switch (type) {
      case 'PERCENT':
        return 'Giảm theo %';
      case 'FIXED':
        return 'Giảm tiền cố định';
      case 'FREESHIP':
        return 'Miễn phí vận chuyển';
      default:
        return type;
    }
  };

  const getDiscountText = (coupon: AvailableCoupon) => {
    if (coupon.type === 'PERCENT') {
      return `Giảm ${coupon.value}%${coupon.max_discount ? ` (tối đa ${formatPrice(coupon.max_discount)})` : ''}`;
    } else if (coupon.type === 'FIXED') {
      return `Giảm ${formatPrice(coupon.value)}`;
    } else {
      return 'Miễn phí vận chuyển';
    }
  };

  const displayedCoupons = showAll ? availableCoupons : availableCoupons.slice(0, 3);

  if (loading && availableCoupons.length === 0) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <h3 className="font-semibold text-gray-800 mb-3">Mã giảm giá có sẵn</h3>
        <div className="text-center text-gray-500 py-4">Đang tải...</div>
      </div>
    );
  }

  if (availableCoupons.length === 0) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <h3 className="font-semibold text-gray-800 mb-3">Mã giảm giá có sẵn</h3>
        <div className="text-center text-gray-500 py-4">
          Hiện không có mã giảm giá nào
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="font-semibold text-gray-800 mb-3">Mã giảm giá có sẵn</h3>
      <div className="space-y-3">
        {displayedCoupons.map((coupon) => (
          <div
            key={coupon._id}
            className={`border rounded-lg p-3 ${
              coupon.canUse
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-blue-600">
                    {coupon.code}
                  </span>
                  {!coupon.canUse && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Hết lượt dùng
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  {getDiscountText(coupon)}
                </p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {getCouponTypeLabel(coupon.type)}
              </span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                Đơn tối thiểu:{' '}
                {coupon.min_order_value > 0
                  ? formatPrice(coupon.min_order_value)
                  : 'Không'}
              </p>
              <p>
                Hết hạn vào {formatDate(coupon.end_date)} • Còn{' '}
                {coupon.remainingUsage} lượt dùng
              </p>
            </div>
            {coupon.canUse && onSelectCoupon && (
              <Button
                onClick={() => onSelectCoupon(coupon.code)}
                className="mt-2 w-full"
                size="sm"
              >
                Áp dụng mã
              </Button>
            )}
          </div>
        ))}
      </div>
      {availableCoupons.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {showAll ? 'Thu gọn' : `Xem tất cả (${availableCoupons.length})`}
        </button>
      )}
    </div>
  );
}
