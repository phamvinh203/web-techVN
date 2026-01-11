export interface BannerData {
    _id: string;
    title: string;
    imageUrl: string;
    link: string;
    position: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BannerResponse {
    success: boolean;
    data: BannerData[];
}

export interface BrandData {
    _id: string;
    name: string;
    slug: string;
    logo: string;
}

export interface BrandResponse {
    success: boolean;
    data: BrandData[];
}

export interface CategoryData {
    _id: string;
    name: string;
    slug: string;
}

export interface CategoryResponse {
    success: boolean;
    data: CategoryData[];
}
