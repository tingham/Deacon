import { Log } from "../../Sword/Inspect/Log";
import { LogLevel } from "../Enum/LogLevel";
import { Connection, createConnection, RowDataPacket } from "mysql2/promise";
import { Archetype } from "./Archetype";
import { SerializingField } from "./SerializingField";
import { AbstractDriver, IDriver, ObservationFunction } from "./Driver";

// MySQL Database Connection Wrapper

export class MyDriver extends AbstractDriver implements IDriver {
  public Connection?: Connection;
  public Observers: ObservationFunction[] = [];

  protected static instance: MyDriver
  public static get Instance(): MyDriver {
    if (!MyDriver.instance) {
      MyDriver.instance = new MyDriver("localhost", "deacon", "deacon", "deacon")
    }
    return MyDriver.instance
  }
  public get Instance(): MyDriver {
    return MyDriver.Instance
  }

  public constructor(public hostname: string,
    public username: string,
    public password: string,
    public database: string) {
    super()
  }

  public async Provision(archetype: typeof Archetype): Promise<void> {
  //  let tableName = archetype.name;
  //  let columns = (archetype.prototype as any)?.StaticFields?.filter((field: any) => field instanceof SerializingField);
  //  let tableExists = await this.checkTableExists(tableName);

  //  Log.info("MyDriver:Provisioning", tableName);
  //  Log.info("MyDriver:Provisioning", columns);
  //  Log.info("MyDriver:Provisioning", tableExists);

  //  if (tableExists?.length > 0) {
  //    // Check the name of the table and compare it to the schema of the archetype, if the case is different, rename the table
  //    if (tableExists[0]?.TABLE_NAME != tableName) {
  //      let reverseSql = archetype.Statements.RenameTable(tableExists[0]?.TABLE_NAME, tableName.split("").reverse().join(""));
  //      let renameSql = archetype.Statements.RenameTable(tableName.split("").reverse().join(""), tableName);
  //      await this.execute(reverseSql);
  //      await this.execute(renameSql);
  //    }

  //    let schemaMatches = await this.checkTableSchema(tableName, columns);
  //    for (const field of schemaMatches.renameFields) {
  //      let reverseSql = archetype.Statements.RenameColumn(field.oldName, field.newName.split("").reverse().join(""));
  //      let renameSql = archetype.Statements.RenameColumn(field.newName.split("").reverse().join(""), field.newName);
  //      await this.execute(reverseSql);
  //      await this.execute(renameSql);
  //    }
  //    for (const field of schemaMatches.missingFields) {
  //      let addSql = archetype.Statements.AddColumn(field.name, field.databaseType);
  //      Log.info("MyDriver:Provisioning", addSql);
  //      await this.execute(addSql);
  //    }
  //    for (const field of schemaMatches.extraneousFields) {
  //      let dropSql = archetype.Statements.RemoveColumn(field);
  //      Log.info("MyDriver:Provisioning", dropSql);
  //      await this.execute(dropSql);
  //    }
  //  } else {
  //    let createSql = archetype.Statements.Create();
  //    Log.info("MyDriver:Provisioning", createSql);
  //    await this.execute(createSql);
  //  }
  }


  private async checkTableSchema(tableName: string, definedFields: [SerializingField]): Promise<any> {
    let result = false;
    let missingFields: SerializingField[] = [];
    let extraneousFields: string[] = [];
    let renameFields: { oldName: string; newName: string; }[] = [];
    const describeTable = await this.query(`DESCRIBE \`${tableName}\`;`);
    Log.info("MyDriver:Provisioning:DescribeTable", describeTable);
    // TODO: Add interface for Metadata get/set
    if (definedFields) {
      let showFields = await this.query(`SHOW FIELDS FROM \`${tableName}\`;`);
      Log.info("MyDriver:Provisioning:ShowFields", showFields);

      // Fields defined in the Archetype that are not in the database
      for (const field of definedFields) {
        let sqlField = showFields.find((value: any) => value.Field.toLowerCase() === field.Name?.toLowerCase());
        if (sqlField && sqlField.Field != field.Name) {
          renameFields.push({ oldName: sqlField.Field, newName: field.Name! });
        } else if (!sqlField) {
          missingFields.push(field);
        }
      }

      // Fields in the database that are not defined in the Archetype
      for (const field of showFields) {
        let localField = definedFields.find((value: SerializingField) => value.Name?.toLowerCase() === field.Field.toLowerCase());
        if (localField && localField.Name != field.Field) {
          renameFields.push({ oldName: field.Field, newName: localField.Name! });
        } else if (!localField) {
          Log.warn("MyDriver:Provisioning", `Field ${field.Field} is not defined in ${tableName}`);
          extraneousFields.push(field.Field);
        }
      }
    } else {
      Log.warn("MyDriver:Provisioning", `No fields found for ${tableName}`);
    }
    Log.info("MyDriver:Provisioning:MissingFields", missingFields);
    Log.info("MyDriver:Provisioning:ExtraneousFields", extraneousFields);
    return { missingFields, extraneousFields, renameFields };
  }

  private async checkTableExists(tableName: string): Promise<any[]> {
    let sql = `SELECT * FROM information_schema.tables WHERE table_schema = '${this.database}' AND table_name = '${tableName}' LIMIT 1;`;
    let rows = await this.query(sql);
    return rows;
  }

  public get isConnected(): boolean {
    return this.Connection !== undefined;
  }
  public async execute(sql: string): Promise<any> {
    if (!(this.Connection)) {
      await this.connect();
    }
    if (this.Connection) {
      Log.info("MyDriver", `Executing statement: ${sql}`);
      if (!sql.endsWith(";")) {
        sql = sql + ";";
      }
      // @ts-ignore
      let [rows] = [] // await this.Connection.execute<RowDataPacket[]>(sql);
      return rows;
    }
  }

  public async query(sql: string): Promise<any[]> {
    if (!(this.Connection)) {
      await this.connect();
    }
    if (this.Connection) {
      Log.info("MyDriver", `Executing query: ${sql}`);
      if (!sql.endsWith(";")) {
        sql = sql + ";";
      }
      // @ts-ignore
      let [rows] = await this.Connection.query<RowDataPacket[]>(sql);
      return rows;
    }
    Log.warn("MyDriver", "No connection to execute query");
    return [];
  }
  public async checkSyntax(sql: string): Promise<boolean> {
    return true;
  }
  public async connect(): Promise<boolean> {
    try {
      this.Connection = await createConnection({
        host: 'localhost',
        user: 'deacon',
        password: 'deacon',
        database: 'deacon'
      });
      this.SendObservation("Connected");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async disconnect(): Promise<boolean> {
    if (this.Connection) {
      await this.Connection.end();
      this.Connection = undefined;
      this.SendObservation("Disconnected");
      return true;
    }
    return false;
  }
  public log(level: LogLevel, reference: string, message: string): void {
    console.log(`[${LogLevel[level]}] ${reference}: ${message}`);
  }

  private SendObservation(message: string) {
    for (const observer of this.Observers) {
      observer(message);
    }
  }
}
