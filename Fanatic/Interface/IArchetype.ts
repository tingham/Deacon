import { SerializingField } from "../Model/SerializingField";
import { Archetype } from "..";
import { IRelationalDatabase } from "./IRelationalDatabase";
import { Findable } from "./Findable";
import { Creatable } from "./Creatable";
import { Deleteable } from "./Deleteable";


// Interfaces can't do statics.
export interface IArchetype {
}

export interface IArchetypeDecorated<T extends Archetype> {
  Statements: Creatable<T> & Deleteable<T> & IRelationalDatabase<T> & Findable<T>;
}
