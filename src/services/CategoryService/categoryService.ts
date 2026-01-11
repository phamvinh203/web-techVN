import api from "@/config/api";
import type { CategoryBySlugResponse } from "./categoryTypes";

export const getCategoryBySlug = async (slug: string): Promise<CategoryBySlugResponse> => {
    const response = await api.get<CategoryBySlugResponse>(`/categories/slug/${slug}`);
    return response.data;
}