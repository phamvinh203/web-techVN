import { useState, useCallback } from "react";
import { CheckoutContext } from "./CheckoutContext";
import { checkoutService } from "@/services/CheckoutService/checkoutService";
import type { Address } from "@/services/AddressService/addressTypes";
import type { PaymentMethod, OrdersResponse } from "@/services/CheckoutService/checkoutTypes";
import type { CartItem } from "@/services/CartService/cartTypes";
import type { CheckoutStep } from "./CheckoutContext";

interface CheckoutProviderProps {
  children: React.ReactNode;
}

export const CheckoutProvider = ({ children }: CheckoutProviderProps) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [notes, setNotes] = useState("");
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<OrdersResponse | null>(null);

  const resetCheckout = useCallback(() => {
    setSelectedAddress(null);
    setSelectedItems([]);
    setPaymentMethod("COD");
    setNotes("");
    setCurrentStep("address");
    setError(null);
    setOrderResult(null);
  }, []);

  const handleCheckout = useCallback(async () => {
    if (!selectedAddress) {
      setError("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    if (selectedItems.length === 0) {
      setError("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        shipping_address_id: selectedAddress._id,
        items: selectedItems.map((item) => ({
          cart_item_id: item._id,
          quantity: item.quantity,
        })),
        payment_method: paymentMethod,
        notes: notes.trim() || undefined,
      };

      const response = await checkoutService.checkout(payload);
      setOrderResult(response.data);
      setCurrentStep("confirm");
    } catch (err: unknown) {
      const message = err instanceof Error
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || err.message
        : "Đặt hàng thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedAddress, selectedItems, paymentMethod, notes]);

  return (
    <CheckoutContext.Provider
      value={{
        selectedAddress,
        selectedItems,
        paymentMethod,
        notes,
        currentStep,
        loading,
        error,
        orderResult,
        setSelectedAddress,
        setSelectedItems,
        setPaymentMethod,
        setNotes,
        setCurrentStep,
        resetCheckout,
        handleCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
