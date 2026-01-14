import { NavLink } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';

export default function UserSidebar() {
  const { user } = useProfile();

  const baseClass =
    'block px-3 py-2 rounded hover:bg-gray-100 transition';

  const activeClass =
    'bg-blue-50 text-blue-600 font-medium';

  return (
    <div className="bg-white rounded-lg p-4">
      {/* User info */}
      <div className="flex items-center gap-3 mb-6">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-lg">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <div>
          <p className="font-semibold">{user?.full_name || 'Người dùng'}</p>
        </div>
      </div>

      {/* Menu */}
      <ul className="space-y-1 text-sm">
        <li>
          <NavLink
            to="/user/account/profile"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : ''}`
            }
          >
            Thông tin tài khoản
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/user/orders"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : ''}`
            }
          >
            Quản lý đơn hàng
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/user/address"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : ''}`
            }
          >
            Địa chỉ
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/user/account/password"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : ''}`
            }
          >
            Đổi mật khẩu
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/user/notifications"
            className={({ isActive}) => 
              `${baseClass} ${isActive ? activeClass : ''}`
            }
          >
            Thống báo
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
