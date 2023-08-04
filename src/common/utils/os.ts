import * as os from 'node:os'

export const getIPAddress = () => {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    if (!Object.prototype.hasOwnProperty.call(interfaces, devName))
      continue

    const iface = interfaces[devName]

    for (const alias of iface) {
      if (
        alias.family === 'IPv4'
        && alias.address !== '127.0.0.1'
        && !alias.internal
      )
        return alias.address
    }
  }
}
