import { ShoppingCart, User } from "lucide-react";
import SearchBar from "../common/SearchBar";

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
          <SearchBar />

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
