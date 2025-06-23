import type { JSX } from 'react'
import { Navigate } from 'react-router'
import { useAuthStore } from '~/store/auth'

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return children
}
