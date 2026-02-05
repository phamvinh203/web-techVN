import { useState, FormEvent } from 'react';
import { useCart } from '@/hooks/useCart';

interface CouponInputProps {
  className?: string;
}

export default function CouponInput({ className = '' }: CouponInputProps) {
  const { cart, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const hasAppliedCoupon = cart?.applied_coupon;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      return;
    }

    setLoading(true);
    try {
      await applyCoupon(code.trim().toUpperCase());
      setCode('');
    } catch (error) {
      // Error is handled in CartProvider
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeCoupon();
    } catch (error) {
      // Error is handled in CartProvider
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('vi-VN').format(value) + 'đ';

  if (hasAppliedCoupon) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-semibold text-green-800">
                Đã áp dụng mã: {hasAppliedCoupon.code}
              </span>
            </div>
            <p className="text-sm text-green-700">
              Giảm{' '}
              <span className="font-bold">
                {formatPrice(hasAppliedCoupon.discount_amount)}
              </span>
            </p>
          </div>
          <button
            onClick={handleRemove}
            disabled={loading}
            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="font-semibold text-gray-800 mb-3">Mã giảm giá</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Nhập mã giảm giá..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Đang áp dụng...' : 'Áp dụng'}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2">
        Nhập mã giảm giá để được ưu đãi
      </p>
    </div>
  );
}
