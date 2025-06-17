import { type } from 'os'
import { z } from 'zod'

export const createUserSchema = z.object({
  _id: z.string().optional(),

  username: z
    .string()
    .min(3, 'Username phải có ít nhất 3 ký tự')
    .max(30, 'Username không được vượt quá 30 ký tự'),

  email: z.string().email('Email không hợp lệ'),

  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),

  role: z.string().min(1, 'Role không được để trống'),

  isActive: z.boolean().optional(),

  metadata: z.record(z.any()).optional(),

  createdAt: z
    .union([z.string(), z.date()])
    .transform((val) => new Date(val))
    .optional(),

  updatedAt: z
    .union([z.string(), z.date()])
    .transform((val) => new Date(val))
    .optional(),

  lastLogin: z
    .union([z.string(), z.date()])
    .transform((val) => (val ? new Date(val) : undefined))
    .optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),

  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export type LoginSchema = z.infer<typeof loginSchema>

export type CreateUserSchema = z.infer<typeof createUserSchema>
