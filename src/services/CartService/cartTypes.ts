// services/CartService/cartTypes.ts

/* ===== PRODUCT ===== */
export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  oldprice: number;
  images: string[];
  status: string;
  deleted: boolean;
}

/* ===== CART ITEM ===== */
export interface CartItem {
  _id: string;
  product: CartProduct;
  quantity: number;
  price: number;
  variant: Record<string, any>;
  subtotal: number;
}

/* ===== CART DATA ===== */
export interface CartData {
  items: CartItem[];
  total_items: number;
  total_amount: number;
  discount_amount?: number;
  applied_coupon?: {
    coupon_id: string;
    code: string;
    type: 'PERCENT' | 'FIXED' | 'FREESHIP';
    value: number;
    discount_amount: number;
  };
}

/* ===== API RESPONSES ===== */
export interface CartResponse {
  message: string;
  data: CartData;
}

/* ===== ADD TO CART ===== */
export interface AddToCartPayload {
  product_id: string;
  quantity: number;
}

/* Response khi add cart */
export interface AddToCartResponse {
  message: string;
  data: {
    _id: string;
    user_id: string;
    items: {
      product_id: string;
      quantity: number;
      price: number;
      _id: string;
      added_at: string;
    }[];
    createdAt: string;
    updatedAt: string;
  };
}

/* ===== UPDATE CART ITEM ===== */
export interface UpdateCartPayload {
  item_id: string;
  quantity: number;
}

export interface UpdateCartResponse {
  message: string;
  data: CartData;
}

/* ===== REMOVE CART ITEM ===== */
export interface RemoveCartResponse {
  message: string;
  data: CartData;
}

/* ===== CLEAR CART ===== */
export interface ClearCartResponse {
  message: string;
  data: null;
}
