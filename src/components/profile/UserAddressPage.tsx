import { useState } from "react";
import { useAddress } from "@/hooks/useAddress";
import type { Address } from "@/services/AddressService/addressTypes";
import { toast } from "react-toastify";

export default function UserAddressPage() {
  const {
    addresses,
    loading,
    error,
    onAddAddress,
    onDeleteAddress,
    onUpdateAddress,
  } = useAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setProvince("");
    setDistrict("");
    setWard("");
    setAddress("");
    setIsDefault(false);
    setEditingId(null);
  };

  const handleOpenForm = (addr?: Address) => {
    if (addr) {
      setFullName(addr.full_name);
      setPhone(addr.phone);
      setProvince(addr.province || "");
      setDistrict(addr.district || "");
      setWard(addr.ward || "");
      setAddress(addr.address);
      setIsDefault(addr.is_default);
      setEditingId(addr._id);
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSaveAddress = async () => {
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !province.trim() ||
      !district.trim() ||
      !address.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const payload = {
      full_name: fullName,
      phone,
      province,
      district,
      ward,
      address,
      is_default: isDefault,
    };

    let success = false;

    if (editingId) {
      success = await onUpdateAddress(editingId, payload);
      if (success) toast.success("Cập nhật địa chỉ thành công");
    } else {
      success = await onAddAddress(payload);
      if (success) toast.success("Thêm địa chỉ thành công");
    }

    if (success) handleCloseForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      const success = await onDeleteAddress(id);
      if (success) toast.success("Đã xóa địa chỉ");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Địa chỉ của tôi</h2>
        <button
          onClick={() => handleOpenForm()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Thêm địa chỉ mới
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-10 text-center text-gray-500">
          Đang tải địa chỉ...
        </div>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((addr: Address) => (
          <div
            key={addr._id}
            className={`border rounded-lg p-4 ${
              addr.is_default ? "border-blue-500 bg-blue-50/50" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{addr.full_name}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">{addr.phone}</span>

                  {addr.is_default && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                      Mặc định
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600">
                  {addr.address}, {addr.ward}, {addr.district}, {addr.province}
                </p>
              </div>

              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => handleOpenForm(addr)}
                  className="text-blue-600 hover:underline"
                >
                  Sửa
                </button>

                {!addr.is_default && (
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm col-span-2"
              />

              <input
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm col-span-2"
              />

              <input
                placeholder="Tỉnh / Thành phố"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              />

              <input
                placeholder="Quận / Huyện"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              />

              <input
                placeholder="Phường / Xã"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm col-span-2"
              />

              <textarea
                placeholder="Địa chỉ cụ thể (số nhà, tên đường...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="border rounded-lg px-3 py-2 text-sm col-span-2"
              />
            </div>

            <label className="flex items-center gap-2 mt-4 text-sm">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              Đặt làm địa chỉ mặc định
            </label>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseForm}
                className="flex-1 border px-4 py-2 rounded-lg text-sm"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveAddress}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                {editingId ? "Cập nhật" : "Lưu địa chỉ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
