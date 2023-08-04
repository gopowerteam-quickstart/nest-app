import * as Util from 'node:util'
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common'
import dayjs from 'dayjs'
import log4js from 'log4js'
import StackTrace from 'stacktrace-js'
import chalk from 'chalk'

export class ContextTrace {
  constructor(
    public readonly context: string,
    public readonly path?: string,
    public readonly lineNumber?: number,
    public readonly columnNumber?: number,
  ) {}
}

export enum LoggerLevel {
  ALL = 'ALL',
  MARK = 'MARK',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF',
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private _logger: log4js.Logger

  private coloredText(level: LoggerLevel | string, content: string) {
    // 根据日志级别，用不同颜色区分
    switch (level) {
      case LoggerLevel.DEBUG:
        return chalk.cyan(content)
      case LoggerLevel.INFO:
        return chalk.green(content)
      case LoggerLevel.WARN:
        return chalk.yellow(content)
      case LoggerLevel.ERROR:
        return chalk.red(content)
      case LoggerLevel.FATAL:
        return chalk.hex('#DD4C35')(content)
      default:
        return chalk.grey(content)
    }
  }

  private setupLog4jsLayout() {
    log4js.addLayout('custom', () => {
      return (logEvent: log4js.LoggingEvent): string => {
        let moduleName = ''
        let position = ''

        // 日志组装
        const messageList: string[] = []
        logEvent.data.forEach((value: any) => {
          if (value instanceof ContextTrace) {
            moduleName = value.context
            // 显示触发日志的坐标（行，列）
            if (value.lineNumber && value.columnNumber)
              position = `${value.lineNumber}, ${value.columnNumber}`

            return
          }

          if (typeof value !== 'string')
            value = Util.inspect(value, false, 3, true)

          messageList.push(value)
        })

        // 日志输出
        const messageOutput: string = this.coloredText(
          logEvent.level.toString(),
          messageList.join(' '),
        )

        // 日志位置
        const positionOutput: string = position ? ` [${position}]` : ''

        // 日志时间
        const dateOutput = dayjs(logEvent.startTime).format(
          'YYYY-MM-D:HH:mm:ss',
        )
        // 日志模块
        const moduleOutput: string = chalk.yellow(
          moduleName ? `[${moduleName}] ` : `[${logEvent.categoryName}]`,
        )

        // 日志级别
        const levelOutput = this.coloredText(
          logEvent.level.toString(),
          `[${logEvent.level.toString()}]`,
        )

        // 进程ID
        const pidOutput = chalk.green(`- ${logEvent.pid.toString()} -`)

        return `${levelOutput} ${pidOutput} ${dateOutput} ${moduleOutput} ${messageOutput} ${positionOutput}`
      }
    })
  }

  private readonly log4jsDevConfig: log4js.Configuration = {
    appenders: {
      default: {
        type: 'console',
        layout: {
          type: 'custom',
        },
      },
    },
    categories: {
      default: { appenders: ['default'], level: 'all' },
    },
  }

  private readonly log4jsProdConfig: log4js.Configuration = {
    appenders: {
      default: {
        type: 'console',
        layout: {
          type: 'custom',
        },
      },
      debug: {
        type: 'dateFile',
        filename: 'logs/debug.log',
        numBackups: 30,
      },
      error: {
        type: 'dateFile',
        filename: 'logs/error.log',
        numBackups: 30,
      },
      debugFilter: {
        type: 'logLevelFilter',
        appender: 'debug',
        level: 'debug',
        maxLevel: 'debug',
      },
      errorFilter: {
        type: 'logLevelFilter',
        appender: 'error',
        level: 'warn',
      },
    },
    categories: {
      default: {
        appenders: ['default', 'debugFilter', 'errorFilter'],
        level: 'all',
      },
    },
  }

  constructor() {
    this.setupLog4jsLayout()
    log4js.configure(
      process.env.NODE_ENV === 'production'
        ? this.log4jsProdConfig
        : this.log4jsDevConfig,
    )
  }

  private get logger() {
    if (!this._logger) this._logger = log4js.getLogger()

    return this._logger
  }

  log(message: any, ...args) {
    log4js.getLogger(args.pop() || 'Application').info(message, ...args)
  }

  error(message: any, ...args) {
    log4js.getLogger(LoggerService.getStackTrace()).error(message, ...args)
  }

  warn(message: any, ...args) {
    log4js.getLogger(LoggerService.getStackTrace()).warn(message, ...args)
  }

  debug(message: any, ...args) {
    log4js.getLogger(LoggerService.getStackTrace()).debug(message, ...args)
  }

  verbose(message: any, ...args) {
    log4js.getLogger(LoggerService.getStackTrace()).trace(message, ...args)
  }

  static getStackTrace(deep = 4): string {
    const stackList: StackTrace.StackFrame[] = StackTrace.getSync()

    const stackInfo: StackTrace.StackFrame = stackList[deep]
    const lineNumber: number = stackInfo.lineNumber
    const columnNumber: number = stackInfo.columnNumber
    // const functionName = stackInfo.functionName

    return `row:${lineNumber},col:${columnNumber}`
  }
}
