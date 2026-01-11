import { Link } from 'react-router';
import type { ProductData, SearchProduct } from '@/services/ProductService/productTypes';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ProductCardProps {
  product: ProductData | SearchProduct;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const {
    name,
    slug,
    price,
    thumbnail,
    brand_id,
    category_id,
  } = product;

  // Handle both ProductData and SearchProduct types
  const oldprice = 'oldprice' in product ? product.oldprice : 0;
  const images = 'images' in product ? product.images : [];
  const discountFromApi = 'discount' in product ? product.discount : 0;

  const discount = discountFromApi || (oldprice > 0 ? Math.round(((oldprice - price) / oldprice) * 100) : 0);
  const displayImage = images?.[0] || thumbnail;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow duration-300 flex">
        {/* Image Container */}
        <div className="relative w-48 flex-shrink-0 p-4">
          {discount > 0 && (
            <Badge variant="destructive" className="absolute top-3 left-3 z-10">
              -{discount}%
            </Badge>
          )}
          <Link to={`/product/${product._id}`} className="block aspect-square">
            <img
              alt={name}
              src={displayImage}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-center">

          <Link to={`/product/${product._id}`}>
            <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors mb-2">
              {name}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground mb-3">
            {brand_id?.name} • {category_id?.name}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(price)}
            </span>
            {oldprice > price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(oldprice)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative bg-gray-50 p-4">
        {/* Discount Badge */}
        {discount > 0 && (
          <Badge variant="destructive" className="absolute top-3 left-3 z-10">
            -{discount}%
          </Badge>
        )}

        <Link to={`/product/${slug}`} className="block aspect-square">
          <img
            alt={name}
            src={displayImage}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">

        {/* Product Name */}
        <Link to={`/product/${slug}`}>
          <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[48px] text-sm leading-6 hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Brand & Category */}
        <p className="text-xs text-muted-foreground">
          {brand_id?.name} • {category_id?.name}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(price)}
          </span>
          {oldprice > price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(oldprice)}
            </span>
          )}
        </div>

        
        <Button
          variant="outline"
          className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
        >
          Chọn Mua
        </Button>
      </div>
    </div>
  );
}
