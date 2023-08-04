import { Injectable, OnModuleInit } from '@nestjs/common'
import {
  DiscoveryService,
  MetadataScanner,
} from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import type { AxiosRequestConfig } from 'axios'
import { plainToInstance } from 'class-transformer'
import { ParamsMetadata } from '../utils/metadata-helper'
import { getRequestParams } from '../utils/params-helper'
import { MetadataService } from './metadata.service'
import { RequestService } from './request.service'

interface DecoratorRequest {
  instance: Function
  key: string
  method: string
  options: AxiosRequestConfig
  responseConfig: string
  responseEntity: any
  paramsMetadata: ParamsMetadata
  serviceName: string
}

@Injectable()
export class ClientService implements OnModuleInit {
  private readonly decoratorRequests = new Map<
    string,
    DecoratorRequest
  >()

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataService: MetadataService,
    private readonly metadataScanner: MetadataScanner,
    private readonly requestService: RequestService,
  ) {}

  async onModuleInit() {
    this.scanProviders()
    await this.mountDecoratorRequests()
  }

  private scanProviders() {
    const providers: InstanceWrapper[]
      = this.discoveryService.getProviders()
    providers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper
      if (!instance || typeof instance === 'string')
        return

      try {
        this.metadataScanner.scanFromPrototype(
          instance,
          Object.getPrototypeOf(instance),
          (key: string) => this.scanRequests(instance, key),
        )
      }
      catch (ex) {}
    })
  }

  private scanRequests(instance: Function, key: string) {
    const target = instance[key]
    const options: AxiosRequestConfig
      = this.metadataService.getOptions(instance, target)
      || {}
    options.url = this.metadataService.getUrl(
      instance,
      target,
    )
    options.method = this.metadataService.getMethod(
      instance,
      target,
    ) as any

    const responseConfig
      = this.metadataService.getResponseConfig(
        instance,
        target,
      )
    const responseEntity
      = this.metadataService.getResponseEntity(
        instance,
        target,
      )
    const paramsMetadata = this.metadataService.getParams(
      instance,
      key,
    )
    const serviceName = this.metadataService.getService(
      instance,
      target,
    )

    if (options.url) {
      this.addDecoratorRequests(
        instance,
        key,
        options,
        responseConfig,
        responseEntity,
        paramsMetadata,
        serviceName,
      )
    }
  }

  public addDecoratorRequests(
    instance: Function,
    method: string,
    options: AxiosRequestConfig,
    responseConfig: string,
    responseEntity: any,
    paramsMetadata: ParamsMetadata,
    serviceName: string,
  ) {
    const key = `${instance.constructor.name}__${method}`
    this.decoratorRequests.set(key, {
      key,
      instance,
      method,
      options,
      responseConfig,
      responseEntity,
      paramsMetadata,
      serviceName,
    })
  }

  private placeParams(baseUrl, pathParams) {
    const params = Object.keys(pathParams)
    const url = params.reduce((acc, param) => {
      const pattern = new RegExp(`:${param}`, 'g')
      return acc.replace(pattern, pathParams[param])
    }, baseUrl)
    return url
  }

  async mountDecoratorRequests() {
    for (const item of this.decoratorRequests.values()) {
      const {
        instance,
        method,
        options,
        responseEntity,
        paramsMetadata,
        serviceName,
      } = item

      instance[method] = (...params: any[]) => {
        const requestParams = getRequestParams(
          paramsMetadata,
          params,
        )
        const requestOptions = {
          ...options,
          params: requestParams.params,
          data: requestParams.data,
          headers: requestParams.headers,
          url: this.placeParams(
            options.url,
            requestParams.uriParams,
          ),
        } as AxiosRequestConfig

        const transformerEntity = (data) => {
          if (!responseEntity) {
            throw new Error(
              `请求未配置请求实体: ${requestOptions.url}`,
            )
          }

          return plainToInstance(responseEntity, data)
        }

        const getResponse = async () => {
          return await this.requestService.send(
            serviceName,
            requestOptions,
          )
        }

        return {
          // 获取Data数据
          getData: () =>
            getResponse().then(response => response.data),
          // 获取实体数据
          getEntity: () =>
            getResponse().then(response =>
              transformerEntity(response.data),
            ),
          // 获取完整数据
          getResponse: () => getResponse(),
          // 获取Header数据
          getHeaders: () =>
            getResponse().then(response => response.headers),
        }
      }
    }
  }
}
