export interface CategoryData {
    _id: string;
    name: string;
    slug: string;
    __v?: number;
}

export interface BrandData {
    _id: string;
    name: string;
    slug: string;
    logo: string;
    __v?: number;
}

export interface ProductSpecification {
    [key: string]: string;
}

export interface CategoryProduct {
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
    category_id: string;
    status: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface CategoryWithProductsData {
    category: CategoryData;
    products: CategoryProduct[];
}

export interface CategoryBySlugResponse {
    success: boolean;
    data: CategoryWithProductsData;
}
