import 'reflect-metadata'
import {
  BODY_METADATA,
  HEADER_METADATA,
  PARAMS_METADATA,
  QUERY_METADATA,
} from '../http.constants'

export const getRequestParams = (metadata: Object, args) => {
  const params = {}
  const data = {}
  const uriParams = {}
  const headers = {}

  for (const key in metadata) {
    if (!Object.prototype.hasOwnProperty.call(metadata, key))
      continue

    const meta = metadata[key]
    let target = null
    switch (key.split(':')[0]) {
      case PARAMS_METADATA:
        target = uriParams
        break
      case QUERY_METADATA:
        target = params
        break
      case BODY_METADATA:
        target = data
        break
      case HEADER_METADATA:
        target = headers
        break
    }

    if (target) {
      if (meta.data) {
        target[meta.data]
          = meta.index.toString().includes('const')
            ? meta.value
            : args[meta.index]
      }
      else {
        Object.assign(
          target,
          meta.index.toString().includes('const')
            ? meta.value
            : args[meta.index],
        )
      }
    }
  }
  return {
    params,
    data: data === undefined || data == null ? undefined : data,
    uriParams,
    headers,
  }
}
