import { Archetype } from "..";
import { Log } from "../../Sword/Inspect/Log";
import { SerializingField, SerializingFieldOptions } from "../Model/SerializingField";

export interface FieldDecoratorOptions {
  DatabaseType: string
  LogicalType?: any
  DefaultValue?: any
  Nullable?: boolean
  Key?: boolean
  Index?: boolean
  Unique?: boolean
}

// Is there a way to limit decorator functions to only be valid for sub-classes of a given class?
export function Field(options: FieldDecoratorOptions) {
  return function (target: any, property: string) {
    let classSymbol = target.name // Symbol(target.name)
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

