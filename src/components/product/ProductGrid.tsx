import ProductCard from "./ProductCard";
import type { ProductData, SearchProduct } from "@/services/ProductService/productTypes";

interface ProductGridProps {
  products: ProductData[] | SearchProduct[];
  loading: boolean;
  viewMode: "grid" | "list";
}

export default function ProductGrid({
  products,
  loading,
  viewMode,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-muted-foreground">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-muted-foreground">
          Vui lòng thử lại với bộ lọc khác
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "flex flex-col gap-4"
      }
    >
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
