import { database } from '@/config/database-fake'
import { IPermission } from '@/types'

export class Permission {
  static async findAll(): Promise<IPermission[]> {
    return await database.permissions
      .find({})
      .sort({ category: 1, resource: 1, action: 1 })
  }

  static async findByName(name: string): Promise<IPermission | null> {
    return await database.permissions.findOne({ name })
  }

  static async findByResource(resource: string): Promise<IPermission[]> {
    return await database.permissions.find({ resource })
  }

  static async findByCategory(category: string): Promise<IPermission[]> {
    return await database.permissions.find({ category })
  }
}
