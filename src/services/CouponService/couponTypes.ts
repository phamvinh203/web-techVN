// services/CouponService/couponTypes.ts

/* ===== COUPON TYPES ===== */
export enum CouponType {
  PERCENT = 'PERCENT',
  FIXED = 'FIXED',
  FREESHIP = 'FREESHIP',
}

export enum CouponApplyTo {
  ALL = 'ALL',
  CATEGORY = 'CATEGORY',
  BRAND = 'BRAND',
  PRODUCT = 'PRODUCT',
}

/* ===== COUPON ===== */
export interface Coupon {
  _id: string;
  code: string;
  type: CouponType;
  value: number;
  min_order_value: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  per_user_limit: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  apply_to: CouponApplyTo;
  category_ids: Array<{ _id: string; name: string; slug: string }>;
  brand_ids: Array<{ _id: string; name: string }>;
  product_ids: Array<{ _id: string; name: string }>;
  excluded_product_ids: string[];
  stackable: boolean;
  created_by?: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

/* ===== APPLIED COUPON (in Cart/Order) ===== */
export interface AppliedCoupon {
  coupon_id: string;
  code: string;
  type: CouponType;
  value: number;
  discount_amount: number;
}

/* ===== AVAILABLE COUPON (with user usage info) ===== */
export interface AvailableCoupon extends Omit<Coupon, 'used_by'> {
  canUse: boolean;
  userUsageCount: number;
  remainingUsage: number;
}

/* ===== API REQUESTS ===== */
export interface ValidateCouponRequest {
  code: string;
}

/* ===== API RESPONSES ===== */

/* Validate Coupon Response */
export interface ValidateCouponResponse {
  message: string;
  data: {
    coupon: {
      _id: string;
      code: string;
      type: CouponType;
      value: number;
      min_order_value: number;
      max_discount?: number;
    };
    discountAmount: number;
  };
}

/* Get Available Coupons Response */
export interface AvailableCouponsResponse {
  message: string;
  data: AvailableCoupon[];
}

/* Apply Coupon Response */
export interface ApplyCouponResponse {
  message: string;
  data: {
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    finalAmount: number;
    coupon: AppliedCoupon;
  };
}

/* Remove Coupon Response */
export interface RemoveCouponResponse {
  message: string;
  data: {
    subtotal: number;
    discount_amount: number;
    shippingFee: number;
    finalAmount: number;
    applied_coupon: null;
  };
}

/* Cart Summary with Coupon */
export interface CartSummaryWithCoupon {
  total_items: number;
  total_amount: number;
  discount_amount: number;
  estimated_shipping: number;
  tax: number;
  grand_total: number;
  applied_coupon?: AppliedCoupon;
}
