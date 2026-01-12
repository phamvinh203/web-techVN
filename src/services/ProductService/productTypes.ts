// ===== Common Types =====
export interface ProductBrand {
    _id: string;
    name: string;
    slug: string;
}

export interface ProductCategory {
    _id: string;
    name: string;
    slug?: string;
}

// ===== Base Product - Shared fields =====
export interface BaseProduct {
    _id: string;
    name: string;
    slug: string;
    price: number;
    thumbnail: string;           
    status: string;
    brand_id: ProductBrand;
    category_id: ProductCategory;
    createdAt: string;
    updatedAt: string;
    discount?: number;
}

export interface RelatedProductsResponse {
    message: string;
    data: ProductData[];
}

// ===== Full Product Data - Chi tiết đầy đủ =====
export interface ProductData extends BaseProduct {
    oldprice: number;            // Giá gốc (để tính discount)
    images: string[];            // Tất cả ảnh sản phẩm
    description: string;
    specification: string;
    buyturn: number;             // Số lượt mua
    quantity: number;            // Số lượng tồn kho
    deleted: boolean;
}

// ===== Search Product - Dữ liệu cho danh sách sản phẩm từ API filter =====
export interface SearchProduct {
    _id: string;
    name: string;
    slug: string;
    price: number;
    thumbnail: string;
    oldprice: number;
    images: string[];
    description: string;
    specification: Record<string, string>;
    buyturn: number;
    quantity: number;
    brand_id: ProductBrand;
    category_id: ProductCategory | string;
    status: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    discount?: number;
    __v?: number;
}

// ===== Pagination =====
export interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

// ===== Response Types =====
export interface ProductResponse {
    message: string;
    data: {
        products: ProductData[];
        pagination: Pagination;
    };
}

export interface SearchProductResponse {
    message: string;
    data: {
        products: SearchProduct[];
        pagination: Pagination;
    };
}

