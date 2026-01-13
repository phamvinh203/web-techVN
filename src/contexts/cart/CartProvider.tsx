import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CartContext } from './CartContext';
import type { CartData, AddToCartPayload, UpdateCartPayload } from '@/services/CartService/cartTypes';
import {
  addToCart as addToCartAPI,
  getCart as getCartAPI,
  removeFromCart,
  updateCartItem,
  clearCart as clearCartAPI
} from '@/services/CartService/cartService';
import { useAuth } from '../AuthContext';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const itemCount = cart?.total_items || 0;

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCartAPI();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (payload: AddToCartPayload) => {
    try {
      setLoading(true);
      await addToCartAPI(payload);
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (payload: UpdateCartPayload) => {
    try {
      const res = await updateCartItem(payload);
      setCart(res.data);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const res = await removeFromCart(productId);
      setCart(res.data);
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await clearCartAPI();
      setCart(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };


  useEffect(() => {
  if (isAuthenticated) {
    fetchCart();
  } else {
    setCart(null);
  }
}, [isAuthenticated]);


  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        
        addToCart,
        updateItem,
        removeItem,
        fetchCart,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
