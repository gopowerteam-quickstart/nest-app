import {
  Global,
  Module,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConsulService } from './services/consul.service'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [ConsulService],
  exports: [ConsulService],
})
export class ConsulModule {}
