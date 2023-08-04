module.exports = {
  apps: [
    {
      name: 'chatgpt-0x-server',
      port: '8040',
      cwd: '/data/chatgpt/current/apps/server',
      script: 'dist/main.js',
      error_file: './logs/error.log', // 错误输出日志
      out_file: './logs/out.log', // 日志
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss', // 指定日志文件的时间格式
      autorestart: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
      'user': 'root', // ssh 登陆服务器用户名
      'host': '121.37.181.45', // ssh 地址服务器domain/IP
      'ref': 'origin/master', // Git远程/分支
      'repo': 'git@github.com:zhuchentong/chatgpt-0x.git', // git地址使用ssh地址
      'path': '/data/chatgpt', // 项目存放服务器文件路径
      'ssh_options': 'StrictHostKeyChecking=no',
      'pre-deploy': 'git fetch --all',
      'post-deploy':
        'pnpm install && pnpm build && zx scripts/deploy/index.mjs', // 部署后的动作
    },
  },
}
