import { useEffect, useState } from "react";
import UserSectionCard from "./UserSectionCard";
import { getUserOrders } from "@/services/CheckoutService/checkoutService";
import type { Order } from "@/services/CheckoutService/checkoutTypes";
import { formatPrice, formatDateTime, statusLabels } from "@/utils/orderUtils";

export default function RecentOrdersCard() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecentOrder = async () => {
      setLoading(true);
      try {
        // Lấy 1 đơn gần nhất
        const res = await getUserOrders(1, 1);
        const latestOrder = res.data.orders?.[0] || null;
        setOrder(latestOrder);
      } catch (error) {
        console.error("Failed to fetch recent order", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrder();
  }, []);

  // Không có đơn
  if (!order && !loading) {
    return (
      <UserSectionCard title="Đơn hàng gần đây">
        <p className="text-sm text-gray-500">Chưa có đơn hàng nào</p>
      </UserSectionCard>
    );
  }

  // Loading
  if (loading) {
    return (
      <UserSectionCard title="Đơn hàng gần đây">
        <p className="text-sm text-gray-500">Đang tải...</p>
      </UserSectionCard>
    );
  }

  const firstItem = order!.items[0];
  const image =
    firstItem.product_id?.images?.[0] || "";

  return (
    <UserSectionCard title="Đơn hàng gần đây" action="Xem tất cả">
      <div className="flex items-center gap-3">
        {/* Image */}
        <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={firstItem.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 line-clamp-1">
            {firstItem.name}
          </p>

          <p className="text-xs text-gray-500">
            {formatDateTime(order!.createdAt)} ·{" "}
            {statusLabels[order!.order_status]}
          </p>
        </div>

        {/* Price */}
        <div className="text-sm font-semibold text-blue-600">
          {formatPrice(order!.final_amount)}
        </div>
      </div>
    </UserSectionCard>
  );
}
