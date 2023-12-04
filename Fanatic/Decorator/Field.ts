import { AbstractArchetype, Archetype } from "..";
import { Log } from "../../Sword/Inspect/Log";
import { SerializingField, SerializingFieldOptions } from "../Model/SerializingField";

export class FieldDecoratorOptions {
  public Keypath?: string
  public DatabaseType?: string
  public LogicalType?: any
  public DefaultValue?: any
  public Nullable?: boolean
  public Key?: boolean
  public Index?: boolean
  public Unique?: boolean
  public Target?: any

  public static Identity: string = "FieldDecoratorOptions"
  public Identity?: string = FieldDecoratorOptions.Identity
}

// Is there a way to limit decorator functions to only be valid for sub-classes of a given class?
export function Field(options: FieldDecoratorOptions) {
  return function (target: any, property: string) {
    let classSymbol = target.constructor.name // Symbol(target.name)

    // By defining fields in this way the Archetypist can interrogate this specific class for its fields. Here we are required to set some sort of guid on the property descriptor so that we can identify it later
    let nativeProperty = { value: Object.assign({Identity: FieldDecoratorOptions.Identity}, options, { Target: target, Keypath: `${classSymbol}.${property}` }) } as PropertyDescriptor & ThisType<any>
    Reflect.defineProperty(target, property, nativeProperty)

    if (classSymbol == undefined || classSymbol == "Archetype") {
      classSymbol = target.constructor.name
    }
    let field = SerializingField.FromDecoratedProperty(property, options)
    if (options.DatabaseType === "JSON") {
      field.getter = function () {
        // Take the value in the private property and see if we can make a "THING" out of it
        let tmp = (this as any)[`_${property}`];
        if (typeof tmp === "string") {
          try {
            tmp = JSON.parse(tmp);
          } catch (error) {
            tmp = {};
          }
        }
        let inst: any
        if (options.LogicalType) {
          try {
            inst = new options.LogicalType(...tmp);
          } catch (error) { Log.error(error as Error) }
        }

        if (inst) {
          return inst;
        }

        return (this as any)[`_${property}`];
      }
      field.setter = function (value: any) {
        // Reduce the value to a basic type graph and store it
        (this as any)[`_${property}`] = JSON.parse(JSON.stringify(value));
      }
    }
    target.constructor.AddField(classSymbol, field)
  }
}

