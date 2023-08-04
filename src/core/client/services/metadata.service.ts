import { Injectable } from '@nestjs/common'
import {
  CLIENT_METADATA,
  METHOD_METADATA,
  OPTIONS_METADATA,
  PATH_METADATA,
  REQUEST_PARAMS_METADATA,
  RESPONSE,
  RESPONSE_ENTITY,
  RESPONSE_HEADER,
} from '../http.constants'
import {
  ParamsMetadata,
  getMetadata,
} from '../utils/metadata-helper'

@Injectable()
export class MetadataService {
  getUrl(
    instance: Function,
    target: Function,
  ): string | undefined {
    return getMetadata(
      PATH_METADATA,
      target,
      instance.constructor,
    )
  }

  getMethod(
    instance: Function,
    target: Function,
  ): string | undefined {
    return getMetadata(
      METHOD_METADATA,
      target,
      instance.constructor,
    )
  }

  getResponseConfig(
    instance: Function,
    target: Function,
  ): string | undefined {
    let responseType = getMetadata(
      RESPONSE,
      target,
      instance.constructor,
    )
    if (!responseType) {
      responseType = getMetadata(
        RESPONSE_HEADER,
        target,
        instance.constructor,
      )
    }
    return responseType
  }

  getResponseEntity(
    instance: Function,
    target: Function,
  ): string | undefined {
    return getMetadata(
      RESPONSE_ENTITY,
      target,
      instance.constructor,
    )
  }

  getParams(
    instance: Function,
    key: any,
  ): ParamsMetadata | undefined {
    return Reflect.getMetadata(
      REQUEST_PARAMS_METADATA,
      instance.constructor,
      key,
    )
  }

  getOptions(instance: Function, target: Function) {
    return getMetadata(
      OPTIONS_METADATA,
      target,
      instance.constructor,
    )
  }

  getService(
    instance: Function,
    target: Function,
  ): string | undefined {
    return getMetadata(
      CLIENT_METADATA,
      target,
      instance.constructor,
    )
  }
}
