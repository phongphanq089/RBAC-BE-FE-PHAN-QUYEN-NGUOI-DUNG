// plugins/zodErrorHandlerPlugin.ts
import fp from 'fastify-plugin'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { AppError, ValidationError } from '../utils/errors'
import { logger } from '@/utils/logger'

// Fastify cần fp (fastify-plugin) để nhận biết một module là plugin chính thức, từ đó nó mới
//  - Kích hoạt setErrorHandler() đúng cách.
//  - Cho phép chia sẻ context giữa các plugin khác.
// - Đảm bảo plugin được load đúng thời điểm (trước các route, hooks, decorators...).
export const zodErrorHandlerPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.setErrorHandler(
    (error: any, request: FastifyRequest, reply: FastifyReply) => {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }))
        // logger.warning('Validation error:', { errors, url: request.url })
        return reply.status(400).send({
          success: false,
          message: 'Validation failed',
          errors,
        })
      }

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          success: false,
          message: error.message,
          ...(error instanceof ValidationError && { errors: error.errors }),
        })
      }

      // fallback khi không xác định rõ lỗi là gì nó sẽ mặt định vào trong này
      // logger.error('Unexpected error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Internal Server Error',
      })
    }
  )
})
