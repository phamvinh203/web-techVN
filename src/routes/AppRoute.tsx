import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/home/HomePage';
import ProductPage from '@/pages/products/ProductPage';
import ProductDetailPage from '@/pages/products/ProductDetail';



// import LoginPage from '@/pages/auth/LoginPage';
// import RegisterPage from '@/pages/auth/RegisterPage';

export default function AppRoute() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* All Products */}
      <Route path="/products" element={<ProductPage />} />

      {/* Product Detail */}
      <Route path="/product/:slug" element={<ProductDetailPage />} />

      {/* Search Results */}
      <Route path="/search" element={<ProductPage />} />

     
      
      {/* Auth - TODO: Implement auth pages */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="/register" element={<RegisterPage />} /> */}
      
      {/* 404 - TODO: Create NotFoundPage */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
