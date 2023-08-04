import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
// import { ClientModule } from './modules/client/client.module'
// import { QiniuModule } from './shared/qiniu/qiniu.module'
// import { WechatModule } from './shared/wechat/wechat.module'
import { RequestContextMiddleware } from './middlewaves/request-context.middlewave'
import { ExceptionsFilter } from './filters/exceptions.filter'
import { LoggerService } from './core/logger/services/logger.service'
/**
 * 配置Swagger
 * @param app
 */
function setupSwagger(app: NestFastifyApplication) {
  const adapter = app.getHttpAdapter()

  const config = new DocumentBuilder()
    .setTitle('接口文档')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('app', '系统')
    .build()

  const document = SwaggerModule.createDocument(
    app,
    config,
    {
      include: [
        // {TODO: modules}
      ],
    },
  )

  SwaggerModule.setup('admin/docs', app, document, {
    customCssUrl: '/swagger-ui.css',
  })

  // 设置OPENAPI接口地址
  adapter.get('/v2/api-docs', (req, res) => {
    res.send(JSON.stringify(document))
  })
}

/**
 * 初始化应用
 * @returns
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: true,
      rawBody: true,
      bufferLogs: true,
    },
  )

  app.useLogger(app.get(LoggerService))
  app.useBodyParser('text/xml')

  // 安装全局前缀
  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '',
        method: RequestMethod.ALL,
      },
    ],
  })

  // 安装验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  app.useGlobalFilters(new ExceptionsFilter(app.get(HttpAdapterHost)))

  // 安装中间件
  app.use(RequestContextMiddleware)
  // 安装Swagger
  setupSwagger(app)

  return app
}

/**
 * 启动应用
 * @param app
 */
async function launch(app: NestFastifyApplication) {
  const config = app.get(ConfigService)

  const port = await config.get('app.port')

  await app.listen(port, '0.0.0.0').then(() => {
    Logger.log(`launch at ${port}`)
  })
}

// 初始化并启动应用
bootstrap().then(launch)
