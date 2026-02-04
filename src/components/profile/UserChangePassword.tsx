import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "react-toastify";

export default function UserChangePassword() {
  const { onUpdatePassword, loading, error } = useProfile();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }

    const success = await onUpdatePassword({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });

    if (success) {
      toast.success("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(error || "Đổi mật khẩu thất bại");
    }
  };

  const EyeIcon = ({ show }: { show: boolean }) => (
    <svg
      className="w-5 h-5 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {show ? (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </>
      ) : (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </>
      )}
    </svg>
  );

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Đổi mật khẩu</h2>
      <p className="text-sm text-gray-500 mb-6">
        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
      </p>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu hiện tại"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <EyeIcon show={showCurrentPassword} />
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <EyeIcon show={showNewPassword} />
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <EyeIcon show={showConfirmPassword} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}