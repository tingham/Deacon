
type InlineGetter = (this: any) => any
type InlineSetter = (this: any, value: any) => void

export type Newable = new (...args: any[]) => any
export type NonNewable = string | number | boolean

export type SerializingFieldOptions = {
    [key in keyof SerializingField]: Newable | NonNewable | InlineGetter | InlineSetter;
};
export class SerializingField {
  public Column?: string;
  public Name?: string;
  public Type?: string;
  public Default?: string;
  public Nullable?: boolean;
  public Index?: boolean;
  public Unique?: boolean;
  public AutoIncrement?: boolean;
  public PrimaryKey?: boolean;

  public LogicalType?: Newable | NonNewable;

  public getter?: InlineGetter;
  public setter?: InlineSetter;

  public static FromDecoratedProperty(propertyKey: string, parameters: SerializingFieldOptions): SerializingField {
    let instance = new SerializingField();
    instance.Name = propertyKey.toString();
    if (parameters.hasOwnProperty("Column")) {
      instance.Column = parameters["Column"] as string;
    } else {
      instance.Column = propertyKey.toString();
    }
    if (parameters.hasOwnProperty("Type")) {
      instance.Type = parameters["Type"] as string;
    }
    if (parameters.hasOwnProperty("Default")) {
      instance.Default = parameters["Default"] as string;
    }
    if (parameters.hasOwnProperty("Nullable")) {
      instance.Nullable = parameters["Nullable"] as boolean;
    }
    if (parameters.hasOwnProperty("Index")) {
      instance.Index = parameters["Index"] as boolean;
    }
    if (parameters.hasOwnProperty("Unique")) {
      instance.Unique = parameters["Unique"] as boolean;
    }
    if (parameters.hasOwnProperty("AutoIncrement")) {
      instance.AutoIncrement = parameters["AutoIncrement"] as boolean;
    }
    if (parameters.hasOwnProperty("PrimaryKey")) {
      instance.PrimaryKey = parameters["PrimaryKey"] as boolean;
    }
    if (parameters.hasOwnProperty("LogicalType")) {
      instance.LogicalType = parameters["LogicalType"] as Newable | NonNewable;
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
