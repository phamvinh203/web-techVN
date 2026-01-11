export interface BrandData {
    _id: string;
    name: string;
    slug: string;
    logo: string;
    __v?: number;
}

export interface CategoryData {
    _id: string;
    name: string;
    slug: string;
}

export interface ProductSpecification {
    [key: string]: string;
}

export interface BrandProduct {
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
    brand_id: BrandData;
    category_id: CategoryData;
    status: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface BrandPagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export interface BrandWithProductsData {
    brand: BrandData;
    products: BrandProduct[];
    pagination: BrandPagination;
}

export interface BrandBySlugResponse {
    message: string;
    data: BrandWithProductsData;
}
