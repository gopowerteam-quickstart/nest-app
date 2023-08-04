/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable } from '@nestjs/common'
import { Client } from '../decorators/client.decorator'
import {
  Header,
  Param
} from '../decorators/params.decorator'
import { Get } from '../decorators/request.decorator'
import { ResponseEntity } from '../decorators/response.decorator'
import { WxCpDepart } from '../entities/wxcp-depart.entity'
import { ReturnResult } from '../interfaces/return-return'

@Injectable()
@Client('xbt-platform-wxcp-service')
export class WXCPClient {
  @Get('/auth/queryEmployeeByToken/:token')
  queryEmployeeByToken(
    @Param('token') token: string
  ): ReturnResult {}

  @Get('/department/getBranchName/:id')
  @ResponseEntity(WxCpDepart)
  getBranchName(
    @Param('id') id: string
  ): ReturnResult<WxCpDepart> {}
}
