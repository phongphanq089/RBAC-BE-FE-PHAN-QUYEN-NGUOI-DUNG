import { database } from '@/config/database-fake'
import { config } from '@/config/envConfig'
import {
  AdminUpdateUserDTO,
  CreateUserDTO,
  IUser,
  UpdateUserDTO,
} from '@/types'
import { AppError } from '@/utils/errors'
import bcrypt from 'bcrypt'

export class User {
  static async create(userData: CreateUserDTO): Promise<IUser> {
    const {
      username,
      email,
      password,
      role = 'client',
      metadata = {},
    } = userData

    // validate role exists === kiểm tra các role này có được định nhĩa trong database ko tránh tạo các role ko xác định
    const roleExists = await database.roles.findOne({
      name: role,
      isActive: true,
    })
    if (!roleExists) {
      throw new AppError('Role does not exist or is inactive', 400)
    }

    // Check if user already exists
    const existingUser = await database.users.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      throw new AppError('User with this email or username already exists', 409)
    }

    const saltRounds = parseInt(config.BCRYPT_ROUNDS || '12')
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Omit lấy kiểu dữ liệu từ user rồi loại bỏ "_id" ra để tạo ra dữ liệu mới ko có "_id"
    const user: Omit<IUser, '_id'> = {
      username,
      email,
      password: hashedPassword,
      role,
      isActive: true,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return await database.users.insert(user)
  }
  static async findByEmail(email: string): Promise<IUser | null> {
    return await database.users.findOne({ email, isActive: true })
  }
  static async findByUsername(username: string): Promise<IUser | null> {
    return await database.users.findOne({ username, isActive: true })
  }
  static async findById(id: string): Promise<IUser | null> {
    return await database.users.findOne({ _id: id })
  }
  static async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
  static async updateLastLogin(userId: string): Promise<void> {
    await database.users.update(
      { _id: userId },
      { $set: { lastLogin: new Date(), updatedAt: new Date() } }
    )
  }

  static async findAll(filter: Partial<IUser> = {}): Promise<IUser[]> {
    return await database.users.find({ ...filter, isActive: true })
  }

  static async updateUser(
    userId: string,
    updateData: UpdateUserDTO
  ): Promise<number> {
    const { password, ...otherData } = updateData
    // Lấy password ra để ko update password
    const updateFields: any = { ...otherData, updatedAt: new Date() }

    if (password) {
      const saltRounds = parseInt(config.BCRYPT_ROUNDS || '12')
      updateFields.password = await bcrypt.hash(password, saltRounds)
    }

    return await database.users.update({ _id: userId }, { $set: updateFields })
  }
  static async adminUpdateUser(
    userId: string,
    updateData: AdminUpdateUserDTO
  ): Promise<number> {
    const { role, password, ...otherData } = updateData
    const updateFields: any = { ...otherData, updatedAt: new Date() }

    if (role) {
      const roleExists = await database.roles.findOne({
        name: role,
        isActive: true,
      })
      if (!roleExists) {
        throw new AppError('Role does not exist or is inactive', 400)
      }
      updateFields.role = role
    }

    if (password) {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
      updateFields.password = await bcrypt.hash(password, saltRounds)
    }

    return await database.users.update({ _id: userId }, { $set: updateFields })
  }
  static async softDeleteUser(userId: string): Promise<number> {
    return await database.users.updateOne(
      { _id: userId },
      { $set: { isActive: false, updatedAt: new Date() } }
    )
  }
  static async hardDeleteUser(userId: string): Promise<number> {
    // Also cleanup user sessions
    await database.userSessions.remove({ userId }, { multi: true })
    return await database.users.remove({ _id: userId }, { multi: false })
  }
  static async getUserWithRole(
    userId: string
  ): Promise<(IUser & { roleData?: any }) | null> {
    const user = await this.findById(userId)
    if (!user) return null

    const role = await database.roles.findOne({ name: user.role })
    return { ...user, roleData: role }
  }
  static async getUsersByRole(roleName: string): Promise<IUser[]> {
    return await database.users.find({ role: roleName, isActive: true })
  }
}
