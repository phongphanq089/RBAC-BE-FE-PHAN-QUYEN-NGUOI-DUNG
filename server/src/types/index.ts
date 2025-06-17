export interface IUser {
  _id?: string
  username: string
  email: string
  password: string
  role: string
  isActive: boolean
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

export interface IRole {
  _id?: string
  name: string
  description: string
  permissions: string[]
  priority: number
  isActive: boolean
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface IPermission {
  _id?: string
  name: string
  description: string
  resource: string
  action: string
  category: string
  createdAt: Date
  updatedAt: Date
}

export interface IUserSession {
  _id?: string
  userId: string
  token: string
  refreshToken?: string
  expiresAt: Date
  isActive: boolean
  userAgent?: string
  ipAddress?: string
  createdAt: Date
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

export interface AuthenticatedRequest {
  user: JWTPayload
  currentUser?: IUser
}

export type UserRole = 'client' | 'moderator' | 'admin' | 'super_admin'

export interface CreateUserDTO {
  username: string
  email: string
  password: string
  role?: UserRole
  metadata?: Record<string, any>
}

export interface UpdateUserDTO {
  username?: string
  email?: string
  password?: string
  isActive?: boolean
  metadata?: Record<string, any>
}

export interface AdminUpdateUserDTO extends UpdateUserDTO {
  role?: UserRole
}

export interface LoginDTO {
  email: string
  password: string
}

export interface CreateRoleDTO {
  name: string
  description: string
  permissions: string[]
  priority?: number
  metadata?: Record<string, any>
}

export interface UpdateRoleDTO {
  description?: string
  permissions?: string[]
  priority?: number
  isActive?: boolean
  metadata?: Record<string, any>
}
