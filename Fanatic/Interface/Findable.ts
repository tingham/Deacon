import { ManagedQueryOptions } from "..";

// Interface that adapts to provide a consumer with methods to produce SQL statements for a given Archetype that "Find" things... wow

export type FindBy<T extends string> = `FindBy${Capitalize<T>}`;
export type FindAllBy<T extends string> = `FindAllBy${Capitalize<T>}`;
export type FindingType<T extends string> = FindBy<T> | FindAllBy<T>;
export type Findable<Type> = {
    [Key in keyof Type as FindingType<Key extends string ? Key : never>]: (value: any, options?: ManagedQueryOptions) => Type[Key];
};
