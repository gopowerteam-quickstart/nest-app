import { HttpException, HttpStatus } from '@nestjs/common'

export class ToastException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.NOT_ACCEPTABLE) {
    super({ message, toast: true }, status)
  }
}
