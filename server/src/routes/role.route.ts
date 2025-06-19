import {
  addRolePermissons,
  createNewRoleController,
  deletePermissionFromRoleController,
  deleteRoleController,
  getRoleByNameController,
  getRolePermissions,
  getRolesController,
  updateRoleController,
} from '@/controller/role.controller'
import { authenticate, authorize } from '@/middleware/authMiddleware'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const roleRoutes = (server: FastifyInstance) => {
  server.get(
    '/',
    {
      preHandler: authenticate,
    },
    getRolesController
  ),
    server.get(
      '/:name',
      {
        preHandler: authenticate,
      },
      getRoleByNameController
    )
  // Create new role (admin only)
  server.post(
    '/',
    {
      preHandler: [authenticate, authorize(['role:create:all'])],
    },
    createNewRoleController
  )
  // Update role (admin only)
  server.put(
    '/:name',
    {
      preHandler: [authenticate, authorize(['role:update:all'])],
    },
    updateRoleController
  )
  // Delete role (admin only)
  server.delete(
    '/:name',
    {
      preHandler: [authenticate, authorize(['role:delete:all'])],
    },
    deleteRoleController
  )
  // Get role permissions
  server.get(
    '/:name/permissions',
    {
      preHandler: [authenticate],
    },
    getRolePermissions
  )
  // Add permission to role
  server.post(
    '/:name/permissions/:permission',
    {
      preHandler: [authenticate, authorize(['role:update:all'])],
    },
    addRolePermissons
  )
  // delete permission from role
  server.delete(
    '/:name/permissions/:permission',
    {
      preHandler: [authenticate, authorize(['role:update:all'])],
    },
    deletePermissionFromRoleController
  )
}
