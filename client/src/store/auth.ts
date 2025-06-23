/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from 'zustand'
import { api } from '~/lib/axios'

import { persist } from 'zustand/middleware'
import type { AppState, AuthState } from '~/types'
import { toast } from 'react-toastify'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userProfile: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const response = await api.post('/auth/login', { email, password })
          const { user, token } = response.data.data

          set({ user, token, isAuthenticated: true })
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'ERROR')
        }
      },
      register: async (userData: any) => {
        try {
          const response = await api.post('/auth/register', userData)
          const { user, token } = response.data.data

          set({ user, token, isAuthenticated: true })
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'ERROR')
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        delete api.defaults.headers.common['Authorization']
      },
      getProfile: async () => {
        try {
          const response = await api.get('/auth/profile')
          const { user } = response.data.data

          set({ userProfile: user })
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'ERROR')
        }
      },
      updateProfile: async (userData: any) => {
        try {
          const { user } = get()
          if (!user) throw new Error('No user logged in')

          await api.put(`/auth/${user.id}`, userData)
          // Refetch user data
          const profileResponse = await api.get('/auth/profile')
          set({ user: profileResponse.data.data.user })
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'ERROR')
        }
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
        }
      },
    }
  )
)

export const useAppStore = create<AppState>((set, get) => ({
  users: [],
  roles: [],
  permissions: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true })
    try {
      const response = await api.get('/auth/getAllUser')
      set({ users: response.data.data.users, loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch users',
        loading: false,
      })
    }
  },
  getUserById: async (id: string) => {
    try {
      const response = await api.get(`/auth/${id}`)
      return response.data.data.user
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ERROR')
    }
  },
  updateUserPermission: async (
    roleName: string,
    permission: string,
    type: 'add' | 'remove'
  ) => {
    try {
      if (type === 'add') {
        await api.post(`/role/${roleName}/permissions/${permission}`)
      } else {
        await api.delete(`/role/${roleName}/permissions/${permission}`)
      }
      await get().fetchRoles()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ERROR')
    }
  },
  fetchRoles: async () => {
    set({ loading: true })
    try {
      const response = await api.get('/role')
      set({ roles: response.data.data.roles, loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch roles',
        loading: false,
      })
    }
  },
  createNewRole: async (payload: { name: string }) => {
    set({ loading: true })
    try {
      const response = await api.post('/role', payload)
      set({ roles: response.data.data.roles, loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch roles',
        loading: false,
      })
    }
  },
  fetchPermissions: async () => {
    set({ loading: true })
    try {
      const response = await api.get('/permission')
      set({ permissions: response.data.data.permissions, loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch permissions',
        loading: false,
      })
    }
  },
  createUser: async (userData: any) => {
    try {
      await api.post('/auth/register', userData)
      await get().fetchUsers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ERROR')
    }
  },
  updateUser: async (id: string, userData: any) => {
    try {
      await api.put(`/auth/${id}/admin`, userData)
      await get().fetchUsers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user')
      throw new Error(error.response?.data?.message || 'Failed to update user')
    }
  },
  deleteUser: async (id: string) => {
    try {
      await api.delete(`/auth/${id}`)
      await get().fetchUsers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user')
      throw new Error(error.response?.data?.message || 'Failed to delete user')
    }
  },
  createRole: async (roleData: any) => {
    try {
      await api.post('/roles', roleData)
      await get().fetchRoles()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ERROR')
    }
  },
  updateRole: async (name: string, roleData: any) => {
    try {
      await api.put(`/roles/${name}`, roleData)
      await get().fetchRoles()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ERROR')
    }
  },
  deleteRole: async (name: string) => {
    try {
      await api.delete(`/role/${name}`)
      await get().fetchRoles()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ERROR')
    }
  },
  clearError: () => set({ error: null }),
}))
