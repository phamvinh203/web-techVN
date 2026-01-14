import { useAddress } from "@/hooks/useAddress";
import UserSectionCard from "./UserSectionCard";
import type { Address } from "@/services/AddressService/addressTypes";


interface DefaultAddressCardProps {
  onEdit?: () => void;
}

export default function DefaultAddressCard({
  onEdit,
}: DefaultAddressCardProps) {
  const { addresses, loading } = useAddress();

  // Lấy địa chỉ mặc định
  const defaultAddress: Address | undefined = addresses.find(
    (addr) => addr.is_default
  );

  return (
    <UserSectionCard
      title="Địa chỉ mặc định"
      action="Chỉnh sửa"
      onAction={onEdit}
    >
      {loading ? (
        <p className="text-sm text-gray-500">Đang tải địa chỉ...</p>
      ) : !defaultAddress ? (
        <p className="text-sm text-gray-500">
          Bạn chưa thiết lập địa chỉ mặc định.
        </p>
      ) : (
        <div className="space-y-1">
          <p className="font-medium">{defaultAddress.full_name}</p>
          <p className="text-sm text-gray-600">
            {defaultAddress.phone}
          </p>
          <p className="text-sm text-gray-600">
            {defaultAddress.address}
            {defaultAddress.ward && `, ${defaultAddress.ward}`}
            {defaultAddress.district && `, ${defaultAddress.district}`}
            {defaultAddress.province && `, ${defaultAddress.province}`}
          </p>
        </div>
      )}
    </UserSectionCard>
  );
}
