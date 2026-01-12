import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type PageType = "brand" | "category" | "search" | "all";

interface UsePageTypeReturn {
  pageType: PageType;
  slug?: string;
  searchQuery?: string;
  pageTitle: string;
}

export function usePageType(): UsePageTypeReturn {
  const [searchParams] = useSearchParams();

  const brand = searchParams.get("brand") || undefined;
  const category = searchParams.get("category") || undefined;
  const searchQuery = searchParams.get("q") || undefined;

  // ===== Determine page type =====
  const pageType = useMemo<PageType>(() => {
    if (brand) return "brand";
    if (category) return "category";
    if (searchQuery) return "search";
    return "all";
  }, [brand, category, searchQuery]);

  // ===== slug dùng cho brand / category =====
  const slug = brand || category;

  // ===== Page title (fallback) =====
  const pageTitle = useMemo(() => {
    switch (pageType) {
      case "brand":
        return "Sản phẩm theo thương hiệu";
      case "category":
        return "Sản phẩm theo danh mục";
      case "search":
        return `Kết quả tìm kiếm: "${searchQuery}"`;
      default:
        return "Tất cả sản phẩm";
    }
  }, [pageType, searchQuery]);

  return {
    pageType,
    slug,
    searchQuery,
    pageTitle,
  };
}
