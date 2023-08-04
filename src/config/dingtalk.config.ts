import { registerAs } from '@nestjs/config'

/**
 * 钉钉配置
 */
export const DingTalkConfig = registerAs('dingtalk', () => ({
  corpId: process.env.DINGTALK_CORP_ID,
  authorizeURL: 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize',
  qrconnectURL: 'https://oapi.dingtalk.com/connect/qrconnect',
  ticketURL: 'https://oapi.dingtalk.com/get_jsapi_ticket',
  tokenURL: 'https://oapi.dingtalk.com/gettoken',
}))
