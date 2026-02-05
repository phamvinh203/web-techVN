import { useContext } from 'react';
import { CouponContext } from '@/contexts/coupon/CouponContext';

export const useCoupon = () => {
  const context = useContext(CouponContext);

  if (context === undefined) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }

  return context;
};
