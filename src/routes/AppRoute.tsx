import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/home/HomePage';
import ProductPage from '@/pages/products/ProductPage';
import ProductDetailPage from '@/pages/products/ProductDetail';
import CartPage from '@/pages/cart/CartPage';




export default function AppRoute() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* All Products */}
      <Route path="/products" element={<ProductPage />} />

      {/* Product Detail */}
      <Route path="/product/:slug" element={<ProductDetailPage />} />

      {/* Cart */}
      <Route path="/cart" element={<CartPage />} />

      {/* Search Results */}
      <Route path="/search" element={<ProductPage />} />


      {/* 404 - TODO: Create NotFoundPage */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
