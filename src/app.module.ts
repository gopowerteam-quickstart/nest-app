import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { forConfigModule } from './config'
import { LoggerModule } from './core/logger/logger.module'
import { ConsulModule } from './core/consul/consul.module'

@Module({
  imports: [
    forConfigModule(),
    LoggerModule,
    ConsulModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
