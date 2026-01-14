import { ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import SearchBar from "../common/SearchBar";
import { useCart } from "@/hooks/useCart";



interface HeaderProps {
  onOpenAuth: () => void;
}

export default function Header({ onOpenAuth }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  const getAvatarText = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              T
            </div>
            <span className="text-lg font-semibold">TechVN</span>
          </Link>

          <SearchBar />

          <div className="flex items-center gap-6">
            {/* Account */}
            {isAuthenticated && user ? (
              <div className="relative group">
                {/* Avatar + Name */}
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.full_name} className="w-full h-full object-cover" />
                      : getAvatarText(user.full_name)
                    }
                  </div>
                  <span className="text-sm font-medium">{user.full_name}</span>
                </div>

                {/* Dropdown */}
                <div
                  className="
                    absolute right-0 top-full mt-2 w-48
                    rounded-md bg-white shadow-lg border
                    opacity-0 invisible
                    group-hover:opacity-100 group-hover:visible
                    transition-all duration-200
                    z-50
                  "
                >
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link
                        to="/user/account/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Tài khoản của tôi
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Đơn mua
                      </Link>
                    </li>

                    <li>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex flex-col items-center text-gray-600 hover:text-blue-600"
              >
                <User size={20} />
                <span className="text-xs">Tài khoản</span>
              </button>
            )}


            {/* Cart */}
            <Link to="/cart" className="relative flex flex-col items-center text-gray-600 hover:text-blue-600">
              <div className="relative">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs">Giỏ hàng</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
