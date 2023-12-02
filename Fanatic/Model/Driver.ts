import { LogLevel } from "../Enum/LogLevel"
import { Archetype } from "./Archetype"
import { add } from "xyzw/dist/vector2"
import { rename } from "fs"
import { NotImplementedException } from "../../Sword/Error/Exception"

// Declare a simulated database connection that has a method for executing SQL and returning results
export interface IDriver {
  Instance: IDriver
  Provision(archetype: typeof Archetype): unknown

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

export type ObservationFunction = (message: string) => void
export interface IDriverObserver {
  (message: string): void
}

export abstract class AbstractDriver {
  // The type of the instance for the singleton should be set by the concrete class
  protected static instance: AbstractDriver
  public static get Instance(): AbstractDriver {
    // NOTE: Reminder to implement this in the concrete class
    throw new NotImplementedException()
  }
}

