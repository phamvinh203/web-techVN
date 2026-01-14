import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/home/HomePage';
import ProductPage from '@/pages/products/ProductPage';
import ProductDetailPage from '@/pages/products/ProductDetail';
import CartPage from '@/pages/cart/CartPage';
import UserPage from '@/pages/auth/UserPage';
import ProfileForm from '@/components/profile/ProfileForm';
import UserOrdersPage from '@/components/profile/UserOrdersPage';
import UserAddressPage from '@/components/profile/UserAddressPage';
import UserChangePassword from '@/components/profile/UserChangePassword';
import UserNotification from '@/components/profile/UserNotification';
// import UserOrdersPage from '@/pages/cart/UserCart';





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

      {/* user */}
      <Route path="/user" element={<UserPage />}>
        <Route path="account/profile" element={<ProfileForm />} />
        <Route path="orders" element={<UserOrdersPage />} />
        <Route path="address" element={<UserAddressPage />} />
        <Route path="account/password" element={<UserChangePassword />} />
        <Route path="notifications" element={<UserNotification />} />
      </Route>


      {/* 404 - TODO: Create NotFoundPage */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
