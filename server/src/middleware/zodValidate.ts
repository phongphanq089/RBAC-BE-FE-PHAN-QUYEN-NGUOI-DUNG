import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import { z, ZodError } from 'zod'

export const zodValidate = (schema: z.ZodSchema) => {
  return (
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    try {
      // Parse và validate dữ liệu
      const parsedData = schema.parse(request.body)
      // Gán dữ liệu đã parse vào request.body
      request.body = parsedData
      done()
    } catch (error) {
      // Ném lỗi để zodErrorHandlerPlugin xử lý
      if (error instanceof ZodError) {
        done(error)
      } else {
        done(new Error('Validation failed'))
      }
    }
  }
}
