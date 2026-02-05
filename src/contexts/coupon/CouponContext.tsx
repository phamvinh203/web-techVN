import { createContext } from 'react';
import type { AvailableCoupon, AppliedCoupon } from '@/services/CouponService/couponTypes';

export interface CouponContextType {
  availableCoupons: AvailableCoupon[];
  appliedCoupon: AppliedCoupon | null;
  loading: boolean;
  error: string | null;

  fetchAvailableCoupons: () => Promise<void>;
  validateCoupon: (code: string) => Promise<{ valid: boolean; discount?: number; message?: string }>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  setAppliedCoupon: React.Dispatch<React.SetStateAction<AppliedCoupon | null>>;
}

export const CouponContext = createContext<CouponContextType | undefined>(undefined);
