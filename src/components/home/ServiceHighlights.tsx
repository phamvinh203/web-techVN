import { BadgeCheck, Truck, Banknote } from 'lucide-react';

export default function ServiceHighlights() {
  const items = [
    {
      icon: BadgeCheck,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      title: "100% Chính hãng",
      description: "Bảo hành 12 tháng tại VN",
    },
    {
      icon: Truck,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      title: "Giao hàng hỏa tốc",
      description: "Nhận hàng trong 2h tại Hà Nội",
    },
    {
      icon: Banknote,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      title: "Giá tốt nhất",
      description: "Hoàn tiền nếu tìm thấy rẻ hơn",
    },
  ];

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white p-4"
            >
              <div
                className={`flex size-12 flex-shrink-0 items-center justify-center rounded-full ${item.iconBg} ${item.iconColor}`}
              >
                <item.icon size={24} />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}