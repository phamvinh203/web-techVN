// services/chat/chat.types.ts

/* =========================
 * CHAT MESSAGE (FRONTEND)
 * ========================= */

export type ChatRole = "user" | "bot";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/* =========================
 * PRODUCT (KHỚP MONGO)
 * ========================= */

export interface ChatProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  oldprice?: number;

  images: string[];

  description?: string;

  specification?: Record<string, any>;

  buyturn?: number;
  quantity?: number;

  brand_id?: {
    _id: string;
    name: string;
  };

  category_id?: string;

  status?: "active" | "inactive";
  deleted?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
 * CHAT DATA (data field)
 * ========================= */

export interface ChatData {
  reply: string;
  sessionId: string;
  historyLength: number;
  products?: ChatProduct[]; // Optional - chỉ có khi bot gợi ý sản phẩm
}

/* =========================
 * API RESPONSE
 * ========================= */

export interface ChatApiResponse {
  message: string;
  data: ChatData;
}
