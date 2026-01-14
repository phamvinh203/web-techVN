import { createContext } from "react";
import type { Address } from "@/services/AddressService/addressTypes";
import type { PaymentMethod, OrdersResponse } from "@/services/CheckoutService/checkoutTypes";
import type { CartItem } from "@/services/CartService/cartTypes";

export type CheckoutStep = "address" | "payment" | "confirm";

export interface CheckoutContextType {
  // State
  selectedAddress: Address | null;
  selectedItems: CartItem[];
  paymentMethod: PaymentMethod;
  notes: string;
  currentStep: CheckoutStep;
  loading: boolean;
  error: string | null;
  orderResult: OrdersResponse | null;

  // Actions
  setSelectedAddress: (address: Address | null) => void;
  setSelectedItems: (items: CartItem[]) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setNotes: (notes: string) => void;
  setCurrentStep: (step: CheckoutStep) => void;
  resetCheckout: () => void;

  // Checkout action
  handleCheckout: () => Promise<void>;
}

export const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);
