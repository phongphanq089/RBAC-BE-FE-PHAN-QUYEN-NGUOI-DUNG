import { useEffect } from 'react'
import { hasPermission } from '~/lib/permissions'
import { useAuthStore } from '~/store/auth'

interface RequirePermissionProps {
  permission: string | string[]
  children: React.ReactNode
}

export function RequirePermission({
  permission,
  children,
}: RequirePermissionProps) {
  const { getProfile, userProfile } = useAuthStore()

  useEffect(() => {
    getProfile()
  }, [getProfile])

  const permissions = userProfile?.roleData.permissions || []

  const authorized = hasPermission(permissions, permission)

  if (!authorized) {
    return (
      <div className='p-4 text-red-500'>
        Bạn không có quyền truy cập trang này.
      </div>
    )
  }

  return <>{children}</>
}
