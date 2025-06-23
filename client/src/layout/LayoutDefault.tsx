import { Outlet } from 'react-router'
import { Navbar } from '~/components/shared/Navbar'
import { Sidebar } from '~/components/shared/Sidebar'

export const Layout = () => {
  return (
    <div className='flex overflow-hidden'>
      <Sidebar />
      <div className='flex-1 h-screen overflow-auto'>
        <Navbar />
        <main className='p-6 bg-gray-100 h-screen'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
