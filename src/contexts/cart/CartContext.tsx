import { createContext } from 'react';
import type { CartData, AddToCartPayload, UpdateCartPayload } from '@/services/CartService/cartTypes';

export interface CartContextType {
  cart: CartData | null;
  loading: boolean;
  

  addToCart: (payload: AddToCartPayload) => Promise<void>;
  updateItem: (payload: UpdateCartPayload) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  fetchCart: () => Promise<void>;
  itemCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
