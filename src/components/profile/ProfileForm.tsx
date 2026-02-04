import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useProfile } from "@/hooks/useProfile";
import DefaultAddressCard from "./DefaultAddressCard";
import RecentOrdersCard from "./RecentOrdersCard";

type Gender = "MALE" | "FEMALE" | "OTHER" | "";

export default function ProfileForm() {
  const {
    user,
    loading,
    error,
    fetchProfile,
    onUpdateProfile,
    onUpdateAvatar,
  } = useProfile();

  // ===== STATE =====
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [gender, setGender] = useState<Gender>("");

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== SET INITIAL DATA =====
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");
      setGender(user.gender || "");

      if (user.birthday) {
        const date = new Date(user.birthday);
        setDay(String(date.getDate()).padStart(2, "0"));
        setMonth(String(date.getMonth() + 1).padStart(2, "0"));
        setYear(String(date.getFullYear()));
      }
    }
  }, [user]);

  // ===== SUBMIT PROFILE =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    let birthday: string | undefined;
    if (day && month && year) {
      birthday = `${year}-${month}-${day}`;
    }

    const success = await onUpdateProfile({
      full_name: fullName,
      phone,
      gender: gender || undefined,
      birthday,
    });

    if (success) {
      setMessage({ type: "success", text: "Cập nhật thông tin thành công" });
      fetchProfile();
    } else {
      setMessage({ type: "error", text: error || "Cập nhật thất bại" });
    }

    setSaving(false);
  };

  // ===== AVATAR =====
  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setMessage({ type: "error", text: "Dung lượng ảnh tối đa 1MB" });
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setMessage({
        type: "error",
        text: "Chỉ chấp nhận định dạng JPEG, PNG",
      });
      return;
    }

    const success = await onUpdateAvatar(file);

    if (success) {
      setMessage({ type: "success", text: "Cập nhật avatar thành công" });
      fetchProfile();
    } else {
      setMessage({ type: "error", text: error || "Cập nhật avatar thất bại" });
    }
  };

  // ===== LOADING =====
  if (loading && !user) {
    return (
      <div className="bg-white rounded-xl p-6 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-black rounded-xl p-6">
      <div className="bg-white rounded-xl p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Hồ sơ cá nhân</h2>
        <p className="text-sm text-gray-500">
          Quản lý thông tin cá nhân để bảo mật tài khoản
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-5 rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}


      <div className="grid grid-cols-12 gap-8">
        {/* LEFT */}
        <form
          onSubmit={handleSubmit}
          className="col-span-12 md:col-span-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Họ và tên</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              value={user?.email || ""}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Số điện thoại</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Giới tính
            </label>
            <div className="flex items-center gap-6">
              {[
                { label: "Nam", value: "MALE" },
                { label: "Nữ", value: "FEMALE" },
                { label: "Khác", value: "OTHER" },
              ].map((g) => (
                <label
                  key={g.value}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g.value}
                    checked={gender === g.value}
                    onChange={() => setGender(g.value as Gender)}
                    className="accent-blue-600"
                  />
                  {g.label}
                </label>
              ))}
            </div>
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Ngày sinh
            </label>
            <div className="flex gap-3">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="border rounded px-3 py-2 text-sm w-24"
              >
                <option value="">Ngày</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={String(d).padStart(2, "0")}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border rounded px-3 py-2 text-sm w-24"
              >
                <option value="">Tháng</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={String(m).padStart(2, "0")}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border rounded px-3 py-2 text-sm w-28"
              >
                <option value="">Năm</option>
                {Array.from({ length: 70 }, (_, i) => 2024 - i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>

        {/* RIGHT - AVATAR */}
        <div className="col-span-12 md:col-span-4">
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-semibold text-gray-500">
                  {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 text-white text-sm opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              >
                Đổi ảnh
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <p className="text-xs text-gray-400 text-center">
              JPEG hoặc PNG
              <br />
              Tối đa 1MB
            </p>
          </div>
        </div>
      </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
        <div className="md:col-span-6">
          <DefaultAddressCard />
        </div>

        <div className="md:col-span-6">
          <RecentOrdersCard />
        </div>
      </div>

    </div>
  );
}
