import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders, cancelOrder } from "@/services/CheckoutService/checkoutService";
import type { Order, OrderItem } from "@/services/CheckoutService/checkoutTypes";
import Pagination from "@/components/common/Pagination";
import { formatDateTime, formatPrice, statusColors, statusLabels, statusTabs, type OrderStatus } from "@/utils/orderUtils";
import { toast } from "react-toastify";

const CANCEL_REASONS = [
  "Đặt nhầm sản phẩm",
  "Muốn thay đổi địa chỉ giao hàng",
  "Muốn thay đổi phương thức thanh toán",
  "Tìm được giá rẻ hơn ở nơi khác",
  "Không còn nhu cầu mua nữa",
  "Khác"
];

export default function UserOrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Cancel dialog state
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const status = activeTab === "all" ? undefined : activeTab;
        const response = await getUserOrders(currentPage, limit, status);
        setOrders(response.data.orders);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, activeTab]);

  const handleTabChange = (tab: OrderStatus) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredOrders = orders.filter((order) => {
    if (searchQuery === "") return true;
    const matchesSearch =
      order.order_code.toUpperCase().includes(searchQuery.toUpperCase()) ||
      order.items.some((item: OrderItem) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  const getItemImage = (item: OrderItem): string => {
    if (item.product_id?.images && item.product_id.images.length > 0) {
      return item.product_id.images[0];
    }
    return "";
  };

  const openCancelDialog = (orderId: string) => {
    setCancellingOrderId(orderId);
    setSelectedReason("");
    setCustomReason("");
    setShowCancelDialog(true);
  };

  const closeCancelDialog = () => {
    setShowCancelDialog(false);
    setCancellingOrderId(null);
    setSelectedReason("");
    setCustomReason("");
  };

  const handleConfirmCancel = async () => {
    if (!cancellingOrderId) return;
    
    const reason = selectedReason === "Khác" ? customReason : selectedReason;
    if (!reason.trim()) {
      toast.error("Vui lòng chọn hoặc nhập lý do hủy đơn");
      return;
    }

    setCancelling(true);
    try {
      await cancelOrder(cancellingOrderId, reason);
      // Refresh orders list after successful cancellation
      const status = activeTab === "all" ? undefined : activeTab;
      const response = await getUserOrders(currentPage, limit, status);
      setOrders(response.data.orders);
      setTotalPages(response.data.pagination.totalPages);
      closeCancelDialog();
      toast.success("Đã hủy đơn hàng thành công!");
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error("Hủy đơn hàng thất bại. Vui lòng thử lại.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Quản lý đơn hàng</h2>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Tìm theo mã đơn hàng hoặc tên sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          Tìm kiếm
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 transition ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          Đang tải đơn hàng...
        </div>
      ) : (
        <>
          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không có đơn hàng nào
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-center mb-3 pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        Đơn hàng #{order.order_code}
                      </span>
                      <span className="text-gray-500">
                        Đặt ngày: {formatDateTime(order.createdAt)}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.order_status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[order.order_status] || order.order_status}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded border bg-gray-50 flex-shrink-0">
                          <img
                            src={getItemImage(item)}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            x{item.quantity}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right font-medium text-gray-900">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="text-sm text-gray-600">
                      Tổng tiền ({order.items.length} sản phẩm):
                      <span className="ml-2 font-semibold text-blue-600 text-base">
                        {formatPrice(order.final_amount)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {order.order_status === "pending" && (
                        <button 
                          onClick={() => openCancelDialog(order._id)}
                          className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                        >
                          Hủy đơn hàng
                        </button>
                      )}

                      {order.order_status === "shipping" && (
                        <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
                          Theo dõi đơn
                        </button>
                      )}

                      {order.order_status === "delivered" && (
                        <button
                          className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg cursor-pointer opacity-70"
                        >
                          Đã nhận được hàng
                        </button>
                      )}

                      {order.order_status === "cancelled" && order.items.length > 0 && (
                        <button 
                          onClick={() => navigate(`/product/${order.items[0].product_id.slug}`)}
                          className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600"
                        >
                          Mua lại
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Cancel Order Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Hủy đơn hàng</h3>
            <p className="text-sm text-gray-600 mb-4">
              Vui lòng chọn lý do hủy đơn hàng:
            </p>

            {/* Reason Options */}
            <div className="space-y-2 mb-4">
              {CANCEL_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                    selectedReason === reason
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>

            {/* Custom Reason Input */}
            {selectedReason === "Khác" && (
              <div className="mb-4">
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Nhập lý do hủy đơn..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeCancelDialog}
                disabled={cancelling}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelling || !selectedReason || (selectedReason === "Khác" && !customReason.trim())}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? "Đang xử lý..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

