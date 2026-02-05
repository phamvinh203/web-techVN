import { useState, useCallback, type ReactNode } from 'react';
import { CouponContext } from './CouponContext';
import {
  getAvailableCoupons,
  validateCoupon as validateCouponAPI,
  applyCoupon as applyCouponAPI,
  removeCoupon as removeCouponAPI,
} from '@/services/CouponService/couponService';
import type { AvailableCoupon, AppliedCoupon } from '@/services/CouponService/couponTypes';
import { toast } from 'react-toastify';

export const CouponProvider = ({ children }: { children: ReactNode }) => {
  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =======================
    FETCH AVAILABLE COUPONS
  ======================== */
  const fetchAvailableCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAvailableCoupons();
      setAvailableCoupons(response.data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Không thể tải danh sách mã giảm giá';
      setError(errorMessage);
      console.error('Error fetching available coupons:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =======================
    VALIDATE COUPON
  ======================== */
  const validateCoupon = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await validateCouponAPI({ code });
      return {
        valid: true,
        discount: response.data.discountAmount,
        message: response.data.message,
      };
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Mã giảm giá không hợp lệ';
      setError(errorMessage);
      return {
        valid: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /* =======================
    APPLY COUPON
  ======================== */
  const applyCoupon = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applyCouponAPI(code);
      setAppliedCoupon(response.data.coupon);
      toast.success(response.message || 'Áp dụng mã giảm giá thành công');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Không thể áp dụng mã giảm giá';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /* =======================
    REMOVE COUPON
  ======================== */
  const removeCouponHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await removeCouponAPI();
      setAppliedCoupon(null);
      toast.success(response.message || 'Đã xóa mã giảm giá');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Không thể xóa mã giảm giá';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CouponContext.Provider
      value={{
        availableCoupons,
        appliedCoupon,
        loading,
        error,
        fetchAvailableCoupons,
        validateCoupon,
        applyCoupon,
        removeCoupon: removeCouponHandler,
        setAppliedCoupon,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};
