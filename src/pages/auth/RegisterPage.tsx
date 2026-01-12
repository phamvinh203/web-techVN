import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold text-center">Đăng ký</h1>

        <input
          className="mb-3 w-full rounded border px-3 py-2"
          placeholder="Email"
        />
        <input
          type="password"
          className="mb-3 w-full rounded border px-3 py-2"
          placeholder="Mật khẩu"
        />

        <button className="w-full rounded bg-blue-600 py-2 text-white">
          Đăng ký
        </button>

        <p className="mt-4 text-center text-sm">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-600">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
