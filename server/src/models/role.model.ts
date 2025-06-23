import { database } from '@/config/database-fake'
import { CreateRoleDTO, IPermission, IRole, UpdateRoleDTO } from '@/types'
import { AppError } from '@/utils/errors'

export class Role {
  static async create(roleData: CreateRoleDTO): Promise<IRole> {
    const {
      name,
      description,
      permissions = [],
      priority = 1,
      metadata = {},
    } = roleData

    // Check if role already exists
    const existingRole = await database.roles.findOne({ name })
    if (existingRole) {
      throw new AppError('Role with this name already exists', 409)
    }

    // Validate all permissions exist
    await this.validatePermissions(permissions)

    const role: Omit<IRole, '_id'> = {
      name,
      description,
      permissions,
      priority,
      isActive: true,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return await database.roles.insert(role)
  }

  private static async validatePermissions(
    permissions: string[]
  ): Promise<void> {
    for (const perm of permissions) {
      const permExists = await database.permissions.findOne({ name: perm })
      if (!permExists) {
        throw new AppError(`Permission '${perm}' does not exist`, 400)
      }
    }
  }

  static async findByName(name: string): Promise<IRole | null> {
    return await database.roles.findOne({ name })
  }

  static async findActiveByName(name: string): Promise<IRole | null> {
    return await database.roles.findOne({ name, isActive: true })
  }

  static async findAll(includeInactive = false): Promise<IRole[]> {
    const filter = includeInactive ? {} : { isActive: true }
    return await database.roles.find(filter).sort({ priority: 1 })
  }

  static async updateRole(
    roleName: string,
    updateData: UpdateRoleDTO
  ): Promise<number> {
    const { permissions = [], ...otherData } = updateData

    // Validate permissions if provided
    if (permissions.length > 0) {
      await this.validatePermissions(permissions)
    }

    const updateFields = {
      ...otherData,
      ...(permissions.length > 0 && {}),
      updatedAt: new Date(),
      permissions,
    }

    return await database.roles.update(
      { name: roleName },
      { $set: updateFields }
    )
  }
  static async deleteRole(roleName: string): Promise<number> {
    // Check if any users are using this role
    const usersWithRole = await database.users.findOne({
      role: roleName,
      isActive: true,
    })
    if (usersWithRole) {
      throw new AppError(
        'Cannot delete role that is assigned to active users',
        400
      )
    }

    return await database.roles.remove({ name: roleName }, { multi: false })
  }

  static async softDeleteRole(roleName: string): Promise<number> {
    return await database.roles.update(
      { name: roleName },
      { $set: { isActive: false, updatedAt: new Date() } }
    )
  }

  static async getRolePermissions(roleName: string): Promise<IPermission[]> {
    //Tìm tất cả các role khi người dùng gửi, xem db có những role nào khớp với role người dùng mà người dùng gửi lên ko nếu có thì lấy hết ra
    const role = await this.findActiveByName(roleName)

    if (!role) return []

    const permissions: IPermission[] = []

    for (const permName of role.permissions) {
      // tiếp tục lấy từng permissions của role đó ra kiểm tra tỏng db của  permissions có permissions nào khớp với client gửi lên ko , nếu khớp thì trả ra , sau đó push vào permissions[] trả về
      const perm = await database.permissions.findOne({ name: permName })
      if (perm) permissions.push(perm)
    }

    return permissions
  }

  static async addPermissionToRole(
    roleName: string,
    permissionName: string
  ): Promise<number> {
    console.log(roleName, '==========>')
    const role = await this.findByName(roleName)
    if (!role) {
      throw new AppError('Role not found', 404)
    }

    const permission = await database.permissions.findOne({
      name: permissionName,
    })
    if (!permission) {
      throw new AppError('Permission not found', 404)
    }

    if (role.permissions.includes(permissionName)) {
      throw new AppError('Permission already assigned to role', 400)
    }

    const updatedPermissions = [...role.permissions, permissionName]

    return await database.roles.update(
      { name: roleName },
      { $set: { permissions: updatedPermissions, updatedAt: new Date() } }
    )
  }
  static async removePermissionFromRole(
    roleName: string,
    permissionName: string
  ): Promise<number> {
    const role = await this.findByName(roleName)
    if (!role) {
      throw new AppError('Role not found', 404)
    }

    if (!role.permissions.includes(permissionName)) {
      throw new AppError('Permission not assigned to role', 400)
    }

    const updatedPermissions = role.permissions.filter(
      (p) => p !== permissionName
    )

    return await database.roles.update(
      { name: roleName },
      { $set: { permissions: updatedPermissions, updatedAt: new Date() } }
    )
  }
}
