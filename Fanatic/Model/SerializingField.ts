
type InlineGetter = (this: any) => any
type InlineSetter = (this: any, value: any) => void

export type Newable = new (...args: any[]) => any
export type SerializingFieldOptions = {
    [key in keyof SerializingField]: string | boolean | Newable | InlineGetter | InlineSetter;
};
export class SerializingField {
  public Name?: string;
  public DatabaseType?: string;
  public DatabaseDefault?: string;
  public DatabaseNullable?: boolean;
  public DatabaseIndex?: boolean;
  public DatabaseUnique?: boolean;
  public DatabaseAutoIncrement?: boolean;
  public DatabasePrimaryKey?: boolean;

  public LogicalType?: Newable
  public getter?: InlineGetter;
  public setter?: InlineSetter;

  public static FromDecoratedProperty(propertyKey: string, parameters: SerializingFieldOptions): SerializingField {
    let instance = new SerializingField();
    instance.Name = propertyKey.toString();
    if (parameters.hasOwnProperty("DatabaseType")) {
      instance.DatabaseType = parameters["DatabaseType"] as string;
    }
    if (parameters.hasOwnProperty("DatabaseDefault")) {
      instance.DatabaseDefault = parameters["DatabaseDefault"] as string;
    }
    if (parameters.hasOwnProperty("DatabaseNullable")) {
      instance.DatabaseNullable = parameters["DatabaseNullable"] as boolean;
    }
    if (parameters.hasOwnProperty("DatabaseIndex")) {
      instance.DatabaseIndex = parameters["DatabaseIndex"] as boolean;
    }
    if (parameters.hasOwnProperty("DatabaseUnique")) {
      instance.DatabaseUnique = parameters["DatabaseUnique"] as boolean;
    }
    if (parameters.hasOwnProperty("DatabaseAutoIncrement")) {
      instance.DatabaseAutoIncrement = parameters["DatabaseAutoIncrement"] as boolean;
    }
    if (parameters.hasOwnProperty("DatabasePrimaryKey")) {
      instance.DatabasePrimaryKey = parameters["DatabasePrimaryKey"] as boolean;
    }
    if (parameters.hasOwnProperty("LogicalType")) {
      instance.LogicalType = parameters["LogicalType"] as Newable;
    }
    if (parameters.hasOwnProperty("getter")) {
      instance.getter = parameters["getter"] as InlineGetter;
    }
    if (parameters.hasOwnProperty("setter")) {
      instance.setter = parameters["setter"] as InlineSetter;
    }

    return instance;
  }
}
