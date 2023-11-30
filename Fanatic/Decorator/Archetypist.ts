import "reflect-metadata";
import { SerializingField } from "../Model/SerializingField";

// A class decorator that allows any class to be lifted to an Archetype

export function Archetypist(table: string, primaryKey: string) {
  // Return the class being modified extended by the abstract class; using an intermediate class named "Archetype"
  return function (target: any, _context?: ClassDecoratorContext) {
    target.table = table;
    target.primaryKey = primaryKey;

    let statics: any = [];

    // This gets all the properties from the class type prototype chain, but we need the properties from the instance prototype chain

    let _proto = target.prototype
    let _instance = new target()
    let _instanceProperties = Object.getOwnPropertyNames(_instance)
    while (_proto) {
      Object.getOwnPropertyNames(_proto).forEach(name => {
        if (name !== "constructor") {
          let classSymbol = Symbol.for(_proto.constructor.name)
          let prototypeFields = _proto.StaticFields?.[classSymbol] ? _proto.StaticFields[classSymbol] : null
          if (prototypeFields instanceof Array) {
            // If the property is a field, and it appears in the instance properties, then it can be hoisted
            for (const protoField of prototypeFields) {
              if (_instanceProperties.includes(protoField.name)) {
                statics.push(protoField)
              }
            }
          }
        }
      })
      _proto = Object.getPrototypeOf(_proto)
    }

    // Copy the properties of the definition into the target
    Object.defineProperty(target.prototype, "Table", { value: table });
    Object.defineProperty(target.prototype, "PrimaryKey", { value: primaryKey });
    Object.defineProperty(target.prototype, "StaticFields", { value: statics });

    // If any of the statics have setters/getters defined we need to enact them now by:
    // 1. Moving the property to a private property
    // 2. Adding a getter/setter to the class prototype

    for (const field of statics) {
      if (field instanceof SerializingField) {
        if (field.getter && field.setter && field.name && field.databaseType) {
          // How do I remove the property from the class prototype?
          delete target.prototype[field.name]
          Object.defineProperty(target.prototype, field.name, { get: field.getter, set: field.setter })
          Object.defineProperty(target.prototype, `_${field.name}`, { writable: true, enumerable: false, configurable: true })
        }
      }
    }

    // Add a static method that produces a SQL create table statement that looks at Metadata for column definitions
    // The statements collection is a convenience for driver[s] to use when talking to the database. This encapsulates table names and understands the various structures present inside of the archetype that support database io.
    target.Statements = {};

    target.Statements.Concerns = function (): string {
      return `SHOW TABLES LIKE '${table}';`;
    };

    target.Statements.NativeSelect = function (query: string): string {
      return `SELECT ${target.Statements.NativeAttributesPart()} FROM \`${table}\` WHERE ${query};`;
    };

    target.Statements.NativeAttributesPart = function (): string {
      // List of fields aliased to the table name based on fields from Metadata
      let fields: string[] = [];
      const classSymbol = this.name;
      let serializedFields = target?.prototype?.StaticFields
      if (!(serializedFields)) {
        throw new Error(`Static Fields not found for ${classSymbol}`);
      }
      // Add fields that are on this Archetype
      for (const field of serializedFields) {
        fields.push(`\`${field.name}\``);
      }
      return fields.join(", ");
    };

    target.Statements.RenameTable = function (oldName: string, newName: string): string {
      return `ALTER TABLE \`${oldName}\` RENAME \`${newName}\`;`;
    }

    target.Statements.RemoveColumn = function (col: string): string {
      return `ALTER TABLE \`${table}\` DROP COLUMN \`${col}\`;`;
    };
    target.Statements.AddColumn = function (col: string, type: string, nullable: boolean = true, defaultValue: any = null): string {
      let baseStatement = `ALTER TABLE \`${table}\` ADD COLUMN \`${col}\` ${type}`;
      if (nullable) {
        baseStatement += " NULL";
      }
      if (defaultValue) {
        baseStatement += ` DEFAULT ${defaultValue}`;
      }
      return baseStatement + ";";
    };
    target.Statements.ModifyColumn = function (oldCol: string, col: string, type?: string, nullable: boolean = true, defaultValue: any = null): string {
      let baseStatement = `ALTER TABLE \`${table}\` MODIFY COLUMN \`${oldCol}\``;
      if (col !== oldCol) {
        baseStatement += ` \`${col}\``;
      }
      if (type) {
        baseStatement += ` ${type}`;
      }
      if (nullable) {
        baseStatement += " NULL";
      }
      if (defaultValue) {
        baseStatement += ` DEFAULT ${defaultValue}`;
      }
      return baseStatement + ";";
    };
    target.Statements.RenameColumn = function (oldCol: string, col: string): string {
      return `ALTER TABLE \`${table}\` RENAME COLUMN \`${oldCol}\` TO \`${col}\`;`;
    };
    target.Statements.RemoveIndex = function (indexName: string): string {
      return `ALTER TABLE \`${table}\` DROP INDEX \`${indexName}\`;`;
    };
    target.Statements.AddIndex = function (indexName: string, indexType: string = "INDEX", columns: string[]): string {
      return `ALTER TABLE \`${table}\` ADD ${indexType} \`${indexName}\` (\`${columns.join("`, `")}\`);`;
    };
    target.Statements.RemoveConstraint = function (constraintName: string): string {
      return `ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${constraintName}\`;`;
    };
    target.Statements.AddConstraint = function (constraintName: string, columns: string[], referenceTable: string, referenceColumns: string[]): string {
      return `ALTER TABLE \`${table}\` ADD CONSTRAINT \`${constraintName}\` FOREIGN KEY (\`${columns.join("`, `")}\`) REFERENCES \`${referenceTable}\` (\`${referenceColumns.join("`, `")}\`);`;
    };
    target.Statements.Create = function (): string {
      let statement = `CREATE TABLE IF NOT EXISTS \`${table}\` (\n`;
      let fields: string[] = [];

      // Add default fields that are on every Archetype
      fields.push(`\`${primaryKey}\` VARCHAR(255) NOT NULL PRIMARY KEY`);
      fields.push(`\`CreatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`);
      fields.push(`\`UpdatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
      fields.push(`\`Deleted\` BOOLEAN NOT NULL DEFAULT FALSE`);

      const classSymbol = this.name;
      let serializedFields = target.prototype.StaticFields
      if (!(serializedFields)) {
        throw new Error(`Static Fields not found for ${classSymbol}`);
      }
      console.log(serializedFields);
      // Add fields that are on this Archetype
      for (const field of serializedFields) {
        fields.push(`\`${field.name}\` ${field.databaseType}`);
      }
      statement += fields.join(",\n");
      statement += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`;
      return statement;
    };

  };
}
