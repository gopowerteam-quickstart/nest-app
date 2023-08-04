import {
  SetMetadata,
  applyDecorators,
} from '@nestjs/common'
import 'reflect-metadata'
import {
  RESPONSE,
  RESPONSE_BODY,
  RESPONSE_ENTITY,
  RESPONSE_HEADER,
} from '../http.constants'

export function Response() {
  return applyDecorators(SetMetadata(RESPONSE, RESPONSE))
}

export function ResponseHeader() {
  return applyDecorators(
    SetMetadata(RESPONSE_HEADER, RESPONSE_HEADER),
  )
}

export function ResponseBody() {
  return applyDecorators(
    SetMetadata(RESPONSE_BODY, RESPONSE_BODY),
  )
}

export function ResponseEntity(entity) {
  return applyDecorators(
    SetMetadata(RESPONSE_ENTITY, entity),
  )
}
