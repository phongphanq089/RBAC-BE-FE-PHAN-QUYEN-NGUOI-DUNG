import { Route, Routes } from 'react-router'
import { ProtectedRoute } from './components/PrivateRoute'

import Dashboard from './pages/Dashboard'

import { Roles } from './pages/Roles'
import Permissions from './pages/Permissions'
import Profile from './pages/Profile'
import { LoginForm } from './pages/Login'
import { Layout } from './layout/LayoutDefault'
import { Register } from './pages/Register'
import { Users } from './pages/Users'

function App() {
  return (
    <div className='overflow-hidden'>
      <Routes>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='users' element={<Users />} />
          <Route path='roles' element={<Roles />} />
          <Route path='permissions' element={<Permissions />} />
          <Route path='profile' element={<Profile />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
