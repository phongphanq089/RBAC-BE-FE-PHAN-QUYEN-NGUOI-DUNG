import { AuthRequest } from '@/middleware/authMiddleware'
import { User } from '@/models/user.model'
import { CreateUserSchema, LoginSchema } from '@/schemas/user.schema'

import { JWTPayload } from '@/types'
import { AppError } from '@/utils/errors'
import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify'

// Extend FastifyRequest to include currentUser
declare module 'fastify' {
  interface FastifyRequest {
    currentUser?: any
  }
}

interface RegisterRoute extends RouteGenericInterface {
  Body: CreateUserSchema
}
export const registerUserController = async (
  request: FastifyRequest<RegisterRoute>,
  reply: FastifyReply
) => {
  const { username, email, password, role } = request.body as any
  const user = await User.create({ username, email, password, role })
  const token = request.server.jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )
  return reply.status(201).send({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    },
  })
}

interface LoginRoute extends RouteGenericInterface {
  Body: LoginSchema
}
export const loginUserController = async (
  request: FastifyRequest<LoginRoute>,
  reply: FastifyReply
) => {
  const { email, password } = request.body
  const user = await User.findByEmail(email)
  if (!user) {
    throw new AppError('User Invalid credentials', 401)
  }

  const isValidPassword = await User.validatePassword(password, user.password)

  if (!isValidPassword) {
    throw new AppError('Password Invalid credentials', 401)
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 401)
  }

  // Update last login
  await User.updateLastLogin(user._id!)

  const token = request.server.jwt.sign(
    {
      userId: user._id!,
      email: user.email,
      role: user.role,
    },
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )
  return reply.send({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: new Date(),
      },
      token,
    },
  })
}

interface getProfileRoute extends RouteGenericInterface {
  user: JWTPayload
  currentUser?: any
}
export const getProfileController = async (
  request: FastifyRequest<getProfileRoute>,
  reply: FastifyReply
) => {
  const user = await User.getUserWithRole(request.currentUser._id)

  return reply.send({
    success: true,
    data: {
      user: {
        id: user!._id,
        username: user!.username,
        email: user!.email,
        role: user!.role,
        roleData: user!.roleData,
        lastLogin: user!.lastLogin,
        createdAt: user!.createdAt,
        metadata: user!.metadata,
      },
    },
  })
}

interface getCurrenrUser extends RouteGenericInterface {
  user: JWTPayload
  currentUser?: any
}

export const refreshTokenController = async (
  request: FastifyRequest<getCurrenrUser>,
  reply: FastifyReply
) => {
  const token = request.server.jwt.sign(
    {
      userId: request.currentUser._id,
      email: request.currentUser.email,
      role: request.currentUser.role,
    },
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )

  return reply.send({
    success: true,
    data: { token },
  })
}

export const logoutController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // ở chuẩn thực tế thì sẽ xoá cokkies của accessToken và refreshToken
  // hiện tại thì tạm thời sẽ trả về message thành công
  reply.send({
    success: true,
    message: 'Logged out successfully',
  })
}

export const getAllUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const users = await User.findAll()
  const sanitizedUsers = users.map((user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    metadata: user.metadata,
  }))

  return reply.send({
    success: true,
    data: { users: sanitizedUsers },
  })
}

export const getUserByIdController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as any
  const user = await User.findById(id)

  if (!user) {
    throw new AppError('User not found', 404)
  }

  return reply.send({
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        metadata: user.metadata,
      },
    },
  })
}

// Thực hiện update thông tin người dùng , có 1 số trường để any vì ko có validate và tạo schema
export const updateUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as any
  const { username, email, password } = request.body as any

  const updateData: any = {}
  if (username) updateData.username = username
  if (email) updateData.email = email
  if (password) updateData.password = password

  const updated = await User.updateUser(id, updateData)

  if (updated === 0) {
    throw new AppError('User not found', 404)
  }

  reply.send({
    success: true,
    message: 'User updated successfully',
  })
}

export const updateUserByAdminController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as any
  const { username, email, password, role, isActive, metadata } =
    request.body as any

  const updateData: any = {}
  if (username) updateData.username = username
  if (email) updateData.email = email
  if (password) updateData.password = password
  if (role) updateData.role = role
  if (typeof isActive !== 'undefined') updateData.isActive = isActive
  if (metadata) updateData.metadata = metadata

  const updated = await User.adminUpdateUser(id, updateData)

  if (updated === 0) {
    throw new AppError('User not found', 404)
  }

  return reply.send({
    success: true,
    message: 'User updated successfully by admin',
  })
}

export const deleteSoftUserByAdminController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as any

  // Hàm  softDeleteUser tức là ko xoá user khỏi db mà chỉ tắt user đó  **hardDeleteUser là ngược lại và ít khuyến khích dùng sẽ dùng, tuỳ vào tình huống mới dùng vì khi xoá luôn trong db sẽ làm mất đi sựu đảm bảo an toàn, tuân thủ luật pháp và giữ tính toàn vẹn dữ liệu.
  const deleted = await User.softDeleteUser(id)
  if (deleted === 0) {
    throw new AppError('User not found', 404)
  }

  return reply.send({
    success: true,
    message: 'User deactivated successfully',
  })
}

export const deleteHardUserByAdminController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as any

  const deleted = await User.hardDeleteUser(id)
  if (deleted === 0) {
    throw new AppError('User not found', 404)
  }

  return reply.send({
    success: true,
    message: 'User permanently deleted',
  })
}
