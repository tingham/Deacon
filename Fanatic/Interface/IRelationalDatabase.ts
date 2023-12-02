import { Archetype, Findable } from "..";


export interface IRelationalDatabase<T extends Archetype> {
    RenameTable(oldName: string, newName: string): string;
    RemoveColumn(col: string): string;
    AddColumn(col: string, type: string, nullable?: boolean, defaultValue?: any): string;
    ModifyColumn(oldCol: string, col: string, type?: string, nullable?: boolean, defaultValue?: any): string;
    RenameColumn(oldCol: string, col: string): string;
    RemoveIndex(indexName: string): string;
    AddIndex(indexName: string, indexType: string, columns: (keyof T)[]): string;
    RemoveConstraint(constraintName: string): string;
    AddConstraint(constraintName: string, columns: (keyof T)[], referenceTable: string, referenceColumns: string[]): string;
}

export interface IFindableRelationalDatabase<T extends Archetype> extends IRelationalDatabase<T> {
  Find: Findable<T>;
}
