# Coupons System - API Documentation

Danh sách đầy đủ các file, API endpoints và cấu trúc request/response cho hệ thống Coupons/Voucher.

---

## 📁 Danh sách File

### Models
- [src/models/coupon.model.ts](src/models/coupon.model.ts) - Model Coupon với đầy đủ fields
- [src/models/coupon-redemption.model.ts](src/models/coupon-redemption.model.ts) - Model tracking coupon usage
- [src/models/cart.model.ts](src/models/cart.model.ts) - Đã thêm `applied_coupon` field
- [src/models/order.model.ts](src/models/order.model.ts) - Đã thêm `discount_amount` và `coupon` snapshot

### Controllers
- [src/controllers/coupons.controller.ts](src/controllers/coupons.controller.ts) - Admin CRUD + User operations
- [src/controllers/cart.controller.ts](src/controllers/cart.controller.ts) - Apply/Remove coupon endpoints
- [src/controllers/order.controller.ts](src/controllers/order.controller.ts) - Checkout với coupon validation

### Services
- [src/services/coupons.service.ts](src/services/coupons.service.ts) - Business logic (validate, calculate discount, redemption)

### Validators
- [src/validators/coupons.validator.ts](src/validators/coupons.validator.ts) - Zod validation schemas

### Routes
- [src/routes/coupons.route.ts](src/routes/coupons.route.ts) - Coupon endpoints
- [src/routes/cart.route.ts](src/routes/cart.route.ts) - Cart endpoints (apply/remove coupon)

### Types
- [src/types/cart.types.ts](src/types/cart.types.ts) - CartItem type definitions

---

## 🔌 API Endpoints

### ADMIN APIs

#### 1. Tạo Coupon Mới
**POST** `/api/coupons`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "code": "SALE20",
  "type": "PERCENT",
  "value": 20,
  "min_order_value": 500000,
  "max_discount": 200000,
  "usage_limit": 1000,
  "per_user_limit": 1,
  "start_date": "2026-02-01T00:00:00.000Z",
  "end_date": "2026-12-31T23:59:59.999Z",
  "is_active": true,
  "apply_to": "ALL",
  "category_ids": [],
  "brand_ids": [],
  "product_ids": [],
  "excluded_product_ids": [],
  "stackable": false
}
```

**Field Description:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | ✅ | Mã coupon (unique, uppercase) |
| `type` | enum | ✅ | PERCENT, FIXED, FREESHIP |
| `value` | number | ✅ | Giá trị giảm (%) hoặc (VND) |
| `min_order_value` | number | ❌ | Giá trị đơn tối thiểu (default: 0) |
| `max_discount` | number | ❌ | Trần giảm cho PERCENT (bắt buộc nếu type=PERCENT) |
| `usage_limit` | number | ❌ | Tổng số lần dùng (null = vô hạn) |
| `per_user_limit` | number | ❌ | Số lần dùng/user (default: 1) |
| `start_date` | Date | ✅ | Thời gian bắt đầu |
| `end_date` | Date | ✅ | Thời gian kết thúc |
| `is_active` | boolean | ❌ | Trạng thái (default: true) |
| `apply_to` | enum | ❌ | ALL, CATEGORY, BRAND, PRODUCT (default: ALL) |
| `category_ids` | string[] | ❌ | Danh sách category IDs |
| `brand_ids` | string[] | ❌ | Danh sách brand IDs |
| `product_ids` | string[] | ❌ | Danh sách product IDs |
| `excluded_product_ids` | string[] | ❌ | Products loại trừ |
| `stackable` | boolean | ❌ | Có dùng chung coupon khác không (default: false) |

**Response 201:**
```json
{
  "message": "Tạo coupon thành công",
  "data": {
    "_id": "67a1b2c3d4e5f6789abcdef0",
    "code": "SALE20",
    "type": "PERCENT",
    "value": 20,
    "min_order_value": 500000,
    "max_discount": 200000,
    "usage_limit": 1000,
    "used_count": 0,
    "per_user_limit": 1,
    "start_date": "2026-02-01T00:00:00.000Z",
    "end_date": "2026-12-31T23:59:59.999Z",
    "is_active": true,
    "apply_to": "ALL",
    "category_ids": [],
    "brand_ids": [],
    "product_ids": [],
    "excluded_product_ids": [],
    "stackable": false,
    "created_by": "67a1b2c3d4e5f6789abcdef1",
    "createdAt": "2026-02-05T10:30:00.000Z",
    "updatedAt": "2026-02-05T10:30:00.000Z"
  }
}
```

---

#### 2. Lấy Danh sách Coupons (Admin)
**GET** `/api/coupons/admin?page=1&limit=10&status=active&type=PERCENT&keyword=SALE`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Params:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `page` | number | ❌ | 1 | Trang hiện tại |
| `limit` | number | ❌ | 10 | Số items/trang |
| `status` | string | ❌ | all | active, inactive, all |
| `type` | enum | ❌ | - | PERCENT, FIXED, FREESHIP |
| `keyword` | string | ❌ | - | Tìm theo code |

**Response 200:**
```json
{
  "message": "Lấy danh sách coupons thành công",
  "data": {
    "coupons": [
      {
        "_id": "67a1b2c3d4e5f6789abcdef0",
        "code": "SALE20",
        "type": "PERCENT",
        "value": 20,
        "min_order_value": 500000,
        "max_discount": 200000,
        "usage_limit": 1000,
        "used_count": 50,
        "per_user_limit": 1,
        "start_date": "2026-02-01T00:00:00.000Z",
        "end_date": "2026-12-31T23:59:59.999Z",
        "is_active": true,
        "apply_to": "ALL",
        "stackable": false,
        "created_by": {
          "_id": "67a1b2c3d4e5f6789abcdef1",
          "email": "admin@example.com"
        },
        "createdAt": "2026-02-05T10:30:00.000Z",
        "updatedAt": "2026-02-05T10:30:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 50,
      "totalPages": 5,
      "currentPage": 1,
      "limit": 10
    }
  }
}
```

---

#### 3. Lấy Chi tiết Coupon
**GET** `/api/coupons/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response 200:**
```json
{
  "message": "Lấy chi tiết coupon thành công",
  "data": {
    "_id": "67a1b2c3d4e5f6789abcdef0",
    "code": "SALE20",
    "type": "PERCENT",
    "value": 20,
    "min_order_value": 500000,
    "max_discount": 200000,
    "usage_limit": 1000,
    "used_count": 50,
    "per_user_limit": 1,
    "used_by": ["67a1b2c3d4e5f6789abcd100", "67a1b2c3d4e5f6789abcd101"],
    "start_date": "2026-02-01T00:00:00.000Z",
    "end_date": "2026-12-31T23:59:59.999Z",
    "is_active": true,
    "apply_to": "CATEGORY",
    "category_ids": [
      {
        "_id": "67a1b2c3d4e5f6789cat001",
        "name": "Electronics",
        "slug": "electronics"
      }
    ],
    "brand_ids": [],
    "product_ids": [],
    "excluded_product_ids": [],
    "stackable": false,
    "created_by": {
      "_id": "67a1b2c3d4e5f6789abcdef1",
      "email": "admin@example.com"
    },
    "createdAt": "2026-02-05T10:30:00.000Z",
    "updatedAt": "2026-02-05T10:30:00.000Z"
  }
}
```

---

#### 4. Cập nhật Coupon
**PATCH** `/api/coupons/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:** (Tất cả fields đều optional)
```json
{
  "code": "NEWSALE30",
  "value": 30,
  "max_discount": 300000,
  "is_active": false
}
```

**Response 200:**
```json
{
  "message": "Cập nhật coupon thành công",
  "data": {
    "_id": "67a1b2c3d4e5f6789abcdef0",
    "code": "NEWSALE30",
    "value": 30,
    "is_active": false,
    "updatedAt": "2026-02-05T11:00:00.000Z"
  }
}
```

---

#### 5. Xóa Coupon (Soft Delete)
**DELETE** `/api/coupons/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response 200:**
```json
{
  "message": "Xóa coupon thành công",
  "data": {
    "_id": "67a1b2c3d4e5f6789abcdef0",
    "code": "SALE20",
    "is_active": false
  }
}
```

---

### USER APIs

#### 6. Lấy Coupons Khả Dụng
**GET** `/api/coupons/available`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response 200:**
```json
{
  "message": "Lấy danh sách coupons khả dụng thành công",
  "data": [
    {
      "_id": "67a1b2c3d4e5f6789abcdef0",
      "code": "SALE20",
      "type": "PERCENT",
      "value": 20,
      "min_order_value": 500000,
      "max_discount": 200000,
      "start_date": "2026-02-01T00:00:00.000Z",
      "end_date": "2026-12-31T23:59:59.999Z",
      "is_active": true,
      "apply_to": "ALL",
      "per_user_limit": 1,
      "canUse": true,
      "userUsageCount": 0,
      "remainingUsage": 950
    }
  ]
}
```

---

#### 7. Validate Coupon
**POST** `/api/coupons/validate`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "code": "SALE20"
}
```

**Response 200 (Coupon hợp lệ):**
```json
{
  "message": "Mã coupon hợp lệ",
  "data": {
    "coupon": {
      "_id": "67a1b2c3d4e5f6789abcdef0",
      "code": "SALE20",
      "type": "PERCENT",
      "value": 20,
      "min_order_value": 500000,
      "max_discount": 200000
    },
    "discountAmount": 100000
  }
}
```

**Response 400 (Coupon không hợp lệ):**
```json
{
  "message": "Mã coupon đã hết hạn"
}
```

---

### CART APIs

#### 8. Áp dụng Coupon vào Cart
**POST** `/api/cart/apply-coupon`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "code": "SALE20"
}
```

**Response 200:**
```json
{
  "message": "Áp dụng coupon thành công",
  "data": {
    "subtotal": 1000000,
    "discountAmount": 100000,
    "shippingFee": 0,
    "finalAmount": 900000,
    "coupon": {
      "couponId": "67a1b2c3d4e5f6789abcdef0",
      "code": "SALE20",
      "type": "PERCENT",
      "value": 20,
      "discountAmount": 100000
    }
  }
}
```

---

#### 9. Xóa Coupon khỏi Cart
**DELETE** `/api/cart/coupon`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response 200:**
```json
{
  "message": "Xóa coupon thành công",
  "data": {
    "subtotal": 1000000,
    "discount_amount": 0,
    "shippingFee": 30000,
    "finalAmount": 1030000,
    "applied_coupon": null
  }
}
```

---

#### 10. Cart Summary (Updated với Coupon)
**GET** `/api/cart/summary`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response 200:**
```json
{
  "message": "Lấy tổng tiền giỏ hàng thành công",
  "data": {
    "total_items": 3,
    "total_amount": 1000000,
    "discount_amount": 100000,
    "estimated_shipping": 0,
    "tax": 0,
    "grand_total": 900000,
    "applied_coupon": {
      "coupon_id": "67a1b2c3d4e5f6789abcdef0",
      "code": "SALE20",
      "type": "PERCENT",
      "value": 20,
      "discount_amount": 100000
    }
  }
}
```

---

## 💡 Công thức Tính Discount

### PERCENT
```
discount = min(
  subtotal_eligible × value / 100,
  max_discount (nếu có)
)
```

**Ví dụ:**
- Subtotal eligible: 1.000.000đ
- Value: 20%
- Max discount: 200.000đ
- Discount = min(1.000.000 × 0.2, 200.000) = **200.000đ**

### FIXED
```
discount = min(value, subtotal_eligible)
```

**Ví dụ:**
- Value: 100.000đ
- Subtotal eligible: 1.000.000đ
- Discount = min(100.000, 1.000.000) = **100.000đ**

### FREESHIP
```
discount = shipping_fee
```

**Ví dụ:**
- Shipping fee: 30.000đ
- Discount = **30.000đ**

---

## 🔒 Validation Rules

Backend sẽ validate coupon theo thứ tự:

1. ✅ Coupon tồn tại
2. ✅ `is_active === true`
3. ✅ `start_date <= now <= end_date`
4. ✅ `used_count < usage_limit` (nếu có)
5. ✅ User chưa vượt `per_user_limit`
6. ✅ `subtotal_eligible >= min_order_value`
7. ✅ Có sản phẩm đủ điều kiện (theo `apply_to`)
8. ✅ Tính discount chính xác

---

## 📦 Order Snapshot

Khi checkout thành công, Order sẽ chứa:

```json
{
  "_id": "67a1b2c3d4e5f6789ord0001",
  "order_code": "ORD20260205123456",
  "items": [...],
  "total_amount": 1000000,
  "shipping_fee": 0,
  "discount_amount": 100000,
  "coupon": {
    "coupon_id": "67a1b2c3d4e5f6789abcdef0",
    "code": "SALE20",
    "type": "PERCENT",
    "value": 20,
    "discount_amount": 100000
  },
  "final_amount": 900000,
  "order_status": "pending"
}
```

---

## 🔄 Rollback khi Hủy Đơn

Khi order bị hủy (bởi user hoặc admin):
- Restore stock
- Rollback coupon usage (trừ `used_count`)
- Xóa `CouponRedemption` record

---

## 🚀 Quick Test Commands

### Tạo coupon (Admin)
```bash
curl -X POST http://localhost:3000/api/coupons \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST20",
    "type": "PERCENT",
    "value": 20,
    "min_order_value": 0,
    "max_discount": 500000,
    "start_date": "2026-02-01T00:00:00.000Z",
    "end_date": "2026-12-31T23:59:59.999Z"
  }'
```

### Áp dụng coupon
```bash
curl -X POST http://localhost:3000/api/cart/apply-coupon \
  -H "Authorization: Bearer {user_token}" \
  -H "Content-Type: application/json" \
  -d '{"code": "TEST20"}'
```

### Xóa coupon
```bash
curl -X DELETE http://localhost:3000/api/cart/coupon \
  -H "Authorization: Bearer {user_token}"
```

---

## 📝 Notes

- Tất cả monetary values đều ở VND (Vietnam Dong)
- Coupon code sẽ tự động convert sang UPPERCASE
- MongoDB transaction được dùng trong checkout để đảm bảo tính toàn vẹn
- Coupon validation được thực hiện lại ở checkout (KHÔNG tin client)
- Order lưu snapshot coupon để tránh bị ảnh hưởng khi coupon thay đổi sau này
