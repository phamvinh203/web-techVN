// Types cho Search Service
// Import shared types từ ProductService
import type { SearchProduct, Pagination } from '@/services/ProductService/productTypes';

// Re-export để sử dụng ở nơi khác
export type { SearchProduct, Pagination };

// ===== Sort Options =====
export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'best_seller';

// ===== Query Params =====

// Query params cho search
export interface SearchParams {
  keyword: string;
  page?: number;
  limit?: number;
}

// Query params cho filter
export interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  brand?: string;      // slug của brand
  category?: string;   // slug của category
  keyword?: string;
  page?: number;
  limit?: number;
}

// Query params cho sort
export interface SortParams {
  sort?: SortOption;
  page?: number;
  limit?: number;
}

// Query params cho suggestions (keyword required)
export interface SuggestionParams {
  keyword: string;  // Required - cần keyword để gợi ý
  limit?: number;
}

// ===== Response Types =====

// Response cho search, filter, sort
export interface ProductListResponse {
  message: string;
  data: {
    products: SearchProduct[];
    pagination: Pagination;
  };
}

// Suggestion item
export interface Suggestion {
  name: string;
  slug: string;        // Để tạo URL khi click vào suggestion
  popularity: number;
}

// Response cho suggestions
export interface SuggestionResponse {
  message: string;
  data: Suggestion[];
}