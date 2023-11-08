import { Log } from "../../../System/Log"
import { LogLevel } from "../../Enumerations"
import { Connection, createConnection, RowDataPacket } from "mysql2/promise"

// Declare a simulated database connection that has a method for executing SQL and returning results
export interface IDriver {
  // Falls back to the provider to determine if there is an active connection
  get isConnected(): boolean

  // Executes a SQL statement and returns the results
  execute(sql: string): Promise<any>

  // Executes a SQL statement and returns the results
  query(sql: string): Promise<any[]>

  // Validates the syntax of a SQL statement using the provider (if available)
  checkSyntax(sql: string): Promise<boolean>

  // Establishes a connection to the database
  connect(): Promise<boolean>
  // Closes the connection to the database
  disconnect(): Promise<boolean>

  // The provider for this driver implements logging that can either log out to a file or to the console or even the database itself
  log (level: LogLevel, reference: string, message: string): void
}

// MySQL Database Connection Wrapper
export class MyDriver implements IDriver {
  public Connection?: Connection
  public get isConnected(): boolean {
    return this.Connection !== undefined
  }
  public async execute(sql: string): Promise<any> {
  }

  public async query(sql: string): Promise<any[]> {
    if (!(this.Connection)) {
      await this.connect()
    }
    if (this.Connection) {
      Log.info("MyDriver", `Executing query: ${sql}`)
      if (!sql.endsWith(";")) {
        sql = sql + ";"
      }
      // @ts-ignore
      let [rows] = await this.Connection.query<RowDataPacket[]>(sql)
      return rows
    }
    Log.warn("MyDriver", "No connection to execute query")
    return []
  }
  public async checkSyntax(sql: string): Promise<boolean> {
    return true
  }
  public async connect(): Promise<boolean> {
    try {
      this.Connection = await createConnection({
        host: 'localhost',
        user: 'tingham',
        password: 'Titus990l',
        database: 'deacon'
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
  public async disconnect(): Promise<boolean> {
    if (this.Connection) {
      await this.Connection.end()
      this.Connection = undefined
      return true
    }
    return false
  }
  public log(level: LogLevel, reference: string, message: string): void {
    console.log(`[${LogLevel[level]}] ${reference}: ${message}`)
  }
}
