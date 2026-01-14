
export type OrderStatus =
  | "all"
  | "pending"
  | "shipping"
  | "delivered"
  | "cancelled";

export const statusTabs: { key: OrderStatus; label: string }[] = [
  { key: "all", label: "Tất cả đơn" },
  { key: "pending", label: "Đang xử lý" },
  { key: "shipping", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "cancelled", label: "Đã hủy" },
];

export const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  shipping: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export const statusLabels: Record<string, string> = {
  pending: "Đang xử lý",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};


export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatDateTime = (iso: string): string => {
  const d = new Date(iso);

  return (
    d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) +
    " " +
    d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};
