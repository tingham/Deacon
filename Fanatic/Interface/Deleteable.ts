import { Archetype } from "..";


export interface Deleteable<T extends Archetype> {
    Delete(id: string): string;
}
