import fastifyCors from '@fastify/cors'
import { buildApp } from './app'
import { database } from './config/database-fake'
import { config } from './config/envConfig'
import authRoutes from './routes/auth.route'
import { logger } from './utils/logger'
import jwt from '@fastify/jwt'
import { zodErrorHandlerPlugin } from './middleware/zodErrorHandlerPlugin'
import { authenticate } from './middleware/authMiddleware'
import fastify from 'fastify'
import { roleRoutes } from './routes/role.route'
import { permissionRoutes } from './routes/permisson.route'

const app = fastify({
  logger: config.isDevelopment,
})

async function registerRoutes() {
  await app.register(
    async function (fastify) {
      authRoutes(fastify)
    },
    { prefix: '/api/auth' }
  )
  await app.register(
    async function (fastify) {
      roleRoutes(fastify)
    },
    { prefix: '/api/role' }
  )
  await app.register(
    async function (fastify) {
      permissionRoutes(fastify)
    },
    { prefix: '/api/permission' }
  )
}

const start = async (): Promise<void> => {
  try {
    await app.register(fastifyCors, {
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    })

    // Khởi tạo database
    await database.initializeData()

    app.register(zodErrorHandlerPlugin)

    // Register routes
    await registerRoutes()

    app.register(jwt, {
      secret: config.JWT_SECRET || 'your-secret-key',
    })

    app.decorate('authenticate', authenticate)

    // Đăng ký routes

    // Health check
    app.get('/', async (request, reply) => {
      return { status: 'OK', timestamp: new Date().toISOString() }
    })

    await app.listen({
      port: config.port,
      host: config.host,
    })

    logger.info(`Server listening on ${config.host}:${config.port}`)
  } catch (error) {
    logger.error('Error starting server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  process.exit(0)
})

start()
