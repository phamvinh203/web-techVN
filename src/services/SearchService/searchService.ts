import api from "@/config/api"
import type {
  SearchParams,
  FilterParams,
  SortParams,
  SuggestionParams,
  ProductListResponse,
  SuggestionResponse
} from './searchTypes';


// Search sản phẩm theo keyword
export const searchProducts = async (params: SearchParams): Promise<ProductListResponse> => {
  const { keyword, page = 1, limit = 10 } = params;

  const response = await api.get(`/search`, {
    params: { keyword, page, limit }
  });

  return response.data;
};

// Lọc sản phẩm theo brand/category slug và price
export const filterProducts = async (params: FilterParams): Promise<ProductListResponse> => {
  const response = await api.get(`/search/filter`, {
    params
  });

  return response.data;
};

// Sắp xếp sản phẩm
export const sortProducts = async (params: SortParams): Promise<ProductListResponse> => {
  const { sort = 'newest', page = 1, limit = 10 } = params;

  const response = await api.get(`/search/sort`, {
    params: { sort, page, limit }
  });

  return response.data;
};

// Lấy sản phẩm bán chạy nhất (Top selling)
export const getTopSellingProducts = async (page = 1, limit = 10): Promise<ProductListResponse> => {
  const response = await api.get(`/search/sort`, {
    params: { sort: 'best_seller', page, limit }
  });

  return response.data;
};

// Lấy gợi ý tìm kiếm
export const getSearchSuggestions = async (params: SuggestionParams): Promise<SuggestionResponse> => {
  const { keyword, limit = 5 } = params;

  const response = await api.get(`/search/suggestions`, {
    params: { keyword, limit }
  });

  return response.data;
};

// Kết hợp search + filter + sort (dùng cho trang /products)
export const advancedSearch = async (params: FilterParams & { sort?: string }): Promise<ProductListResponse> => {
  const response = await api.get(`/search/filter`, {
    params
  });

  return response.data;
};

