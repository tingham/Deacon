import "reflect-metadata"
import { Archetype } from "../Serialize/Archetype"
import { NotImplementedException } from "../../Exception"
import { WhereOption } from "./WhereOption"
import { CompoundOperator } from "../../Enumerations"

export abstract class AbstractScheme {
}

// A Scheme is a business object that encapsulates several models, it is not a model itself
// Implementing classes of the Scheme are responsible for assigning a Definition to the static Definition property
// Implementing classes of the Scheme are responsible for implementing the From method that creates instances of the Scheme from a row / rows of data
// Methods that must be implemented by implementing classes of the Scheme are marked as abstract except for static methods
export abstract class Scheme extends AbstractScheme {
  // This is an actual instance, from the database, of whatever stupid thing this scheme is based on
  public abstract Root?: Archetype
}

// Implementing classes need to implement the methods that populate a Scheme instance
export class SchemeImporter {
  // Given an instance or a list of the Scheme, or an id, populate the Scheme root instance
  public ImportRoot(instanceOrId: Scheme | Scheme[] | string): void {
    throw new NotImplementedException()
  }
  // Given an instance or a list of the Scheme, or an id, populate the Scheme subordinate instances
  public ImportSubordinate(instanceOrId: Scheme | Scheme[] | string, keyPath: keyof any): void {
    throw new NotImplementedException()
  }
}

// A scheme manager is implemented by the consumer of the Scheme to:
// 1. Create a Scheme instances (AbstractSchemeFactory)
// 2. Populate the Scheme instances with data from the database (AbstractSchemeImporter)
// 3. Remove the Scheme instances from the database (AbstractSchemeKiller)
// TODO: I think that trying to encapsulate both single-instance and multi-instance methods in the same class is a mistake. Even in extreme scenarios we would have a "Tenant" on the application that owns all the root level objects; and this tenant would be in the database. So you always have some root-level singleton that owns everything; user or whatever, and then you have a collection of subordinate objects defined as relationships.
// There's just no need to overcomplicate things and make polymorphic methods that become unclear and difficult to maintain.
// If you want to "Search" a particular "Thing" then you should have a "ThingManager" that has a "Search" method that returns a list of "Thing" instances.
export class SchemeFactory extends SchemeImporter {
  public New(...params: any[]): Scheme {
    throw new NotImplementedException()
  }
  public Save(instance: Scheme | Scheme[]): void {
    throw new NotImplementedException()
  }
  public Get(idOrQuery: string | WhereOption<Archetype> | { operator: CompoundOperator, where: WhereOption<Archetype>[] }): Scheme | Scheme[] {
    throw new NotImplementedException()
  }
}

export class SchemeKiller extends SchemeFactory {
  public Delete(instanceOrId: Scheme | Scheme[] | string): void {
    throw new NotImplementedException()
  }
}

// A slightly mis-named class that really brings the room together
export class SchemeManager extends SchemeKiller {
  public static Scheme: Scheme
}

