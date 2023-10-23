import { Database } from "./Database"
import initSqlJs, { Database as SQLDatabase } from "sql.js"
import { Thing } from "./Model/Thing.js"
import { DataSource } from "typeorm"

const sqlConfiguration = { locateFile: (filename: string) => `https://sql.js.org/dist/${filename}` }

export class LocalDatabase extends Database {
  public db!: SQLDatabase
  public static EntityRegistry: Array<any> = [typeof Thing]
  private static initializing: boolean = false
  private static initialized: boolean = false
  private static instance: LocalDatabase
  public DataSource?: DataSource

  public static get Instance(): LocalDatabase {
    if (!this.instance) {
      if (!this.initialized) {
        console.warn("LocalDatabase not initialized")
        this.initialize().then(() => { console.log("LocalDatabase initialized") })
      }
      this.instance = new LocalDatabase()
    }
    return this.instance
  }

  constructor() {
    super()
  }

  public static async initialize() {
    if (this.initializing) {
      return
    }
    this.initializing = true

    let SQL = await initSqlJs(sqlConfiguration)
    this.instance = new LocalDatabase()
    this.instance.db = new SQL.Database()

    // Connect TypeORM to the database

    this.instance.DataSource = new DataSource({
      type: "sqljs",
      location: "browser",
      // database: this.instance.db,
      synchronize: true,
      logging: true,
      entities: LocalDatabase.EntityRegistry
    })

    this.initializing = false
    this.initialized = true
  }

  public async FindAll(entity: typeof Thing) {
    if (!this.DataSource) {
      throw new Error("DataSource not set")
    }
    return this.DataSource.manager.find(entity)
  }

  public async FindById(entity: typeof Thing, id: string) {
    if (!this.DataSource) {
      throw new Error("DataSource not set")
    }
    return this.DataSource.manager.findOne(entity, { id } as any)
  }

  public async Save(entity: Thing) {
    if (!this.DataSource) {
      throw new Error("DataSource not set")
    }
    return this.DataSource.manager.save(entity)
  }

  public async Delete(entity: Thing) {
    if (!this.DataSource) {
      throw new Error("DataSource not set")
    }
    return this.DataSource.manager.remove(entity)
  }

}