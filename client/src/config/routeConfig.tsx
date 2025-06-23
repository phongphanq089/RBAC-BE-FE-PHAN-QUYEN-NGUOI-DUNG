import Permissions from '~/pages/Permissions'
import { Roles } from '~/pages/Roles'
import { Users } from '~/pages/Users'

export const protectedRoutes = [
  {
    path: 'users',
    element: <Users />,
    permission: 'user:read:all',
  },
  {
    path: 'roles',
    element: <Roles />,
    permission: 'role:read:all',
  },
  {
    path: 'permissions',
    element: <Permissions />,
    permission: 'system:admin:all',
  },
]
