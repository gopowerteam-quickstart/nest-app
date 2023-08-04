import { registerAs } from '@nestjs/config'

/**
 * 七牛云配置
 */
export const QiniuConfig = registerAs('qiniu', () => ({
  storage: {
    main: {
      bucket: process.env.QINIU_MAIN_BUCKET,
      domain: process.env.QINIU_MAIN_DOMAIN,
    },
    temp: {
      bucket: process.env.QINIU_TEMP_BUCKET,
      domain: process.env.QINIU_TEMP_DOMAIN,
    },
  },
  accessKey: process.env.QINIU_ACCESS_KEY,
  secretKey: process.env.QINIU_SECRET_KEY,
}))
