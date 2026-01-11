// ===== Product Detail Types =====

export interface ProductBrandDetail {
    _id: string;
    name: string;
    slug: string;
}

export interface ProductCategoryDetail {
    _id: string;
    name: string;
    slug: string;
}

export interface ProductSpecification {
    cpu?: string;
    ram?: string;
    storage?: string;
    screen?: string;
    gpu?: string;
    [key: string]: string | undefined;
}

export interface ProductDetail {
    _id: string;
    name: string;
    slug: string;
    price: number;
    oldprice: number;
    images: string[];
    description: string;
    specification: ProductSpecification;
    buyturn: number;
    quantity: number;
    brand_id: ProductBrandDetail;
    category_id: ProductCategoryDetail;
    status: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface ProductDetailResponse {
    message: string;
    data: ProductDetail;
}
