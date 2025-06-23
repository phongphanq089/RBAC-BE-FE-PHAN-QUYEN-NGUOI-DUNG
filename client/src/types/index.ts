/* eslint-disable @typescript-eslint/no-explicit-any */
interface User {
  id: string
  username: string
  email: string
  role: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
  metadata?: Record<string, any>
}

interface userProfile {
  id: string
  username: string
  email: string
  role: string
  isActive: boolean
  roleData: {
    name: string
    description: string
    permissions: string[]
    priority: number
  }
}

interface Role {
  _id?: string
  name: string
  description: string
  permissions: string[]
  priority: number
  isActive: boolean
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

interface Permission {
  _id?: string
  name: string
  description: string
  resource: string
  action: string
  category: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  userProfile: userProfile | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  getProfile: () => void
  updateProfile: (userData: any) => Promise<void>
}

export interface AppState {
  users: User[]
  roles: Role[]
  permissions: Permission[]
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  getUserById: (id: string) => Promise<void>
  updateUserPermission: (
    roleName: string,
    permission: string,
    type: 'add' | 'remove'
  ) => Promise<void>
  fetchRoles: () => Promise<void>
  createNewRole: (payload: { name: string }) => Promise<void>
  fetchPermissions: () => Promise<void>
  createUser: (userData: any) => Promise<void>
  updateUser: (id: string, userData: any) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  createRole: (roleData: any) => Promise<void>
  updateRole: (name: string, roleData: any) => Promise<void>
  deleteRole: (name: string) => Promise<void>
  clearError: () => void
}
