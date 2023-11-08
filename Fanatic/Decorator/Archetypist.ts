import { SerializingField } from "../Model/Serialize/SerializingField";

// A class decorator that allows any class to be lifted to an Archetype

export function Archetypist(table: string, primaryKey: string) {
    // Return the class being modified extended by the abstract class; using an intermediate class named "Archetype"
    return function(target: any, _context?: ClassDecoratorContext) {
        target.metadata = new Map<string, [SerializingField]>();
        target.table = table;
        target.primaryKey = primaryKey;

        // Copy the properties of the definition into the target
        Object.defineProperty(target.prototype, "Table", { value: table });
        Object.defineProperty(target.prototype, "PrimaryKey", { value: primaryKey });
        Object.defineProperty(target.prototype, "Metadata", { value: new Map<string, [SerializingField]>() });

        // Add a static method that produces a SQL create table statement that looks at Metadata for column definitions
        // The statements collection is a convenience for driver[s] to use when talking to the database. This encapsulates table names and understands the various structures present inside of the archetype that support database io.
        target.Statements = {};

        target.Statements.Concerns = function(): string {
            return `SHOW TABLES LIKE '${table}';`;
        };

        target.Statements.NativeSelect = function(query: string): string {
            return `SELECT ${target.Statements.NativeAttributesPart()} FROM \`${table}\` WHERE ${query};`;
        };

        target.Statements.NativeAttributesPart = function(): string {
            // List of fields aliased to the table name based on fields from Metadata
            let fields: string[] = [];
            const classSymbol = this.name;
            let serializedFields = target.Metadata.get(classSymbol);
            if (!(serializedFields)) {
                target.Metadata.set(classSymbol, serializedFields = []);
            }
            // Add fields that are on this Archetype
            for (const field of serializedFields) {
                fields.push(`\`${field.name}\``);
            }
            return fields.join(", ");
        };

        target.Statements.RemoveColumn = function(col: string): string {
            return `ALTER TABLE \`${table}\` DROP COLUMN \`${col}\`;`;
        };
        target.Statements.AddColumn = function(col: string, type: string, nullable: boolean = true, defaultValue: any = null): string {
            let baseStatement = `ALTER TABLE \`${table}\` ADD COLUMN \`${col}\` ${type}`;
            if (nullable) {
                baseStatement += " NULL";
            }
            if (defaultValue) {
                baseStatement += ` DEFAULT ${defaultValue}`;
            }
            return baseStatement + ";";
        };
        target.Statements.ModifyColumn = function(oldCol: string, col: string, type: string, nullable: boolean = true, defaultValue: any = null): string {
            let baseStatement = `ALTER TABLE \`${table}\` MODIFY COLUMN \`${oldCol}\` ${type}`;
            if (col !== oldCol) {
                baseStatement += ` \`${col}\``;
            }
            if (nullable) {
                baseStatement += " NULL";
            }
            if (defaultValue) {
                baseStatement += ` DEFAULT ${defaultValue}`;
            }
            return baseStatement + ";";
        };
        target.Statements.RenameColumn = function(oldCol: string, col: string): string {
            return `ALTER TABLE \`${table}\` CHANGE \`${oldCol}\` \`${col}\`;`;
        };
        target.Statements.RemoveIndex = function(indexName: string): string {
            return `ALTER TABLE \`${table}\` DROP INDEX \`${indexName}\`;`;
        };
        target.Statements.AddIndex = function(indexName: string, indexType: string = "INDEX", columns: string[]): string {
            return `ALTER TABLE \`${table}\` ADD ${indexType} \`${indexName}\` (\`${columns.join("`, `")}\`);`;
        };
        target.Statements.RemoveConstraint = function(constraintName: string): string {
            return `ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${constraintName}\`;`;
        };
        target.Statements.AddConstraint = function(constraintName: string, columns: string[], referenceTable: string, referenceColumns: string[]): string {
            return `ALTER TABLE \`${table}\` ADD CONSTRAINT \`${constraintName}\` FOREIGN KEY (\`${columns.join("`, `")}\`) REFERENCES \`${referenceTable}\` (\`${referenceColumns.join("`, `")}\`);`;
        };
        target.Statements.Create = function(): string {
            let statement = `CREATE TABLE IF NOT EXISTS \`${table}\` (\n`;
            let fields: string[] = [];

            // Add default fields that are on every Archetype
            fields.push(`\`${primaryKey}\` VARCHAR(255) NOT NULL PRIMARY KEY`);
            fields.push(`\`CreatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            fields.push(`\`UpdatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
            fields.push(`\`Deleted\` BOOLEAN NOT NULL DEFAULT FALSE`);

            const classSymbol = this.name;
            let serializedFields = target.Metadata.get(classSymbol);
            if (!(serializedFields)) {
                target.Metadata.set(classSymbol, serializedFields = []);
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
