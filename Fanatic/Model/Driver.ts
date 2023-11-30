import { Log } from "../../Sword/Log"
import { LogLevel } from "../Enumerations"
import { Connection, createConnection, RowDataPacket } from "mysql2/promise"
import { Archetype } from "./Archetype"
import { SerializingField } from "./SerializingField"
import { add } from "xyzw/dist/vector2"
import { rename } from "fs"

// Declare a simulated database connection that has a method for executing SQL and returning results
export interface IDriver {
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

// MySQL Database Connection Wrapper
export class MyDriver implements IDriver {
  public Connection?: Connection
  public Observers: ObservationFunction[] = []

  public constructor(public hostname: string,
    public username: string,
    public password: string,
    public database: string) {
  }

  public async Provision(archetype: typeof Archetype): Promise<void> {
    let tableName = archetype.name
    let columns = (archetype.prototype as any)?.StaticFields?.filter((field: any) => field instanceof SerializingField)
    let tableExists = await this.checkTableExists(tableName)

    Log.info("MyDriver:Provisioning", tableName)
    Log.info("MyDriver:Provisioning", columns)
    Log.info("MyDriver:Provisioning", tableExists)

    if (tableExists) {
      // Check the name of the table and compare it to the schema of the archetype, if the case is different, rename the table
      if (tableExists[0]?.TABLE_NAME != tableName) {
        let reverseSql = archetype.Statements.RenameTable(tableExists[0]?.TABLE_NAME, tableName.split("").reverse().join(""))
        let renameSql = archetype.Statements.RenameTable(tableName.split("").reverse().join(""), tableName)
        await this.execute(reverseSql)
        await this.execute(renameSql)
      }

      let schemaMatches = await this.checkTableSchema(tableName, columns)
      for (const field of schemaMatches.renameFields) {
        let reverseSql = archetype.Statements.RenameColumn(field.oldName, field.newName.split("").reverse().join(""))
        let renameSql = archetype.Statements.RenameColumn(field.newName.split("").reverse().join(""), field.newName)
        await this.execute(reverseSql)
        await this.execute(renameSql)
      }
      for (const field of schemaMatches.missingFields) {
        let addSql = archetype.Statements.AddColumn(field.name, field.databaseType)
        Log.info("MyDriver:Provisioning", addSql)
        await this.execute(addSql)
      }
      for (const field of schemaMatches.extraneousFields) {
        let dropSql = archetype.Statements.RemoveColumn(field)
        Log.info("MyDriver:Provisioning", dropSql)
        await this.execute(dropSql)
      }
    }
  }


  private async checkTableSchema(tableName: string, definedFields: [SerializingField]): Promise<any> {
    let result = false
    let missingFields: SerializingField[] = []
    let extraneousFields: string[] = []
    let renameFields: { oldName: string, newName: string }[] = []
    const describeTable = await this.query(`DESCRIBE \`${tableName}\`;`)
    Log.info("MyDriver:Provisioning:DescribeTable", describeTable)
    // TODO: Add interface for Metadata get/set
    if (definedFields) {
      let showFields = await this.query(`SHOW FIELDS FROM \`${tableName}\`;`)
      Log.info("MyDriver:Provisioning:ShowFields", showFields)

      // Fields defined in the Archetype that are not in the database
      for (const field of definedFields) {
        let sqlField = showFields.find((value: any) => value.Field.toLowerCase() === field.name?.toLowerCase())
        if (sqlField && sqlField.Field != field.name) {
          renameFields.push({ oldName: sqlField.Field, newName: field.name! })
        } else if (!sqlField) {
          missingFields.push(field)
        }
      }

      // Fields in the database that are not defined in the Archetype
      for (const field of showFields) {
        let localField = definedFields.find((value: any) => value.name?.toLowerCase() === field.Field.toLowerCase())
        if (localField && localField.name != field.Field) {
          renameFields.push({ oldName: field.Field, newName: localField.name! })
        } else if (!localField) {
          Log.warn("MyDriver:Provisioning", `Field ${field.Field} is not defined in ${tableName}`)
          extraneousFields.push(field.Field)
        }
      }
    } else {
      Log.warn("MyDriver:Provisioning", `No fields found for ${tableName}`)
    }
    Log.info("MyDriver:Provisioning:MissingFields", missingFields)
    Log.info("MyDriver:Provisioning:ExtraneousFields", extraneousFields)
    return { missingFields, extraneousFields, renameFields }
  }

  private async checkTableExists(tableName: string): Promise<any[]> {
    let sql = `SELECT * FROM information_schema.tables WHERE table_schema = '${this.database}' AND table_name = '${tableName}' LIMIT 1;`
    let rows = await this.query(sql)
    return rows
  }

  public get isConnected(): boolean {
    return this.Connection !== undefined
  }
  public async execute(sql: string): Promise<any> {
    if (!(this.Connection)) {
      await this.connect()
    }
    if (this.Connection) {
      Log.info("MyDriver", `Executing statement: ${sql}`)
      if (!sql.endsWith(";")) {
        sql = sql + ";"
      }
      // @ts-ignore
      let [rows] = await this.Connection.execute<RowDataPacket[]>(sql)
      return rows
    }
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
        user: 'deacon',
        password: 'deacon',
        database: 'deacon'
      })
      this.SendObservation("Connected")
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
      this.SendObservation("Disconnected")
      return true
    }
    return false
  }
  public log(level: LogLevel, reference: string, message: string): void {
    console.log(`[${LogLevel[level]}] ${reference}: ${message}`)
  }

  private SendObservation(message: string) {
    for (const observer of this.Observers) {
      observer(message)
    }
  }
}
