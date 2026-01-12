import api from "@/config/api"
import type { ProductResponse, RelatedProductsResponse } from "./productTypes";
import type { ProductDetailResponse } from "./productDetailTypes";

// lấy tất cả sản phẩm
export const getProducts = async (): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>("/products?limit=50");
    return response.data;
}
// sản phẩm nổi bật
export const getFeaturedProducts = async (): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>("/products/featured/list");
    return response.data;
}

// sản phẩm mới nhất
export const getNewProducts = async (): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>("/products/new/list");
    return response.data;
}

// sản phẩm bán chạy nhất
export const getTopSellingProducts = async (): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>("/products/top-selling/list");
    return response.data;
}

// Response type cho related products


// sản phẩm liên quan /:id/related
export const getRelatedProducts = async (productId: string): Promise<RelatedProductsResponse> => {
    const response = await api.get<RelatedProductsResponse>(`/products/${productId}/related`);
    return response.data;
}


// lấy chi tiết sản phẩm theo id
export const getProductById = async (id: string): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>(`/products/${id}`);
    return response.data;
}

// Lấy chi tiết sản phẩm theo slug
export const getProductBySlug = async (slug: string): Promise<ProductDetailResponse> => {
    const response = await api.get<ProductDetailResponse>(`/products/slug/${slug}`);
    return response.data;
}

