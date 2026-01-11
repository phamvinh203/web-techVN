import api from "@/config/api";

// GET /banners - Lấy danh sách banner
export const getBanners = async () => {
    const response = await api.get("/banners");
    return response.data;
}

// GET /brands - Lấy danh sách brands
export const getBrands = async () => {
    const response = await api.get("/brands");
    return response.data;
}

// GET /categories - Lấy danh sách danh mục
export const getCategories = async () => {
    const response = await api.get("/categories");
    return response.data;
}