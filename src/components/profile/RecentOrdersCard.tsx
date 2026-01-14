import UserSectionCard from "./UserSectionCard";


export default function RecentOrdersCard() {
  return (
    <UserSectionCard title="Đơn hàng gần đây" action="Xem tất cả">
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 bg-gray-200 rounded" />
        <div>
          <p className="text-sm font-medium">
            MacBook Air M2 2022
          </p>
          <p className="text-sm text-blue-600">
            26.990.000đ
          </p>
        </div>
      </div>
    </UserSectionCard>
  );
}
