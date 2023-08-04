import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { DiscoveryService, MetadataScanner } from '@nestjs/core'
import { RequestService } from './services/request.service'
import { ClientService } from './services/client.service'
import { MetadataService } from './services/metadata.service'
import { MaterialClient } from './clients/material.client'
import { WXCPClient } from './clients/wxcp.client'

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    DiscoveryService,
    ClientService,
    RequestService,
    MetadataService,
    MetadataScanner,
    MaterialClient,
    WXCPClient,
  ],
  exports: [MaterialClient, WXCPClient],
})
export class ClientModule {}
