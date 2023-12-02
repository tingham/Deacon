import winston, { transport } from 'winston'
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
    // Why is Watson output not showing up in the Visual Studio devenv console?
    let transports = new Array<winston.transport>()
    // Force watson to output to the stdout stream
    transports.push(new winston.transports.Stream({ stream: process.stdout }))
    transports.push(new winston.transports.Console())
    this.Root = winston.createLogger({ level: 'info', format: winston.format.cli(), transports })
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
    const orange = chalk.hex('#cc9900')
    this.Instance.Root.error(`${chalk.red(errorObject.name)}: ${orange(errorObject.message)}`)
    this.Instance.Root.error(`${chalk.red(errorObject.name)}:\n${errorObject.stack}`)
  }
}