import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    // 输出日志
    Logger.error(exception)

    const getHttpStatus = () => {
      if (exception instanceof HttpException)
        return exception.getStatus()
      else
        return HttpStatus.INTERNAL_SERVER_ERROR
    }

    const getResponseBody = () => {
      const body: Record<string, any> = {
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      }

      switch (true) {
        case typeof exception?.response === 'string':
          body.message = exception?.response
          break
        case typeof exception?.response?.message === 'string':
          body.message = exception?.response?.message
          break
        case Array.isArray(exception?.response?.message):
          body.message = exception?.response?.message
          break
      }

      if (exception?.response?.toast)
        body.toast = true

      return body
    }

    httpAdapter.reply(ctx.getResponse(), getResponseBody(), getHttpStatus())
  }
}
