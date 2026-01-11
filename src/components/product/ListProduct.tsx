import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { SearchProduct, ProductBrand } from '@/services/ProductService/productTypes';
import { filterProducts } from '@/services/SearchService/searchService';

interface BrandGroup {
  brand: ProductBrand;
  products: SearchProduct[];
}

export default function ListProduct() {
  const [groupedProducts, setGroupedProducts] = useState<BrandGroup[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await filterProducts({ limit: 50 });
      const products = response.data.products;

      const brandMap: Record<string, BrandGroup> = {};

      for (const product of products) {
        const brandId = product.brand_id?._id;
        if (!brandId) continue;

        if (!brandMap[brandId]) {
          brandMap[brandId] = {
            brand: product.brand_id,
            products: [],
          };
        }
        brandMap[brandId].products.push(product);
      }

      const sortedGroups = Object.values(brandMap).sort((a, b) =>
        a.brand.name.localeCompare(b.brand.name)
      );

      setGroupedProducts(sortedGroups);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  if (loading) {
    return (
      <section className="w-full py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <p className="text-gray-500 text-sm">Đang tải sản phẩm...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (groupedProducts.length === 0) {
    return (
      <section className="w-full py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center py-20">
            <div className="text-gray-300 text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">Không có sản phẩm nào</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="space-y-12">
          {groupedProducts.map(({ brand, products }) => {
            const displayProducts = products.slice(0, 4);
            const hasMore = products.length > 4;

            return (
              <div key={brand.slug} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-900">{brand.name}</h2>
                    
                  </div>
                  
                  {hasMore && (
                    <Link
                      to={`/brand/${brand.slug}`}
                      className="group flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                      Xem thêm 
                      <ChevronRight 
                        size={18} 
                        className="group-hover:translate-x-1 transition-transform" 
                      />
                    </Link>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-blue-200 via-gray-200 to-transparent"></div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
