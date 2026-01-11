import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { advancedSearch } from "@/services/SearchService/searchService";
import { getCategoryBySlug } from "@/services/CategoryService/categoryService";

import type { FilterParams, SortOption } from "@/services/SearchService/searchTypes";
import type { SearchProduct, Pagination } from "@/services/ProductService/productTypes";
import type { CategoryData } from "@/services/CategoryService/categoryTypes";
import type { BrandData } from "@/services/BrandService/brandTypes";

interface UseProductListOptions {
  pageType: "all" | "brand" | "category" | "search";
  slug?: string;
  searchQuery?: string;
  limit?: number;
}

export function useProductList({
  pageType,
  slug,
  searchQuery,
  limit = 9,
}: UseProductListOptions) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ===== DATA STATE =====
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryInfo, setCategoryInfo] = useState<CategoryData | null>(null);
  const [brandInfo, setBrandInfo] = useState<BrandData | null>(null);

  // ===== URL = SOURCE OF TRUTH =====
  const page = Number(searchParams.get("page") || 1);
  const sort = (searchParams.get("sort") || "best_seller") as SortOption;

  const filters = useMemo<FilterParams>(() => {
    return {
      brand: searchParams.get("brand") || undefined,
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
    };
  }, [searchParams]);

  // ===== FETCH PRODUCTS =====
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params: FilterParams & {
          page?: number;
          limit?: number;
          sort?: SortOption;
          keyword?: string;
        } = {
          ...filters,
          page,
          limit,
          sort,
        };

        if (pageType === "brand" && slug) params.brand = slug;
        if (pageType === "category" && slug) params.category = slug;
        if (pageType === "search" && searchQuery) params.keyword = searchQuery;

        const res = await advancedSearch(params);

        setProducts(res.data.products);
        setPagination(res.data.pagination);

        if (pageType === "brand" && res.data.products.length > 0) {
          const b = res.data.products[0].brand_id;
          setBrandInfo(b ? {
            _id: b._id,
            name: b.name,
            slug: b.slug,
            logo: b.logo || "",
          } : null);
        }
      } catch {
        setError("KhÃ´ng thá»ƒ táº£i sáº£n pháº©m");
        setProducts([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageType, slug, searchQuery, filters, page, sort, limit]);

  // ===== CATEGORY INFO (INFO ONLY) =====
  useEffect(() => {
    if (pageType === "category" && slug) {
      getCategoryBySlug(slug).then((res) => {
        if (res.success) {
          setCategoryInfo(res.data.category);
        }
      });
    }
  }, [pageType, slug]);

  // ===== ACTIONS =====
  const setSort = (value: SortOption) => {
  const newParams = new URLSearchParams(searchParams);

  newParams.set("sort", value);
  newParams.set("page", "1");

  setSearchParams(newParams);
};


  const setPage = (p: number) => {
  const newParams = new URLSearchParams(searchParams);

  newParams.set("page", p.toString());

  setSearchParams(newParams);
};


  const setFilters = (newFilters: FilterParams) => {
  if (
    (pageType === "brand" && newFilters.brand && newFilters.brand !== slug) ||
    (pageType === "category" && newFilters.category && newFilters.category !== slug)
  ) {
    const params = new URLSearchParams();
    if (newFilters.brand) params.set("brand", newFilters.brand);
    if (newFilters.category) params.set("category", newFilters.category);
    navigate(`/products?${params.toString()}`);
    return;
  }

  const newParams = new URLSearchParams(searchParams);

  Object.entries(newFilters).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") {
      newParams.delete(k);
    } else {
      newParams.set(k, String(v));
    }
  });

  newParams.set("page", "1");
  setSearchParams(newParams);
};


  const clearFilters = () => {
  const newParams = new URLSearchParams();

  if (pageType === "brand" && slug) newParams.set("brand", slug);
  if (pageType === "category" && slug) newParams.set("category", slug);
  if (pageType === "search" && searchQuery) newParams.set("keyword", searchQuery);

  newParams.set("sort", sort);
  newParams.set("page", "1");

  setSearchParams(newParams);
};


  return {
    products,
    pagination,
    loading,
    error,

    sort,
    page,
    filters,

    setSort,
    setPage,
    setFilters,
    clearFilters,

    categoryInfo,
    brandInfo,
  };
}