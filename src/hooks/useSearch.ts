import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSearchSuggestions } from "@/services/SearchService/searchService";
import type { SearchSuggestion } from "@/services/SearchService/searchTypes";

interface UseSearchOptions {
  debounceMs?: number;
  minChars?: number;
  limit?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 300,
    minChars = 2,
    limit = 5,
  } = options;

  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ===== FETCH SUGGESTIONS =====
  useEffect(() => {
    if (keyword.trim().length < minChars) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await getSearchSuggestions({
          keyword: keyword.trim(),
          limit,
        });

        setSuggestions(res.data || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [keyword, debounceMs, minChars, limit]);

  // ===== ACTIONS =====
  const handleInputChange = (value: string) => {
    setKeyword(value);
  };

  const handleSearch = () => {
    if (!keyword.trim()) return;
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(keyword.trim())}`);
  };

  const handleSelect = (item: SearchSuggestion) => {
    setShowSuggestions(false);
    setKeyword("");
    navigate(`/product/${item.slug}`);  
     
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setShowSuggestions(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return {
    keyword,
    suggestions,
    loading,
    showSuggestions,

    handleInputChange,
    handleSearch,
    handleSelect,
    handleKeyDown,
    handleBlur,
  };
}
