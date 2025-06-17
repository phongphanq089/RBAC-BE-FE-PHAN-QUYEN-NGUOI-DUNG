import {
  deleteHardUserByAdminController,
  deleteSoftUserByAdminController,
  getAllUserController,
  getProfileController,
  getUserByIdController,
  loginUserController,
  logoutController,
  refreshTokenController,
  registerUserController,
  updateUserByAdminController,
  updateUserController,
} from '@/controller/auth.controller'
import {
  authenticate,
  authorize,
  forbidSelfDelete,
  requireOwnership,
  requireOwnershipOrRole,
} from '@/middleware/authMiddleware'
import { zodValidate } from '@/middleware/zodValidate'
import { createUserSchema, loginSchema } from '@/schemas/user.schema'

import { withErrorHandling } from '@/utils/withErrorHandling'
import { FastifyInstance } from 'fastify'

export const authRoutes = (server: FastifyInstance) => {
  server.post(
    '/register',
    {
      preHandler: zodValidate(createUserSchema),
    },
    withErrorHandling(registerUserController)
  ),
    server.post(
      '/login',
      {
        preHandler: zodValidate(loginSchema),
      },
      withErrorHandling(loginUserController)
    ),
    server.get(
      '/profile',
      {
        preHandler: [authenticate],
      },
      withErrorHandling(getProfileController)
    ),
    server.post(
      '/refresh',
      { preHandler: [authenticate] },
      withErrorHandling(refreshTokenController)
    )
  server.post(
    '/logout',
    { preHandler: [authenticate] },
    withErrorHandling(logoutController)
  ),
    server.get(
      '/getAllUser',
      { preHandler: [authenticate, authorize(['user:read:all'])] },
      withErrorHandling(getAllUserController)
    ),
    server.get(
      '/:id',
      {
        preHandler: [
          authenticate,
          requireOwnershipOrRole(['admin', 'super_admin'], 'id'),
        ],
      },
      withErrorHandling(getUserByIdController)
    ),
    // Update user (self-update)
    server.put(
      '/:id',
      { preHandler: [authenticate, requireOwnership('id')] },
      updateUserController
    )
  // Admin update user (including role)
  server.put(
    '/:id/admin',
    {
      preHandler: [authenticate, authorize(['user:update:all'])],
    },
    updateUserByAdminController
  )
  // Deleted soft user by admin (including role) **Chỉ admin xoá user khác , nhưng ko có phép xoá user hoàn toàn ra khỏi db
  server.delete(
    '/:id',
    {
      preHandler: [
        authenticate,
        authorize(['user:delete:all']),
        forbidSelfDelete,
      ],
    },
    deleteSoftUserByAdminController
  )
  // Deleted hard user by admin (including role) **Chỉ có super_admin mới có quyền xoá user khỏi db
  server.delete(
    '/:id/hard',
    {
      preHandler: [
        authenticate,
        authorize(['system:admin:all']),
        forbidSelfDelete,
      ],
    },
    deleteHardUserByAdminController
  )
}

export default authRoutes
