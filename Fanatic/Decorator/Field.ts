import { SerializingField } from "../Model/Serialize/SerializingField";

// An @Field property decorator that lifts any property to a field in the database as long as the class has been lifted to an Archetype
// TODO: Perhaps the field decorator can take a format for validating the value or forcing formatting
// Or... a separate decorator can be used for validation and a separate decorator can be used for formatting

export function Field(dbType: string) {
    return function(classPrototype: any, property: any) {
        // Get symbol from the class prototype so that we can reference the specific sub-class of Archetype
        const classSymbol = classPrototype.constructor.name;

        // Metadata always writes to the Archetype for some reason
        if (!((classPrototype as any).Metadata)) {
            classPrototype.Metadata = new Map<string, [SerializingField]>();
            classPrototype.Metadata.set(classSymbol, []);
        }
        // Get the type of this property from the class prototype
        let field = new SerializingField();
        field.databaseType = dbType;
        // Get the list of fields from the Archetype
        let serializedFields = classPrototype.Metadata.get(classSymbol);
        if (!(serializedFields)) {
            classPrototype.Metadata.set(classSymbol, serializedFields = []);
        }
        if (!(serializedFields.find((field: SerializingField) => field.name === property))) {
            // Add the field to the Archetype
            field.name = property;
            serializedFields.push(field);
        }
        // classPrototype.Metadata.set(property, field)
    };
}
