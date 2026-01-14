import { useState } from "react";

// Mock data - thay thế bằng API thực tế
const mockOrders = [
  {
    _id: "507f1f77bcf86cd799439011",
    status: "pending",
    total: 26990000,
    createdAt: "2026-01-10",
    items: [
      { name: "MacBook Air M2 2022", quantity: 1, price: 26990000, image: "" },
    ],
  },
  {
    _id: "507f1f77bcf86cd799439012",
    status: "shipping",
    total: 15990000,
    createdAt: "2026-01-08",
    items: [
      { name: "iPhone 15 Pro Max", quantity: 1, price: 15990000, image: "" },
    ],
  },
  {
    _id: "507f1f77bcf86cd799439013",
    status: "delivered",
    total: 8990000,
    createdAt: "2026-01-05",
    items: [
      { name: "iPad Air 5", quantity: 1, price: 8990000, image: "" },
    ],
  },
  {
    _id: "507f1f77bcf86cd799439014",
    status: "cancelled",
    total: 4990000,
    createdAt: "2026-01-03",
    items: [
      { name: "AirPods Pro 2", quantity: 1, price: 4990000, image: "" },
    ],
  },
];

type OrderStatus = "all" | "pending" | "shipping" | "delivered" | "cancelled";

const statusTabs: { key: OrderStatus; label: string }[] = [
  { key: "all", label: "Tất cả đơn" },
  { key: "pending", label: "Đang xử lý" },
  { key: "shipping", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "cancelled", label: "Đã hủy" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  shipping: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  pending: "Đang xử lý",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const getOrderCode = (id: string) => {
  return id.slice(-8).toUpperCase();
};

export default function UserOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesStatus = activeTab === "all" || order.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      getOrderCode(order._id).includes(searchQuery.toUpperCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

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
            onClick={() => setActiveTab(tab.key)}
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
                  <span className="text-sm text-gray-500">
                    Mã đơn hàng:{" "}
                    <span className="font-medium text-gray-900">
                      #{getOrderCode(order._id)}
                    </span>
                  </span>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="text-sm text-gray-500">{order.createdAt}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[order.status]
                  }`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              {/* Order Items */}
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blue-600">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Order Footer */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <button className="text-blue-600 text-sm hover:underline">
                  Xem chi tiết
                </button>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Tổng tiền: </span>
                  <span className="font-semibold text-lg text-blue-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
