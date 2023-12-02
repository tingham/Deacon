// Any kind of archetype that can be constructed by the Archetypist

import { IArchetype } from "..";

// Only declares an empty constructor
export interface IArchetypeConstructor {
  new (): IArchetype;
  new (id: string): IArchetype;
}

export abstract class ArchetypeConstructable {
  private id: string
  constructor()
  constructor(id: string)
  constructor(id?: string) {
    this.id = NULL_ID;
    if (id) {
      this.id = id;
    }
  }
}

export const NULL_ID = "00000000-0000-0000-0000-000000000000" as const;
