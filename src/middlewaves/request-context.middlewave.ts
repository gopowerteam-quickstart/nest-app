import { AsyncLocalStorage } from 'node:async_hooks'
import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import { FastifyRequest } from 'fastify'

export function RequestContextMiddleware(
  req: FastifyRequest,
  res: Response,
  next: () => void,
) {
  RequestContext.cls.run(RequestContext.create(req, res), next)
}

@Injectable()
export class RequestContext {
  private req: FastifyRequest
  private res: Response

  static cls = new AsyncLocalStorage<RequestContext>()

  static get currentContext() {
    return this.cls.getStore()
  }

  public get host() {
    return this.req.headers.host
  }

  public static create(req: FastifyRequest, res: Response) {
    const context = new RequestContext()
    context.req = req
    context.res = res
    return context
  }
}
