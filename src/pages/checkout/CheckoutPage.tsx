import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCheckout } from "@/hooks/useCheckout";
import { useAddress } from "@/hooks/useAddress";
import { useCart } from "@/hooks/useCart";
import type { Address } from "@/services/AddressService/addressTypes";
import type { PaymentMethod } from "@/services/CheckoutService/checkoutTypes";
// import { toast } from "react-toastify";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addresses } = useAddress();
  const { cart, fetchCart } = useCart();

  const {
    selectedAddress,
    selectedItems,
    paymentMethod,
    notes,
    loading,
    error,
    orderResult,
    setSelectedAddress,
    setSelectedItems,
    setPaymentMethod,
    setNotes,
    handleCheckout,
    resetCheckout,
  } = useCheckout();

  // Get selected items from location state or use all cart items
  useEffect(() => {
    const stateItems = location.state?.selectedItems;
    if (stateItems && stateItems.length > 0) {
      setSelectedItems(stateItems);
    } else if (cart?.items) {
      setSelectedItems(cart.items);
    }

    // Set default address
    const defaultAddr = addresses.find((addr: Address) => addr.is_default);
    if (defaultAddr) {
      setSelectedAddress(defaultAddr);
    }
  }, [location.state, cart, addresses, setSelectedItems, setSelectedAddress]);

  // Refresh cart after successful checkout
  useEffect(() => {
    if (orderResult) {
      fetchCart();
      // toast.success(`Đặt hàng thành công! Mã đơn: #${orderResult.order_code}`);
    }
  }, [orderResult, fetchCart]);

  const FREE_SHIPPING_THRESHOLD = 5_000_000;
  const SHIPPING_FEE = 30_000;

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingFee =
    totalAmount >= FREE_SHIPPING_THRESHOLD
      ? 0
      : totalAmount > 0
      ? SHIPPING_FEE
      : 0;

  const total = totalAmount + shippingFee;


  const handlePlaceOrder = async () => {
    await handleCheckout();
  };

  // Success state after checkout
  if (orderResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Đặt hàng thành công!</h2>
          <p className="text-gray-600 mb-2">Cảm ơn bạn đã đặt hàng</p>
          <p className="text-sm text-gray-500 mb-6">Mã đơn hàng: <span className="font-medium">{orderResult.order_code}</span></p>
          <button
            onClick={() => {
              resetCheckout();
              navigate("/user/orders");
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Products */}
            <div className="bg-white rounded-lg p-4">
              <h2 className="font-semibold mb-4">Sản phẩm ({selectedItems.length})</h2>
              {selectedItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Không có sản phẩm nào</p>
              ) : (
                <div className="space-y-4">
                  {selectedItems.map((item) => (
                    <div key={item._id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <img
                        src={item.product.images[0] || "/placeholder.png"}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-gray-800 line-clamp-2">{item.product.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">
                          {item.price.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Địa chỉ giao hàng</h2>
                <button
                  onClick={() => navigate("/user/address")}
                  className="text-blue-600 text-sm hover:underline"
                >
                  + Thêm địa chỉ mới
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-3">Chưa có địa chỉ giao hàng</p>
                  <button
                    onClick={() => navigate("/user/address")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Thêm địa chỉ
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {addresses.map((addr: Address) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        selectedAddress?._id === addr._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">{addr.full_name}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-sm text-gray-600">{addr.phone}</span>
                        {addr.is_default && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {addr.address}, {addr.ward}, {addr.district}, {addr.province}
                      </p>

                      {selectedAddress?._id === addr._id && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Đã chọn
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-4">
              <h2 className="font-semibold mb-4">Phương thức thanh toán</h2>
              <div className="space-y-3">
                {(
                  [
                    { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
                    { value: "MOMO", label: "Ví MoMo" },
                    { value: "VNPAY", label: "VNPay" },
                  ] as const
                ).map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                      paymentMethod === method.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg p-4">
              <h2 className="font-semibold mb-4">Ghi chú</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú cho đơn hàng..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 sticky top-4">
              <h2 className="font-semibold mb-4">Thông tin đơn hàng</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính ({selectedItems.length} sản phẩm)</span>
                  <span className="font-medium">{totalAmount.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">{shippingFee.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="font-semibold text-blue-600 text-lg">
                    {total.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddress || selectedItems.length === 0 || loading}
                className={`w-full mt-4 py-3 rounded-lg font-medium transition ${
                  !selectedAddress || selectedItems.length === 0 || loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loading ? "Đang xử lý..." : "Đặt hàng"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
