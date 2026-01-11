import api from "@/config/api";
import type { BrandBySlugResponse } from "./brandTypes";

export const getBrandBySlug = async (slug: string): Promise<BrandBySlugResponse> => {
    const response = await api.get<BrandBySlugResponse>(`/products/brand/${slug}`);
    return response.data;
}
