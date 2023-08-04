import 'reflect-metadata'

import { CLIENT_METADATA } from '../http.constants'

const createMappingDecorator = (name: string) => {
  return (target: object) => {
    Reflect.defineMetadata(CLIENT_METADATA, name, target)
  }
}

export const Client = (name: string): ClassDecorator =>
  createMappingDecorator(name)
