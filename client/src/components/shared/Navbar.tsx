import { useAuthStore } from '~/store/auth'

export const Navbar = () => {
  const { user } = useAuthStore()

  return (
    <nav className='bg-white shadow p-4 flex justify-between items-center'>
      <div className='text-xl font-semibold'>Dashboard</div>
      <div className='flex items-center space-x-4'>
        <span>{user?.username || 'Guest'}</span>
      </div>
    </nav>
  )
}
