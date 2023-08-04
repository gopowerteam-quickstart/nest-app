/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable } from '@nestjs/common'
import { Client } from '../decorators/client.decorator'
import {
  Header,
  Param,
  Query
} from '../decorators/params.decorator'
import { Get } from '../decorators/request.decorator'
import { ReturnResult } from '../interfaces/return-return'

@Injectable()
@Client('xbt-platform-material-service')
export class MaterialClient {
  @Get('/materialPage/getById/:id')
  getMaterial(
    @Param('id') id: string,
    @Header('X-EmployeeToken') token: string
  ): ReturnResult {}

  @Get('/WxMaCode/getMallWxMaCode')
  getMallWxMaCode(
    @Query('page') page: string
  ): ReturnResult {}
}
