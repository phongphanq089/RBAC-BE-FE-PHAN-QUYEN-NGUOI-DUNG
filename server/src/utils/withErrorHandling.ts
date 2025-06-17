import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify'

type Controller<T extends RouteGenericInterface = RouteGenericInterface> = (
  request: FastifyRequest<T>,
  reply: FastifyReply
) => Promise<unknown>

export function withErrorHandling<T extends RouteGenericInterface>(
  controller: Controller<T>
): Controller<T> {
  return async (request, reply) => {
    try {
      return await controller(request, reply)
    } catch (err) {
      throw err
    }
  }
}
