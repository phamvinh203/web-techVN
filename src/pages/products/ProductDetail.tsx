import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug, getRelatedProducts } from '@/services/ProductService/productService';
import type { ProductDetail } from '@/services/ProductService/productDetailTypes';
import type { ProductData } from '@/services/ProductService/productTypes';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductSpecificationSection from '@/components/product/ProductSpecification';
import ProductDescription from '@/components/product/ProductDescription';
import ReviewSection from '@/components/reviews/Reviewsection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useProductReviews } from '@/hooks/useProductReviews';
import { Star } from 'lucide-react';
import ChatWidget from '@/components/chat/ChatWidget';


export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, loading: cartLoading } = useCart();

  // Fetch review stats
  const { stats: reviewStats } = useProductReviews({
    productId: product?._id || '',
    page: 1,
    limit: 1,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await getProductBySlug(slug);
        setProduct(response.data);
        
        // Fetch related products
        if (response.data._id) {
          try {
            const relatedResponse = await getRelatedProducts(response.data._id);
            setRelatedProducts(relatedResponse.data || []);
          } catch {
            console.log('No related products found');
          }
        }
        
      } catch (err) {
        setError('Không thể tải thông tin sản phẩm');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
  };

  const discount = product && product.oldprice > 0 
    ? Math.round(((product.oldprice - product.price) / product.oldprice) * 100) 
    : 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart({
        product_id: product._id,
        quantity: quantity,
      });
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onOpenAuth={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onOpenAuth={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-red-500 text-lg mb-4">{error || 'Không tìm thấy sản phẩm'}</p>
            <Link to="/products">
              <Button>Quay lại danh sách sản phẩm</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category_id.slug}`} className="hover:text-blue-600">
            {product.category_id.name}
          </Link>
          <span>/</span>
          <Link to={`/products?brand=${product.brand_id.slug}`} className="hover:text-blue-600">
            {product.brand_id.name}
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </nav>

        {/* Product Main Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
              discount={discount}
            />

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title & Brand */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link 
                    to={`/brand/${product.brand_id.slug}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {product.brand_id.name}
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link 
                    to={`/category/${product.category_id.slug}`}
                    className="text-sm text-gray-500 hover:text-blue-600"
                  >
                    {product.category_id.name}
                  </Link>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                
                {/* Star Rating Display */}
                {reviewStats && reviewStats.totalReviews > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(reviewStats.avgRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {reviewStats.avgRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({reviewStats.totalReviews} đánh giá)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-4">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.price)}
                </span>
                {product.oldprice > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.oldprice)}
                    </span>
                    <Badge variant="destructive">Tiết kiệm {formatPrice(product.oldprice - product.price)}</Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-4">
                {product.quantity > 0 ? (
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Còn hàng ({product.quantity} sản phẩm)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Hết hàng</span>
                )}
                {product.buyturn > 0 && (
                  <span className="text-gray-500 text-sm">Đã bán: {product.buyturn}</span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-[50px] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.quantity}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  size="lg"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={product.quantity === 0 || cartLoading}
                  onClick={handleAddToCart}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Button>
              </div>

              
            </div>
          </div>
        </div>

        {/* Product Detail Content */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          

          <aside className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 ">
              <h2 className="text-xl font-bold text-blue-600 mb-4">
                Mô tả sản phẩm
              </h2>

              <ProductDescription description={product.description} />
              
            </div>
          </aside>

          <section className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-blue-600 mb-4">
                Thông số kỹ thuật
              </h2>

              <ProductSpecificationSection
                specification={product.specification}
              />
            </div>
          </section>

        </div>

        {/* Review Section */}
        <div className="mt-8">
          <ReviewSection productId={product._id} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 5).map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>

      <ChatWidget />

      <Footer />
    </div>
  );
}