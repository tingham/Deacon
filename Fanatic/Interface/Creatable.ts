import { Archetype } from "..";


export interface Creatable<T extends Archetype> {
    Create(...args: any[]): string;
}
