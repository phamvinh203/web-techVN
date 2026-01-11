import { Search, ShoppingCart, User } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              T
            </div>
            <span className="text-lg font-semibold text-gray-900">
              TechVN
            </span>
          </div>

          {/* Search */}
          <div className="flex flex-1 max-w-2xl items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm điện thoại, laptop, phụ kiện..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
            <button className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
              Tìm
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {/* Account */}
            <button className="flex flex-col items-center text-gray-600 hover:text-blue-600">
              <User size={20} />
              <span className="text-xs">Tài khoản</span>
            </button>

            {/* Cart */}
            <button className="relative flex flex-col items-center text-gray-600 hover:text-blue-600">
              <ShoppingCart size={20} />
              <span className="text-xs">Giỏ hàng</span>

              {/* Badge */}
              <span className="absolute -top-1 right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                2
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
