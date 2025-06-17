import { Role } from '@/models/role.model'
import { AppError } from '@/utils/errors'
import { FastifyReply, FastifyRequest } from 'fastify'

export const getRolesController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const includeInactive = (request.query as any).includeInactive === 'true'
  const roles = await Role.findAll(includeInactive)

  return reply.send({
    success: true,
    data: { roles },
  })
}

export const getRoleByNameController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name } = request.params as any
  const role = await Role.findByName(name)

  if (!role) {
    throw new AppError('Role not found', 404)
  }

  return reply.send({
    success: true,
    data: { role },
  })
}

export const createNewRoleController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const role = await Role.create(request.body as any)

  return reply.status(201).send({
    success: true,
    message: 'Role created successfully',
    data: { role },
  })
}

export const updateRoleController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name } = request.params as any
  const updated = await Role.updateRole(name, request.body as any)

  if (updated === 0) {
    throw new AppError('Role not found', 404)
  }

  return reply.send({
    success: true,
    message: 'Role updated successfully',
  })
}

export const deleteRoleController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name } = request.params as any

  // Prevent deletion of default roles
  if (['client', 'moderator', 'admin', 'super_admin'].includes(name)) {
    throw new AppError('Cannot delete default system roles', 400)
  }

  const deleted = await Role.deleteRole(name)
  if (deleted === 0) {
    throw new AppError('Role not found', 404)
  }

  reply.send({
    success: true,
    message: 'Role deleted successfully',
  })
}

export const getRolePermissions = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name } = request.params as any
  const permissions = await Role.getRolePermissions(name)

  return reply.send({
    success: true,
    data: { permissions },
  })
}

export const addRolePermissons = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name, permission } = request.params as any

  await Role.addPermissionToRole(name, permission)

  reply.send({
    success: true,
    message: 'Permission added to role successfully',
  })
}
