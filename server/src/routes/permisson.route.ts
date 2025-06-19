import {
  getPermissionsByResourceController,
  getPermissionsController,
} from '@/controller/permission.controller'
import { authenticate } from '@/middleware/authMiddleware'
import { FastifyInstance } from 'fastify'

export const permissionRoutes = (server: FastifyInstance) => {
  server.get(
    '/',
    {
      preHandler: authenticate,
    },
    getPermissionsController
  ),
    // Get permissions by resource
    server.get(
      '/resource/:resource',
      {
        preHandler: authenticate,
      },
      getPermissionsByResourceController
    )
}
