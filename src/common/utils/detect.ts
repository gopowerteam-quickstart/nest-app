export interface DeviceEnv {
  isTablet: boolean
  isPc: boolean
  isAndroid: boolean
  isPhone: boolean
  isChrome: boolean
  isWechat: boolean
  isWxwork: boolean
  isMobile: boolean
  environment: 'desktop' | 'mobile'
}

export function detect(ua = ''): DeviceEnv {
  const isWindowsPhone = /(?:Windows Phone)/.test(ua)
  const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
  const isAndroid = /(?:Android)/.test(ua)
  const isFireFox = /(?:Firefox)/.test(ua)
  const isChrome = /(?:Chrome|CriOS)/.test(ua)
  const isTablet
      = /(?:iPad|PlayBook)/.test(ua)
      || (isAndroid && !/(?:Mobile)/.test(ua))
      || (isFireFox && /(?:Tablet)/.test(ua))
  const isPhone = /(?:iPhone)/.test(ua) && !isTablet
  const isPc = !isPhone && !isAndroid && !isSymbian
  const isMobile = !isPc && !isTablet
  const isWechat
      = /(?:WindowsWechat)|(?:WeChat)|(?:wechatdevtools)/.test(
        ua,
      )
  const isWxwork = /(?:wxwork)/.test(ua)

  return {
    isTablet,
    isPhone,
    isAndroid,
    isMobile,
    isPc,
    isChrome,
    isWechat,
    isWxwork,
    environment: isPc ? 'desktop' : 'mobile',
  }
}
