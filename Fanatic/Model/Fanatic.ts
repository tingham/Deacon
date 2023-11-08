// Fanatic is a minimal ORM for the database. It is used to map tables in the database to business objects in the application.
// The primary distinction between models and business objects is that models are responsible for handling interactions with the database, while business objects are responsible for handling interactions with the api.
/*
Business Objects are generally named by compound names representative of their constituent parts.
For example a business object such as a "SceneDocument" is made up of raw materials such as a generic model instance "Thing" that also provides related data for "Scenes" and "Elements". Relationships, as such, are handled at the business level, while the models are responsible for handling the data.

One simple example of the separation of concerns is demonstrated here in a code sample representing the creation of a new SceneDocument in the application:
*/

import { Archetype } from "./Serialize/Archetype"
import { IDriver } from "./Serialize/Driver"
import { CompoundOperator, Operator } from "../Enumerations"
import { DriverNotConnectedException, Exception, InvalidArgumentsException, InvalidDriverException } from "../Exception"
import { ManagedQueryOptions } from "./Serialize/ManagedQueryOptions"
import { Result } from "./Business/Result"
import { WhereOption } from "./Business/WhereOption"

// Fanatic is fucking fanatical about only selecting a single table at a time; joins, while possible, are done elsewhere.
export abstract class Fanatic {
  protected driver?: IDriver

  public abstract set Driver(driver: IDriver) 
  public abstract get Driver(): IDriver 

  // A List of the classes that make up this business objects "children"
  public Subordinates?: Map<typeof Archetype, "one" | "many">

  // Locate all records
  public async Get<T extends Archetype>(Type: new () => T): Promise<Result<T>>
  // Locate records by an id
  public async Get<T extends Archetype>(Type: new () => T, id: string): Promise<Result<T> | undefined>
  // Locate records by an id, with options
  public async Get<T extends Archetype>(Type: new () => T, id: string, options: ManagedQueryOptions): Promise<Result<T> | undefined>
  // Locate records by an arbitrary query
  public async Get<T extends Archetype>(Type: new () => T, query: WhereOption<T> | { operator: CompoundOperator, where: WhereOption<T>[] }): Promise<Result<T> | undefined>
  // Locate records by an arbitrary query with options
  public async Get<T extends Archetype>(Type: new () => T, query: WhereOption<T> | { operator: CompoundOperator, where: WhereOption<T>[] }, options?: ManagedQueryOptions): Promise<Result<T> | undefined>
  public async Get<T extends Archetype>(Type: new () => T, ...params: any[]): Promise<Result<T>> {
    if (this.Driver === undefined) {
      throw new InvalidDriverException()
    }

    // Parse parameters for query and options
    if (params.length === 0) {
      return this.GetFromQuery(Type)
    }
    if (params.length === 1 && params[0] instanceof String) {
      return this.GetFromId(Type, params[0].toString())
    }
    if (params.length === 2 && params[0] instanceof String && params[1] instanceof ManagedQueryOptions) {
      return this.GetFromId(Type, params[0].toString(), params[1])
    }
    if (params.length === 1 && (params[0] instanceof WhereOption || params[0] instanceof Object)) {
      return this.GetFromQuery(Type, params[0])
    }
    if (params.length === 2 && (params[0] instanceof WhereOption || params[0] instanceof Object) && params[1] instanceof ManagedQueryOptions) {
      return this.GetFromQuery(Type, params[0], params[1])
    }
    throw new InvalidArgumentsException()
  }

  public async ReallyComplicated<T extends Archetype>(actual: T) {
    if (actual && actual.Table) {
      console.table([Object.entries(actual)])
    }
  }

  public async GetFromId<T extends Archetype>(Type: new () => T, id: string, options?: ManagedQueryOptions): Promise<Result<T>> {
    // Convert id to a whereoption and produce the sql based on the name of the type of T
    let whereOption = new WhereOption<T>()
    whereOption.Add("id" as any, id)
    return this.GetFromQuery(Type, { operator: CompoundOperator.Nil, where: [whereOption] }, options)
  }

  public async GetFromQuery<T extends Archetype>(Type: new () => T, query?: { operator: CompoundOperator, where: WhereOption<T>[] }, options?: ManagedQueryOptions): Promise<Result<T>> {
    let sqlQuery = `SELECT * FROM \`${(Type as any).Table}\``
if (this.Driver === undefined) {
      throw new InvalidDriverException()
    }
    if (query) {
      sqlQuery = this.BuildQuery(query, options)
    }
    let databaseResponse = await this.Driver.query(sqlQuery)
    let genericResult = new Result<T>()
    if (databaseResponse && databaseResponse instanceof Array) {
      for (const databaseRow of databaseResponse) {
        // Decode the row from the databse to the specific subclass of Archetype
        // This is a sidestep around declarative type safety, but still ensures that the method is available
        let instance = (Type as any).create ? (Type as any).create(databaseRow) : undefined
        if (instance != null) {
          genericResult.push(instance)
        }
      }
    }
    return genericResult
  }

  public BuildQuery<T extends Archetype>(query: { operator: CompoundOperator, where: WhereOption<any>[] }, options?: ManagedQueryOptions): string {
    let sqlquery = `SELECT * FROM ${this.constructor.name} WHERE ${query.where.length > 1 ? '(' + query.where.map(qw => qw.toString()).join(query.operator.toString()) + ')' : query.where[0].toString()};`
    return sqlquery
  }
}

