import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: HttpException | Error) => {
        switch (true) {
          case error instanceof HttpException:
            throw error
          default:
            throw new HttpException(
              {
                message: error.message,
                stack: error.stack,
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
      }),
    )
  }
}
