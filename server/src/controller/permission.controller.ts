import { Permission } from '@/models/permission.model'
import { FastifyReply, FastifyRequest } from 'fastify'

export const getPermissionsController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const permissions = await Permission.findAll()

  return reply.send({
    success: true,
    data: { permissions },
  })
}

export const getPermissionsByResourceController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { category } = request.params as any
  const permissions = await Permission.findByCategory(category)

  return reply.send({
    success: true,
    data: { permissions },
  })
}
