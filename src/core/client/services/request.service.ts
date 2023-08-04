import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'

import type { AxiosRequestConfig } from 'axios'
import { lastValueFrom } from 'rxjs'
import { ConsulService } from 'src/core/consul/services/consul.service'

@Injectable()
export class RequestService {
  constructor(
    readonly consulService: ConsulService,
    readonly httpService: HttpService,
  ) {}

  private async getServicebaseURL(serviceName: string) {
    const service = await this.consulService.findServices(
      serviceName,
    )

    if (!service)
      throw new Error(`CONSUL中未找到服务: ${serviceName}`)

    // return `https://gateway.local.xbt-dev.top/${serviceName}/api/`
    return `http://${service.Address}:${service.Port}/api`
  }

  public async send(
    serviceName: string,
    options: AxiosRequestConfig,
  ): Promise<any> {
    const baseURL = await this.getServicebaseURL(
      serviceName,
    )

    return lastValueFrom(
      this.httpService.request({
        baseURL,
        ...(options as any),
      }),
    ).catch((ex) => {
      console.error(options, ex)
    })
  }
}
