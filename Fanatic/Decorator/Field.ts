import { Archetype } from "..";
import { Log } from "../../Sword/Log";
import { SerializingField } from "../Model/SerializingField";

// An @Field property decorator that lifts any property to a field in the database as long as the class has been lifted to an Archetype
// TODO: Perhaps the field decorator can take a format for validating the value or forcing formatting
// Or... a separate decorator can be used for validation and a separate decorator can be used for formatting

export function Field(dbType: string, logicalType?: new (...args: any[]) => any) {
  return function (classPrototype: Archetype, property: any) {
    // Since this is such a challenge for whatever reason; why don't we do it this way instead:
    // 1. The user tags a property as a "Field" in the class for the archetype subclass
    // 2. The decorator adds the property to a static collection on the class for the property name
    // 3. When the Archetypist resolves at the class level; it collects a list of all the properties in the finalized class, and finds the field definitions for each property
    // 4. The Archetypist then uses the field definitions to create the table and the statements
    const classSymbol = Symbol.for(classPrototype.constructor.name);

    let staticFields = (classPrototype as any).StaticFields || {[classSymbol]: new Array<SerializingField>()};
    staticFields[classSymbol] = staticFields[classSymbol] || new Array<SerializingField>();
    let field = new SerializingField()
    field.name = property;
    field.databaseType = dbType;

    // If the field dbType is JSON we need to make sure that we've got a setter and getter for the property and mutate the existing public property to a private property

    if (dbType === "JSON") {
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
        if (logicalType) {
          try {
            inst = new logicalType(...tmp);
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

    staticFields[classSymbol].push(field);
    (classPrototype as any).StaticFields = staticFields;

    // Find the class in the hierarchy that has Archetypist
    // Get symbol from the class prototype so that we can reference the specific sub-class of Archetype
    //const Type = classPrototype.constructor;
    //const classSymbol = Type.name;
    //let MergedMetadata = new Map<string, any>();

  //  let field = new SerializingField();
  //  field.databaseType = dbType;
  //  field.name = property;
  };
}
