import { ConfigModule } from '@nestjs/config'
import { AppConfig } from './app.config'
import { ConsulConfig } from './consul.config'

const configurations = [
  AppConfig,
  ConsulConfig,
]

export function forConfigModule() {
  const environment = process.env.NODE_ENV || 'development'

  return ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [`.env.${environment}`],
    load: configurations,
  })
}
