import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { FilterParams } from "@/services/SearchService/searchTypes";
import type { BrandData, CategoryData } from "@/services/HomeService/homeTypes";
import { getBrands, getCategories } from "@/services/HomeService/homeService";
import type { PageType } from "@/hooks/usePageType";

interface ProductFilterProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  onClearFilters: () => void;
  pageType: PageType;
  currentBrandSlug?: string;
  currentCategorySlug?: string;
}


// Khoảng giá cố định
const PRICE_RANGES = [
  { label: "Dưới 10 triệu", min: 0, max: 10000000 },
  { label: "10 - 20 triệu", min: 10000000, max: 20000000 },
  { label: "20 - 30 triệu", min: 20000000, max: 30000000 },
  { label: "Trên 30 triệu", min: 30000000, max: undefined },
];

export default function ProductFilter({
  filters,
  onFilterChange,
  onClearFilters,
  pageType,
  currentBrandSlug,
  currentCategorySlug,
}: ProductFilterProps) {
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  // Collapse states
  const [showPrice, setShowPrice] = useState(true);
  const [showBrand, setShowBrand] = useState(true);
  const [showCategory, setShowCategory] = useState(true);

  // Local filter state
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    pageType === "brand" ? currentBrandSlug || null : null
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    pageType === "category" ? currentCategorySlug || null : null
  );

  // // Sync selected state khi route thay đổi
  // useEffect(() => {
  //   if (pageType === "brand") {
  //     setSelectedBrand(currentBrandSlug || null);
  //     setSelectedCategory(null);
  //   } else if (pageType === "category") {
  //     setSelectedCategory(currentCategorySlug || null);
  //     setSelectedBrand(null);
  //   } else {
  //     setSelectedBrand(null);
  //     setSelectedCategory(null);
  //   }
  // }, [pageType, currentBrandSlug, currentCategorySlug]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          getBrands(),
          getCategories(),
        ]);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Fetch filter data error:", error);
      }
    };
    fetchData();
  }, []);

  const handlePriceChange = (index: number) => {
    const newIndex = selectedPriceRange === index ? null : index;
    setSelectedPriceRange(newIndex);

    if (newIndex !== null) {
      const range = PRICE_RANGES[newIndex];
      onFilterChange({
        ...filters,
        minPrice: range.min,
        maxPrice: range.max,
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { minPrice: _min, maxPrice: _max, ...rest } = filters;
      onFilterChange(rest);
    }
  };

  const handleBrandChange = (brandSlug: string) => {
    const newBrand = selectedBrand === brandSlug ? null : brandSlug;
    setSelectedBrand(newBrand);
    onFilterChange({
      ...filters,
      brand: newBrand || undefined,
    });
  };

  const handleCategoryChange = (categorySlug: string) => {
    const newCategory = selectedCategory === categorySlug ? null : categorySlug;
    setSelectedCategory(newCategory);
    onFilterChange({
      ...filters,
      category: newCategory || undefined,
    });
  };

  const handleClear = () => {
    setSelectedPriceRange(null);
    setSelectedBrand(null);
    setSelectedCategory(null);
    onClearFilters();
  };

  const hasActiveFilters = selectedPriceRange !== null || 
    (pageType !== "brand" && selectedBrand) || 
    (pageType !== "category" && selectedCategory);

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Bộ lọc</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-sm text-blue-600 hover:underline"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Khoảng giá */}
      <div className="border-t pt-4">
        <button
          className="flex items-center justify-between w-full text-left font-medium"
          onClick={() => setShowPrice(!showPrice)}
        >
          Khoảng giá
          {showPrice ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {showPrice && (
          <div className="mt-3 space-y-2">
            {PRICE_RANGES.map((range, index) => (
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedPriceRange === index}
                  onChange={() => handlePriceChange(index)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Hãng sản xuất */}
      <div className="border-t pt-4">
        <button
          className="flex items-center justify-between w-full text-left font-medium"
          onClick={() => setShowBrand(!showBrand)}
        >
          Hãng sản xuất
          {showBrand ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {showBrand && (
          <div className="mt-3 flex flex-wrap gap-2">
            {brands.map((brand) => (
              <Button
                key={brand._id}
                variant={selectedBrand === brand.slug ? "default" : "outline"}
                size="sm"
                onClick={() => handleBrandChange(brand.slug)}
                className="text-xs"
              >
                {brand.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Loại sản phẩm */}
      <div className="border-t pt-4">
        <button
          className="flex items-center justify-between w-full text-left font-medium"
          onClick={() => setShowCategory(!showCategory)}
        >
          Loại sản phẩm
          {showCategory ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {showCategory && (
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category._id}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.slug)}
                className="text-xs"
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
