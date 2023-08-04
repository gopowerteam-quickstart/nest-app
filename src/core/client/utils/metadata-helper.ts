export interface ParamMetadata {
  index: number
  data: string
  value?: any
}

export declare type ParamsMetadata = Record<string, ParamMetadata>

export const getMetadata = (key, ...targets) => {
  for (let i = 0; i < targets.length; i++) {
    if (!targets[i])
      continue

    const metadata = Reflect.getMetadata(key, targets[i])
    if (metadata)
      return metadata
  }
  return undefined
}
