import winston from 'winston'
import chalk from 'chalk'

export class Log {
  private static instance: Log
  public Root: winston.Logger

  public static get Instance(): Log {
if (!this.instance) {
      this.instance = new Log()
    }
    return this.instance
  }

  constructor() {
    this.Root = winston.createLogger({ level: 'info', format: winston.format.cli(), transports: [new winston.transports.Console()] })
  }

  public static warn(location: string, message: any): void {
    this.Instance.Root.warn(`${chalk.yellow(location)}: ${message}`)
  }

  public static info(location: string, message: any): void {
    if (typeof message === 'object') {
      message = JSON.stringify(message, null, 2)
    }
    this.Instance.Root.info(`${chalk.cyan(location)}: ${message}`)
  }

  public static error(errorObject: Error): void {
    this.Instance.Root.error(errorObject)
  }
}