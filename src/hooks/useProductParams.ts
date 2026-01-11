import { useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { usePageType } from "./usePageType";

import type { FilterParams, SortOption } from "@/services/SearchService/searchTypes";

interface UseProductParamsOptions {
  defaultSort?: SortOption;
}

export function useProductParams(options?: UseProductParamsOptions) {
  const { defaultSort = "best_seller" } = options || {};

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ===== LẤY THÔNG TIN TRANG TỪ usePageType =====
  const { pageType, slug, searchQuery, pageTitle, breadcrumbLabel } = usePageType();

  // ===== READ PARAMS =====
  const page = Number(searchParams.get("page") || 1);
  const sort = (searchParams.get("sort") as SortOption) || defaultSort;

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

  // ===== ACTIONS =====
  const setPage = useCallback(
    (p: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", p.toString());
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const setSort = useCallback(
    (value: SortOption) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("sort", value);
      newParams.set("page", "1"); // Reset page khi đổi sort
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const setFilters = useCallback(
    (newFilters: FilterParams) => {
      // Nếu đang ở trang brand/category mà chọn brand/category khác → redirect
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

      newParams.set("page", "1"); // Reset page khi filter thay đổi
      setSearchParams(newParams);
    },
    [pageType, slug, searchParams, setSearchParams, navigate]
  );

  const clearFilters = useCallback(() => {
    const newParams = new URLSearchParams();

    // Giữ lại params theo pageType
    if (pageType === "brand" && slug) newParams.set("brand", slug);
    if (pageType === "category" && slug) newParams.set("category", slug);
    if (pageType === "search" && searchQuery) newParams.set("keyword", searchQuery);

    // Giữ lại sort hiện tại
    newParams.set("sort", sort);
    newParams.set("page", "1");

    setSearchParams(newParams);
  }, [pageType, slug, searchQuery, sort, setSearchParams]);

  return {
    // Page info (từ usePageType)
    pageType,
    slug,
    searchQuery,
    pageTitle,
    breadcrumbLabel,

    // URL Params
    page,
    sort,
    filters,

    // Actions
    setPage,
    setSort,
    setFilters,
    clearFilters,
  };
}