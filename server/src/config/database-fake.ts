import Datastore from 'nedb-promises'
import path from 'path'
import fs from 'fs'
import { IPermission, IRole, IUser, IUserSession } from '@/types'

class Database {
  public users: Datastore<IUser>
  public roles: Datastore<IRole>
  public permissions: Datastore<IPermission>
  public userSessions: Datastore<IUserSession>

  constructor() {
    const dataDir = path.join(process.cwd(), 'data-fake')

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    this.users = Datastore.create({
      filename: path.join(dataDir, 'users.db'),
      autoload: true,
    })

    this.roles = Datastore.create({
      filename: path.join(dataDir, 'roles.db'),
      autoload: true,
    })

    this.permissions = Datastore.create({
      filename: path.join(dataDir, 'permissions.db'),
      autoload: true,
    })

    this.userSessions = Datastore.create({
      filename: path.join(dataDir, 'sessions.db'),
      autoload: true,
    })

    this.createIndexes()
  }

  private async createIndexes(): Promise<void> {
    try {
      await this.users.ensureIndex({ fieldName: 'email', unique: true })
      await this.users.ensureIndex({ fieldName: 'username', unique: true })
      await this.users.ensureIndex({ fieldName: 'role' })

      await this.roles.ensureIndex({ fieldName: 'name', unique: true })
      await this.roles.ensureIndex({ fieldName: 'priority' })

      await this.permissions.ensureIndex({ fieldName: 'name', unique: true })
      await this.permissions.ensureIndex({ fieldName: 'resource' })

      await this.userSessions.ensureIndex({ fieldName: 'userId' })
      await this.userSessions.ensureIndex({ fieldName: 'token', unique: true })
      await this.userSessions.ensureIndex({ fieldName: 'expiresAt' })
    } catch (error) {
      console.error('Error creating indexes:', error)
    }
  }

  async initializeData(): Promise<void> {
    try {
      await this.initializePermissions()
      await this.initializeRoles()
      await this.cleanupExpiredSessions()
      console.log('✅ Database initialized successfully')
    } catch (error) {
      console.error('❌ Error initializing database:', error)
      throw error
    }
  }

  private async initializePermissions(): Promise<void> {
    const defaultPermissions: Omit<
      IPermission,
      '_id' | 'createdAt' | 'updatedAt'
    >[] = [
      // User permissions
      {
        name: 'user:read:own',
        description: 'Read own user data',
        resource: 'user',
        action: 'read',
        category: 'self',
      },
      {
        name: 'user:update:own',
        description: 'Update own user data',
        resource: 'user',
        action: 'update',
        category: 'self',
      },
      {
        name: 'user:delete:own',
        description: 'Delete own user data',
        resource: 'user',
        action: 'delete',
        category: 'self',
      },

      // User management permissions
      {
        name: 'user:read:all',
        description: 'Read all users data',
        resource: 'user',
        action: 'read',
        category: 'all',
      },
      {
        name: 'user:create:all',
        description: 'Create new users',
        resource: 'user',
        action: 'create',
        category: 'all',
      },
      {
        name: 'user:update:all',
        description: 'Update any user data',
        resource: 'user',
        action: 'update',
        category: 'all',
      },
      {
        name: 'user:delete:all',
        description: 'Delete any user',
        resource: 'user',
        action: 'delete',
        category: 'all',
      },

      // Role permissions
      {
        name: 'role:read:all',
        description: 'Read all roles',
        resource: 'role',
        action: 'read',
        category: 'all',
      },
      {
        name: 'role:create:all',
        description: 'Create new roles',
        resource: 'role',
        action: 'create',
        category: 'all',
      },
      {
        name: 'role:update:all',
        description: 'Update roles',
        resource: 'role',
        action: 'update',
        category: 'all',
      },
      {
        name: 'role:delete:all',
        description: 'Delete roles',
        resource: 'role',
        action: 'delete',
        category: 'all',
      },

      // Content permissions
      {
        name: 'content:read:all',
        description: 'Read all content',
        resource: 'content',
        action: 'read',
        category: 'all',
      },
      {
        name: 'content:moderate:all',
        description: 'Moderate content',
        resource: 'content',
        action: 'moderate',
        category: 'all',
      },

      // System permissions
      {
        name: 'system:admin:all',
        description: 'Full system administration',
        resource: 'system',
        action: 'admin',
        category: 'all',
      },
    ]

    for (const perm of defaultPermissions) {
      const exists = await this.permissions.findOne({ name: perm.name })
      if (!exists) {
        await this.permissions.insert({
          ...perm,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }
  }

  private async initializeRoles(): Promise<void> {
    const defaultRoles: Omit<IRole, '_id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'client',
        description: 'Basic client with access to own data only',
        permissions: ['user:read:own', 'user:update:own'],
        priority: 1,
        isActive: true,
        metadata: { isDefault: true },
      },
      {
        name: 'moderator',
        description: 'Content moderator with limited user management',
        permissions: [
          'user:read:own',
          'user:update:own',
          'content:read:all',
          'content:moderate:all',
          'user:read:all',
        ],
        priority: 2,
        isActive: true,
        metadata: { canModeratContent: true },
      },
      {
        name: 'admin',
        description: 'Administrator with full user and role management',
        permissions: [
          'user:read:own',
          'user:update:own',
          'user:delete:own',
          'user:read:all',
          'user:create:all',
          'user:update:all',
          'user:delete:all',
          'content:read:all',
          'content:moderate:all',
          'role:read:all',
          'role:create:all',
          'role:update:all',
          'role:delete:all',
        ],
        priority: 3,
        isActive: true,
        metadata: { isAdmin: true },
      },
      {
        name: 'super_admin',
        description: 'Super administrator with system-wide privileges',
        permissions: [
          'user:read:own',
          'user:update:own',
          'user:delete:own',
          'user:read:all',
          'user:create:all',
          'user:update:all',
          'user:delete:all',
          'content:read:all',
          'content:moderate:all',
          'role:read:all',
          'role:create:all',
          'role:update:all',
          'role:delete:all',
          'system:admin:all',
        ],
        priority: 4,
        isActive: true,
        metadata: { isSuperAdmin: true },
      },
    ]

    for (const role of defaultRoles) {
      const exists = await this.roles.findOne({ name: role.name })
      if (!exists) {
        await this.roles.insert({
          ...role,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }
  }

  private async cleanupExpiredSessions(): Promise<void> {
    try {
      const now = new Date()
      await this.userSessions.remove(
        { expiresAt: { $lt: now } },
        { multi: true }
      )
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error)
    }
  }
}

export const database = new Database()
