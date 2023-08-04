import { registerAs } from '@nestjs/config'

/**
 * 应用配置
 */
export const ConsulConfig = registerAs('consul', () => ({
  address: process.env.CONSUL_ADDRESS,
  host: process.env.CONSUL_HOST,
  port: Number(process.env.CONSUL_PORT),
  secure: process.env.CONSUL_SECURE === 'true',
  token: process.env.CONSUL_TOKEN,
  check: {
    interval: process.env.CONSUL_CHECK_INTERVAL,
    timeout: process.env.CONSUL_CHECK_TIMEOUT,
    protocol: process.env.CONSUL_CHECK_PROTOCOL,
    maxRetry: process.env.CONSUL_CHECK_MAX_RETRY,
    retryInterval: process.env.CONSUL_CHECK_RETRY_INTERVAL,
    deregisterCriticalServiceAfter: process.env.CONSUL_CHECK_DEREGISTER_CRITICAL_SERVICE_AFTER,
  },
}))
