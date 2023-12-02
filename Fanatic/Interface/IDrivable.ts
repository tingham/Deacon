import { IDriver } from ".."

export interface IDrivable {
  Driver: IDriver
  Query: (sql: string) => Promise<any>
  Execute: (sql: string) => Promise<any>
}
