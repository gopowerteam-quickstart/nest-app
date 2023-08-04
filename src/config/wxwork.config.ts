import { registerAs } from '@nestjs/config'

/**
 * 企业威信配置
 */
export const WXWorkConfig = registerAs('wxwork', () => ({
  agentTicketURL: 'https://qyapi.weixin.qq.com/cgi-bin/ticket/get',
  corpTicketURL: 'https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket',
  authorizeURL: 'https://open.weixin.qq.com/connect/oauth2/authorize',
  qrconnectURL: 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect',
  tokenURL: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
}))
