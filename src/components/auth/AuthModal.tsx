import { X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { login, register } = useAuth();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate
    if (mode === "register") {
      if (!formData.full_name || !formData.email || !formData.password) {
        setError("Vui lòng điền đầy đủ thông tin");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu không khớp");
        return;
      }
      const result = await register(formData.full_name, formData.email, formData.password);
      if (result.success) {
        onClose();
        // Reset form
        setFormData({ full_name: "", email: "", password: "", confirmPassword: "" });
      } else {
        setError(result.message);
      }
    } else {
      if (!formData.email || !formData.password) {
        setError("Vui lòng điền đầy đủ thông tin");
        return;
      }
      const result = await login(formData.email, formData.password);
      if (result.success) {
        onClose();
        // Reset form
        setFormData({ full_name: "", email: "", password: "", confirmPassword: "" });
      } else {
        setError(result.message);
      }
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setFormData({ full_name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="mb-6 text-center text-2xl font-bold">
          {mode === "login" ? "Đăng nhập" : "Đăng ký"}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <input
              className="w-full rounded border px-3 py-2"
              placeholder="Họ và tên"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          )}

          <input
            className="w-full rounded border px-3 py-2"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <input
            type="password"
            className="w-full rounded border px-3 py-2"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          {mode === "register" && (
            <input
              type="password"
              className="w-full rounded border px-3 py-2"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          )}

          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            {mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        {/* Switch */}
        <p className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <>
              Chưa có tài khoản?{" "}
              <button
                className="text-blue-600"
                onClick={switchMode}
              >
                Đăng ký
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản?{" "}
              <button
                className="text-blue-600"
                onClick={switchMode}
              >
                Đăng nhập
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
