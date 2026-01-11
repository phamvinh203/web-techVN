import { Link } from "react-router-dom";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";

import Header from "@/components/layout/Header";
import ProductFilter from "@/components/product/ProductFilter";
import ProductSort from "@/components/product/ProductSort";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";

import { usePageType } from "@/hooks/usePageType";
import { useProductList } from "@/hooks/useProductslist";
import { useProductSort } from "@/hooks/useProductSort";

export default function ProductPage() {
  const { pageType, slug, searchQuery, pageTitle, breadcrumbLabel } = usePageType();

  const { sort, setSort } = useProductSort("best_seller");
  const {
    products,
    pagination,
    loading,
    error,
    page,
    filters,
    setPage,
    setFilters,
    clearFilters,

    categoryInfo,
    brandInfo,
  } = useProductList({
    pageType,
    slug,
    searchQuery,
    limit: 9,
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="w-full">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* ===== Breadcrumb ===== */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <span>›</span>
          <Link to="/products" className="hover:text-blue-600">
            Sản phẩm
          </Link>

          {pageType !== "all" && (
            <>
              <span>›</span>
              <span className="text-foreground font-medium">
                {pageType === "category" && categoryInfo
                  ? categoryInfo.name
                  : pageType === "brand" && brandInfo
                  ? brandInfo.name
                  : breadcrumbLabel}
              </span>
            </>
          )}
        </nav>

        {/* ===== Page Title ===== */}
        <h1 className="text-2xl font-bold mb-6">
          {pageType === "category" && categoryInfo
            ? categoryInfo.name
            : pageType === "brand" && brandInfo
            ? brandInfo.name
            : pageTitle}
        </h1>

        {/* ===== Error ===== */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-6">
          {/* ===== Sidebar Filter ===== */}
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <ProductFilter
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
              pageType={pageType}
              currentBrandSlug={pageType === "brand" ? slug : undefined}
              currentCategorySlug={pageType === "category" ? slug : undefined}
            />
          </aside>

          {/* ===== Main Content ===== */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-gray-50 rounded-lg p-4">
              <span className="text-sm text-muted-foreground">
                <strong className="text-foreground">
                  {pagination?.totalItems || 0}
                </strong>{" "}
                sáº£n pháº©m
              </span>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <ProductSort value={sort} onChange={setSort} />

                {/* View mode */}
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-none h-9 w-9"
                    onClick={() => setViewMode("grid")}
                    aria-label="Hiá»ƒn thá»‹ dáº¡ng lÆ°á»›i"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>

                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-none h-9 w-9"
                    onClick={() => setViewMode("list")}
                    aria-label="Hiá»ƒn thá»‹ dáº¡ng danh sÃ¡ch"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product List */}
            <ProductGrid
              products={products}
              loading={loading}
              viewMode={viewMode}
            />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}