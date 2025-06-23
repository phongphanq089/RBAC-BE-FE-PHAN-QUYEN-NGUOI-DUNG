import {
  HomeIcon,
  LockIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react'
import { NavLink } from 'react-router'
import { useAuthStore } from '~/store/auth'

const menuItems = [
  { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { path: '/users', icon: UsersIcon, label: 'Users' },
  { path: '/roles', icon: ShieldCheckIcon, label: 'Roles' },
  { path: '/permissions', icon: LockIcon, label: 'Permissions' },
  { path: '/profile', icon: UserIcon, label: 'Profile' },
]

export const Sidebar = () => {
  const { logout } = useAuthStore()

  return (
    <aside className='w-64 bg-gray-800 text-white h-screen p-4'>
      <div className='text-2xl font-bold mb-6'>Admin Dashboard</div>
      <nav className='space-y-2'>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-2 rounded ${
                isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`
            }
          >
            <item.icon className='w-6 h-6 mr-2' />
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={logout}
          className='flex items-center p-2 rounded hover:bg-gray-700 w-full text-left'
        >
          <LockIcon className='w-6 h-6 mr-2' />
          Logout
        </button>
      </nav>
    </aside>
  )
}
