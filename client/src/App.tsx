import { Route, Routes } from 'react-router'
import { ProtectedRoute } from './components/PrivateRoute'

import Dashboard from './pages/Dashboard'

import Profile from './pages/Profile'
import { LoginForm } from './pages/Login'
import { Layout } from './layout/LayoutDefault'
import { Register } from './pages/Register'

import { RequirePermission } from './layout/RequirePermission'
import { protectedRoutes } from './config/routeConfig'

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

          {protectedRoutes.map(({ path, element, permission }) => (
            <Route
              key={path}
              path={path}
              element={
                <RequirePermission permission={permission}>
                  {element}
                </RequirePermission>
              }
            />
          ))}
          <Route path='profile' element={<Profile />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
