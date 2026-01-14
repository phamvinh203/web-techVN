import { CheckoutContext } from "@/contexts/checkout/CheckoutContext";
import { useContext } from "react";

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
