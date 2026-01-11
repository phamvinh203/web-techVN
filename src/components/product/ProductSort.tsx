import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import type { SortOption } from "@/services/SearchService/searchTypes";

interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function ProductSort({
  value,
  onChange,
}: ProductSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        Sắp xếp:
      </span>

      <NativeSelect
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="min-w-[150px]"
      >
        <NativeSelectOption value="best_seller">
          Bán chạy nhất
        </NativeSelectOption>
        <NativeSelectOption value="newest">
          Mới nhất
        </NativeSelectOption>
        <NativeSelectOption value="price_asc">
          Giá tăng dần
        </NativeSelectOption>
        <NativeSelectOption value="price_desc">
          Giá giảm dần
        </NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
