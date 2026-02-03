import { useEffect, useState, useRef, useCallback } from 'react';
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
  
  // Sử dụng ref để track cart state mới nhất (tránh race condition)
  const cartRef = useRef<CartData | null>(null);
  // Mutex lock để ngăn multiple concurrent addToCart
  const isAddingRef = useRef(false);

  // Sync cartRef với cart state
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  const itemCount = cart?.total_items || 0;

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await getCartAPI();
      setCart(response.data);
      cartRef.current = response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
      cartRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = useCallback(async (payload: AddToCartPayload) => {
    // Ngăn multiple concurrent requests (race condition)
    if (isAddingRef.current) {
      console.warn('Add to cart already in progress, please wait...');
      return;
    }

    try {
      isAddingRef.current = true;
      setLoading(true);

      // Sử dụng cartRef để lấy state mới nhất
      const currentCart = cartRef.current;
      const existingItem = currentCart?.items?.find(
        (item) => item.product?._id === payload.product_id
      );

      if (existingItem) {
        // Sản phẩm đã tồn tại → update quantity (merge)
        const newQuantity = existingItem.quantity + payload.quantity;
        
        // Optimistic update cho UI
        setCart((prevCart) => {
          if (!prevCart) return prevCart;
          return {
            ...prevCart,
            items: prevCart.items.map((item) =>
              item.product?._id === payload.product_id
                ? {
                    ...item,
                    quantity: newQuantity,
                    subtotal: newQuantity * item.price,
                  }
                : item
            ),
            total_items: prevCart.total_items + payload.quantity,
          };
        });

        await updateCartItem({
          item_id: existingItem._id,
          quantity: newQuantity,
        });
      } else {
        // Sản phẩm chưa tồn tại → thêm mới
        await addToCartAPI(payload);
      }

      // Fetch lại cart để sync với server
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Rollback: fetch lại cart từ server nếu có lỗi
      await fetchCart();
      throw error;
    } finally {
      setLoading(false);
      isAddingRef.current = false;
    }
  }, []);

  const updateItem = async (payload: UpdateCartPayload) => {
    try {
     await updateCartItem(payload);
      // setCart(res.data);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      // setCart(res.data);
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
        setCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
