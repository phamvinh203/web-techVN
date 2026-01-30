export type ChatRole = "user" | "bot";

export interface ProductLite {
  id?: string;
  _id?: string;
  name: string;
  images?: string[];
  slug?: string;
  status?: "active" | "inactive";
  deleted?: boolean;
}

// Superset type to keep compatibility with older product suggestion UI
export interface ChatProduct extends ProductLite {
  price: number;
  oldprice?: number;
  description?: string;
  specification?: Record<string, unknown>;
  buyturn?: number;
  quantity?: number;
  brand_id?: {
    _id: string;
    name: string;
  };
  category_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
  product?: ProductLite;
}

export interface ChatResponseData {
  reply: string;
  product: ProductLite | null;
  sessionId: string;
  historyLength?: number;
}

export interface ChatResponse {
  message: string;
  data: ChatResponseData;
}
