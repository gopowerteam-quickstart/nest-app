import { Inject, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import Consul from 'consul'
import { ConsulConfig } from 'src/config/consul.config'
import { getCurrentEnv, getIPAddress } from 'src/common/utils'
import { AppConfig } from 'src/config/app.config'
import { MD5 } from 'crypto-js'

export class ConsulService implements OnModuleInit {
  private logger = new Logger(ConsulService.name)
  private consul: Consul

  constructor(
    @Inject(ConsulConfig.KEY)
    private readonly consulConfig: ConfigType<typeof ConsulConfig>,
    @Inject(AppConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,
  ) {}

  onModuleInit() {
    this.consul = this.createConsul()
    this.register()
  }

  /**
   * 创建Consul
   */
  private createConsul(): Consul {
    return new Consul({
      host: this.consulConfig.host,
      port: this.consulConfig.port,
      secure: this.consulConfig.secure,
    })
  }

  /**
   * 注册Consul
   */
  private register() {
    // if (isDevEnv()) {
    //   this.logger.debug('consule: 开发环境跳过注册')
    //   return
    // }

    const serviceId = MD5(`${this.appConfig.name}@${getIPAddress()}:${this.appConfig.port}`).toString()
    const serviceAddress = getIPAddress()
    const servicePort = parseInt(this.appConfig.port)

    const options = {
      id: serviceId,
      name: this.appConfig.name,
      address: serviceAddress,
      port: servicePort,
      secure: this.consulConfig.secure,
      token: this.consulConfig.token,
      tags: [getCurrentEnv(), 'api'],
      check: {
        http: `${this.consulConfig.check.protocol}://${serviceAddress}:${servicePort}/api/health`,
        interval: this.consulConfig.check.interval,
        timeout: this.consulConfig.check.timeout,
        deregistercriticalserviceafter: this.consulConfig.check.deregisterCriticalServiceAfter,
      },
    }

    this.logger.debug('consule: 注册服务:', this.appConfig.name)

    return this.consul.agent.service
      .register(options)
      .then(() => {
        this.logger.debug('consule: 注册成功')
        this.watchNodeHealth()
      })
      .catch((ex) => {
        this.logger.debug('consule: 注册失败:', ex)
        // 注册失败30s后重试
        setTimeout(() => {
          this.register()
        }, 30 * 1000)
      })
  }

  async watchNodeHealth() {
    const a = await this.consul.agent.services()

    // 监听指定节点的状态变化
    // this.consul.watch({
    //   method: this.consul.health.node,
    //   options: { node: NodeID },
    //   backoffFactor: 1000, // 重试间隔时间（毫秒）
    // })
    //   .on('change', (...data) => {
    //     console.log(`Node ${NodeID} status changed:`, data)

    //   // TODO: 在这里编写你需要执行的操作，比如重新注册等
    //   })
    //   .on('error', (err) => {
    //     console.error(`An error occurred while watching node ${NodeID}:`, err)

    //   // TODO: 处理错误
    //   })
  }

  /**
   * 查询服务信息
   * @param serviceName
   * @param serviceTags
   */
  public findServices(
    serviceName = undefined,
    serviceTags = [],
  ) {
    return this.consul.agent
      .services({
        token: this.consulConfig.token,
      })
      .then((services) => {
        // 通过Tag查找Service
        const findServiceByTag = service =>
          serviceTags.every(tag =>
            service.Tags.includes(tag),
          )

        // 通过Name查找Service
        const findServiceByName = service =>
          !serviceName || service.Service === serviceName

        return Object.values(services).find(
          service =>
            findServiceByTag(service)
            && findServiceByName(service),
        )
      })
  }
}
