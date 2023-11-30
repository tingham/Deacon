import { InvalidTypeAssignmentException } from "../../Sword/Errors/Exception";
import { Log } from "../../Sword/Log";

// Archetype is a class provided to the api by a class decorator labeled @Archetype
// The Archetype decorator requires the following parameters:
// 1. The name of the table that the class represents
// 2. The name of the field in the table that is the primary key
// 3. A boolean flag that indicates whether or not to attach a standard field set to the table/class (CreatedAt, UpdatedAt, Deleted, etc.)
// An factor that grants @Archetype the ability to be constructed with parameters
export interface IArchtetypeConstructor<T> {
  new(table: string, primaryKey: string, standardFields: boolean): T
}

export interface IArchetypeBaseFields {
  CreatedAt?: Date
  UpdatedAt?: Date
  Deleted?: boolean
}

class ArchetypeStatic {
  private static _table: string
  protected static set table(value: string) { this._table = value.toLowerCase() }
  public static get Table(): string { return this._table }
  public get Table(): string { return (this.constructor as typeof Archetype).Table }

  public static _primaryKey: string
  public static get PrimaryKey(): string { return this._primaryKey }
  public get PrimaryKey(): string { return (this.constructor as typeof Archetype).PrimaryKey }

  public static CreateStatement(): string { return "" }
  public static Statements?: any
}

export interface IMagicMethodable {
  [key: `Add${string}`]: (...params: any[]) => any
}

// A decorator for a class that mixes in the IMagicMethodable interface so that collections within a Scheme get `Set${target.constructor.Plural}` and `Get${target.constructor.Plural}` methods
export function Magic(itemType: typeof Archetype) {
  return function (target: any, context?: ClassDecoratorContext) {
    target.prototype[`Add${itemType.Plural}`] = function (...params: any[]) {
      if (params.length === 1 && params[0] instanceof Array) {
        for (const item of params[0]) {
          Log.info("Magic.Set", { item })
        }
      } else {
        for (const item of params) {
          Log.info("Magic.Set", { item })
        }
      }
    };
  }
}

// A base class definition so that @Archetype can be used as a class decorator
// It also grants @Archetype the ability to attach a standard field set to the table/class (CreatedAt, UpdatedAt, Deleted, etc.)
// curiously recurring template pattern
export class Archetype extends ArchetypeStatic {
  public static Singular: string = "Archetype"
  public static Plural: string = "Archetypes"

  // Takes a field collection with values and sets local properties to the values
  public Populate(fields: Map<string, any>) {
    for (const field of Object.entries(fields)) {
      this.setProperty(field[0], field[1])
    }
  }

  private setProperty(name: string, value: any) {
    let anyThis = this as any
    // Compare the stored data in the propery to the value
    // On Type
    let existingPropertyType = typeof(anyThis.hasOwnProperty(name) ? typeof(anyThis[name]) : null)
    let newPropertyType = typeof(value)
    let molestedValue: any
    if (!(existingPropertyType === newPropertyType)) {
      try {
        molestedValue = this.convertValue(value, existingPropertyType)
      } catch (error: any) {
        error.message.append(`\nUnable to assign to ${name} in ${anyThis.constructor.name}`)
        throw error
      }
    } else {
      molestedValue = value
    }
    // Set the property
    anyThis[name] = molestedValue
  }

  // I don't think this is the right place for value handling but maybe? It's a start
  // Takes an unstructued value and attempts to convert it to the specified type
  private convertValue(value: any, type: string): any {
    switch (type) {
      case "string":
        if (value && value.toString) {
          return value.toString()
        }
      case "number":
        if (Number.isNaN(value)) {
          return Number(value)
        }
        throw new InvalidTypeAssignmentException(`${value} is not a ${type}`)
      case "boolean":
        // All values are true-ish or false-ish
        return Boolean(value)
      case "date":
        // Validate that the value can become a date
        let testDate = new Date(value)
        if (testDate.toString() !== "Invalid Date") {
          return testDate
        }
      case "object":
        try {
          let encoded = JSON.stringify(value)
          let decoded = JSON.parse(encoded)
          return decoded
        } catch (error) {}
    }
    throw new InvalidTypeAssignmentException(`${value} is not a ${type}`)
  }

  public static create<T extends typeof Archetype>(this: typeof Archetype & (new () => T)) {
    const r = new this()
    return r as InstanceType<T>
  }
  public static MaidServices(instance: any) {
    console.log("Maid Services", typeof(instance))
  }
}

interface Context {
  name: string,
  metadata: Record<PropertyKey, unknown>
}

//@Archetypist("Hoo", "id")
//class Hoo extends Archetype {
//  @Field("VARCHAR(255)")
//  public Nosey?: string

//  @Field("JSON")
//  public Parker?: any
//}

//console.log(Hoo.Statements)
