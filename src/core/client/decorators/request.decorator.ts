import 'reflect-metadata'

import {
  SetMetadata,
  applyDecorators,
} from '@nestjs/common'
import {
  METHOD_METADATA,
  PATH_METADATA,
} from '../http.constants'

const createMappingDecorator = (
  method: string,
  path: string,
) =>
  applyDecorators(
    SetMetadata(PATH_METADATA, path),
    SetMetadata(METHOD_METADATA, method),
  )

export const Get = (path: string): MethodDecorator =>
  createMappingDecorator('GET', path)

export const Post = (path: string): MethodDecorator =>
  createMappingDecorator('POST', path)
