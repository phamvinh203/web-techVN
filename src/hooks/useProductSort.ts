import { useSearchParams } from "react-router-dom";
import type { SortOption } from "@/services/SearchService/searchTypes";

export function useProductSort(defaultSort: SortOption = "best_seller") {
  const [searchParams, setSearchParams] = useSearchParams();

  // ===== sort = SOURCE OF TRUTH =====
  const sort =
    (searchParams.get("sort") as SortOption) || defaultSort;

  // ===== update sort =====
  const setSort = (value: SortOption) => {
    const newParams = new URLSearchParams(searchParams);

    newParams.set("sort", value);
    newParams.set("page", "1"); // reset page khi Ä‘á»•i sort

    setSearchParams(newParams);
  };

  return {
    sort,
    setSort,
  };
}