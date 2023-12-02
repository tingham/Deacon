
// Database Query Factory Signatures
// e.g. "FindById" or "FindAllByParentId"

import { Archetype, Archetypist, ArchetypistParameters, Field, ManagedQueryOptions, SerializingField } from "..";
import { Property } from "../../Sword/Inspect/ClassHelper";
import { MixinDirective } from "../Enum/MixinDirective";

/**
 * Method signatures for a function that can be used to create a query for a given archetype with field validation
 * @param T The name of the field to find by
 */
type FindByQuery<T extends string> = `FindBy${Capitalize<T>}Query`;
type FindAllByQuery<T extends string> = `FindAllBy${Capitalize<T>}Query`;

/**
 * Method signatures for additional database queries with field validation
 * e.g. "Create", "Delete", "Save"
 **/
type CreateQuery = "CreateQuery";
type DeleteQuery = "DeleteQuery";
type SaveQuery = "SaveQuery";

// Combines the method signatures for the query factory functions into a union type. This allows us to address all of the "appended" methods on the Archetype class as a single type.
type QueryMethodUnion<T extends string> = FindByQuery<T> | FindAllByQuery<T> | CreateQuery | DeleteQuery | SaveQuery;

/**
 * A mixin that adds the query factory functions to the Archetype class
 * @param Ctor The Archetype class to add the query factory functions to
 * @returns The Archetype class with the query factory functions added
 */
export type QueryMixin<T> = {
  [Key in keyof T as QueryMethodUnion<Key extends string ? Key : never>]: (value: any, options?: ManagedQueryOptions) => string;
};

/**
 * Method signatures for functions that can be used to find a given archetype that (in most cases) use the query variants of the same named-prefix
 * e.g. "FindById" or "FindAllByParentId"
 * @param T The name of the field to find by
 **/
type FindBy<T extends string> = `FindBy${Capitalize<T>}`;
type FindAllBy<T extends string> = `FindAllBy${Capitalize<T>}`;

/**
 * Method signatures for additional database queries (in most cases) use the query variants of the same named-prefix
 * e.g. "Create", "Delete", "Save"
 * @param T The name of the field to find by
 **/
type Create = "Create";
type Delete = "Delete";
type Save = "Save";

// Combines the method signatures for the functions into a union type. This allows us to address all of the "appended" methods on the Archetype class as a single type.
type MethodUnion<T extends string> = FindBy<T> | FindAllBy<T> | Create | Delete | Save;

/**
 * A mixin that adds the functions to the Archetype class
 * @param Ctor The Archetype class to add the functions to
 * @returns The Archetype class with the functions added
 */
export type MethodMixin<T> = {
  [Key in keyof T as MethodUnion<Key extends string ? Key : never>]: (value: any, options?: ManagedQueryOptions) => string;
};

export function AttachFields(target: typeof Archetype, nativeProperties: Property[], fields: SerializingField[]) {
  const classSymbol = Symbol(target.name)
  for (const nativeProeprty of nativeProperties) {
    let field = fields.find(field => field.Name === nativeProeprty.Name)
    if (field) {
      target.constructor.prototype.GetFields[classSymbol].push(field)
    }
  }
}
export function AttachMixinQueries(target: typeof Archetype, fields: SerializingField[]) {
  for (const field of fields) {
    let fn = function (value: any, options?: ManagedQueryOptions) {
      return `SELECT * FROM ${target.Table} WHERE ${field.Name} = ${value};`
    }
    Object.defineProperty(target, `FindBy${field.Name}Query`, { value: fn.bind(target) })
  }
}
export function AttachMixinMethods(target: typeof Archetype, fields: SerializingField[]) {
  for (const field of fields) {
    let fn = async function (value: any, options?: ManagedQueryOptions) {
      // Call to Query function - Which must be there because we can't use the method mixin without the query mixin
      let sqlQuery = (target as any)[`FindBy${field.Name}Query`](value, options)

      // TODO: Inject an IDriver into the Archetype class
      if (target.Driver && target.Query) {
        return await target.Query(sqlQuery)
      }
    }
    Object.defineProperty(target, `FindBy${field.Name}Query`, { value: fn.bind(target) })
  }

}

/*
@Archetypist({ Table: "Doodad", Mixin: MixinDirective.Method | MixinDirective.Query } as ArchetypistParameters)
class DoodadArchetype extends Archetype {
  @Field({ DatabaseType: "VARCHAR(36)", DefaultValue: "((uuid()))", Key: true })
  public Id: string = ""
  public Name: string = ""
  public Age: number = 0
  public CreatedAt: Date = new Date()
  public UpdatedAt: Date = new Date()
  constructor(...args: any[]) {
    super(...args)
  }
}

type DoodadType = typeof DoodadArchetype & MethodMixin<DoodadArchetype> & QueryMixin<DoodadArchetype>
export const Doodad = DoodadArchetype as DoodadType
*/
