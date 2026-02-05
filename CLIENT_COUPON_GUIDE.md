# Coupon System - Client Side Implementation

Hướng dẫn sử dụng hệ thống Coupon phía client.

## 📁 Cấu trúc File

```
src/
├── components/coupon/
│   ├── CouponInput.tsx           # Input nhập mã coupon
│   ├── CouponSummary.tsx         # Hiển thị coupon đã áp dụng
│   ├── AvailableCoupons.tsx      # Danh sách coupon khả dụng
│   └── index.ts                  # Export components
├── contexts/coupon/
│   ├── CouponContext.tsx         # Context interface
│   └── CouponProvider.tsx        # Context provider
├── hooks/
│   └── useCoupon.ts              # Custom hook
├── services/CouponService/
│   ├── couponTypes.ts            # Type definitions
│   └── couponService.ts          # API calls
└── pages/
    ├── cart/CartPage.tsx         # Đã tích hợp CouponInput & CouponSummary
    └── checkout/CheckoutPage.tsx # Đã tích hợp CouponSummary
```

## 🔧 Cách Sử Dụng

### 1. Components

#### CouponInput
Component nhập mã coupon vào giỏ hàng.

```tsx
import { CouponInput } from '@/components/coupon';

function CartPage() {
  return (
    <div>
      <CouponInput />
    </div>
  );
}
```

#### CouponSummary
Component hiển thị thông tin coupon đã áp dụng trong order summary.

```tsx
import { CouponSummary } from '@/components/coupon';

function OrderSummary() {
  return (
    <div>
      <CouponSummary />
    </div>
  );
}
```

#### AvailableCoupons
Component hiển thị danh sách coupon khả dụng cho user.

```tsx
import { AvailableCoupons } from '@/components/coupon';

function CouponList() {
  const handleSelectCoupon = (code: string) => {
    console.log('Selected coupon:', code);
  };

  return (
    <AvailableCoupons onSelectCoupon={handleSelectCoupon} />
  );
}
```

### 2. Hooks

#### useCoupon
Hook để truy cập coupon context.

```tsx
import { useCoupon } from '@/hooks/useCoupon';

function MyComponent() {
  const {
    availableCoupons,
    appliedCoupon,
    loading,
    error,
    fetchAvailableCoupons,
    validateCoupon,
    applyCoupon,
    removeCoupon,
    setAppliedCoupon,
  } = useCoupon();

  // Fetch danh sách coupon
  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  // Áp dụng coupon
  const handleApply = async () => {
    try {
      await applyCoupon('SALE20');
    } catch (error) {
      console.error('Failed to apply coupon');
    }
  };

  // Validate coupon
  const handleValidate = async () => {
    const result = await validateCoupon('SALE20');
    if (result.valid) {
      console.log('Discount:', result.discount);
    }
  };

  // Xóa coupon
  const handleRemove = async () => {
    await removeCoupon();
  };
}
```

### 3. Cart Context Integration

Coupon đã được tích hợp vào CartContext:

```tsx
import { useCart } from '@/hooks/useCart';

function CartPage() {
  const {
    cart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  // Áp dụng coupon vào cart
  const handleApplyCoupon = async (code: string) => {
    await applyCoupon(code);
  };

  // Xóa coupon khỏi cart
  const handleRemoveCoupon = async () => {
    await removeCoupon();
  };

  // Hiển thị discount
  const discount = cart?.discount_amount || 0;
  const appliedCoupon = cart?.applied_coupon;
}
```

## 🎨 UI Components

### CouponInput States

**1. Chưa áp dụng coupon:**
- Input field để nhập mã
- Button "Áp dụng"
- Mã tự động chuyển thành UPPERCASE
- Hiển thị loading state khi đang áp dụng

**2. Đã áp dụng coupon:**
- Hiển thị mã coupon đã áp dụng (màu xanh)
- Hiển thị số tiền giảm
- Button "Xóa" để bỏ coupon

### CouponSummary

Hiển thị ngắn gọn trong order summary:
- Icon coupon
- Mã coupon
- Số tiền giảm (màu đỏ, dấu trừ)

### AvailableCoupons

Hiển thị danh sách coupon:
- Code coupon (bold, blue)
- Loại discount (PERCENT, FIXED, FREESHIP)
- Giá trị discount
- Điều kiện áp dụng
- Thời hạn
- Số lượt dùng còn lại
- Trạng thái (có thể dùng/hết lượt)
- Button "Áp dụng mã" (optional)

## 📊 Type Definitions

### AppliedCoupon
```tsx
interface AppliedCoupon {
  coupon_id: string;
  code: string;
  type: 'PERCENT' | 'FIXED' | 'FREESHIP';
  value: number;
  discount_amount: number;
}
```

### AvailableCoupon
```tsx
interface AvailableCoupon {
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
  canUse: boolean;
  userUsageCount: number;
  remainingUsage: number;
}
```

## 🔌 API Integration

### Coupon Service

```typescript
// Validate coupon
const response = await validateCoupon({ code: 'SALE20' });

// Get available coupons
const response = await getAvailableCoupons();

// Apply coupon to cart
const response = await applyCoupon('SALE20');

// Remove coupon from cart
const response = await removeCoupon();
```

### Cart Service (Updated)

```typescript
// Apply coupon
const response = await applyCoupon('SALE20');

// Remove coupon
const response = await removeCoupon();
```

## 🎯 Use Cases

### 1. Cart Page
User có thể:
- Nhập mã coupon
- Xem coupon đã áp dụng
- Xóa coupon
- Xem tổng tiền sau khi giảm

### 2. Checkout Page
Hiển thị:
- Danh sách sản phẩm
- Phí vận chuyển
- Coupon discount (nếu có)
- Tổng thanh toán

### 3. Coupon Listing Page
Hiển thị:
- Danh sách coupon khả dụng
- Chi tiết từng coupon
- Nút áp dụng trực tiếp

## 🔔 Toast Notifications

Tất cả operations đều hiển thị toast notifications:
- ✅ Success: "Áp dụng mã giảm giá thành công"
- ❌ Error: "Mã coupon đã hết hạn"
- ℹ️ Info: "Đã xóa mã giảm giá"

## 🛡️ Error Handling

Components tự động handle errors và hiển thị:
- Toast notifications
- Error messages
- Loading states
- Disabled states khi cần

## 🚀 Best Practices

1. **LUÔN validate coupon** trên server (backend đã làm)
2. **KHÔNG tin client-side calculations** - chỉ dùng để display
3. **Fetch lại cart** sau khi apply/remove coupon để sync state
4. **Handle loading states** để prevent multiple concurrent requests
5. **Show clear feedback** với toast notifications

## 📝 Notes

- Coupon code tự động convert sang UPPERCASE
- Discount amount được tính trên backend
- Cart data được sync với server sau mỗi operation
- Applied coupon info được lưu trong cart state
- CouponProvider đã được wrap trong App.tsx

## 🧪 Testing

Test coupon functionality:
1. Tạo coupon trên backend (xem COUPONS_API.md)
2. Nhập mã coupon vào CartPage
3. Kiểm tra discount được áp dụng
4. Kiểm tra tổng thanh toán
5. Test remove coupon
6. Test với các loại coupon khác nhau (PERCENT, FIXED, FREESHIP)

## 🐛 Troubleshooting

**Coupon không được áp dụng:**
- Kiểm tra console logs
- Verify backend API endpoints
- Check cart state
- Verify authentication token

**Discount không hiển thị đúng:**
- Refresh cart data sau khi apply
- Check backend calculations
- Verify applied_coupon field in cart

**AvailableCoupons không hiển thị:**
- Check user authentication
- Verify API response
- Check if coupons are active
