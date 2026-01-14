export type PaymentMethod = "COD" | "MOMO" | "VNPAY";


export interface CheckoutItem {
  cart_item_id: string;
  quantity: number;
}

export interface CheckoutRequest {
  shipping_address_id: string;
  items: CheckoutItem[];
  payment_method?: PaymentMethod;
  notes?: string;
}

/** Order item trả về */
export interface OrderItem {
  product_id: {
    _id: string;
    name: string;
    images: string[];
  };
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  order_code: string;
  items: OrderItem[];
  shipping_address: string;
  payment_method: string | {
    type: PaymentMethod;
    status: string;
  };
  order_status: string;
  total_amount: number;
  shipping_fee: number;
  final_amount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Response chuẩn */
export interface CheckoutResponse {
  message: string;
  data: Order;
}

/** Order trả về từ API */
export interface OrdersResponse {
  message: string;
  data: {
    orders: Order[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}


