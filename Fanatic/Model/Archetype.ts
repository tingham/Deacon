import { IDriver, MyDriver, SerializingField } from "..";
import { MixinDirective } from "../../Sword/Enum/MixinDirective";
import { NotImplementedException } from "../../Sword/Error/Exception";
import { IDrivable } from "../Interface/IDrivable";

// A set of symbols that, if identified as the class of a current subclass, will be ignored when adding fields to the class
const DisallowedSymbols = [Symbol("Archetype"), Symbol("AbstractArchetype")]

// The base constructor for all Archetype classes
type ArchetypeConstructor<T> = abstract new(...args: any[]) => T;

/**
 * The foundation of the Archetype system
 **/
export abstract class AbstractArchetype {
  // Fields have been hoisted to the static level so that their metadata is centralized and can be used to create sql statements
  public static Fields: {[key: string]: SerializingField[]} = {};
  public static Singular: string = "Archetype";
  public static Plural: string = "Archetypes";
  public static Key: string = "Id";
  public static Table: string = "Archetype";
  public static Mixin: MixinDirective = MixinDirective.None;

  // Add a field to the static field collection for the class as long as the direct constructor is not a disallowed symbol
  public static AddField(forClass: string, field: SerializingField) {
    throw new NotImplementedException()
  }

  private initialArguments: any[] = []

  // A default constructor
  constructor(...args: any[]) {
    this.initialArguments = args || []
  }
}

function ArchetypeMixin<T extends ArchetypeConstructor<object>>(Ctor: T) {
  abstract class ConcreteArchetype extends Ctor {
    // @private
    public static Fields: { [key: string]: SerializingField[] } = {};
    public static AddField(forClass: string, field: SerializingField) {
      //if (DisallowedSymbols.includes(forClass)) { return }
      if (!this.Fields[forClass]) {
        this.Fields[forClass] = [];
      }
      this.Fields[forClass].push(field);
    }
    public static GetFields(forClass: string) {
      return this.Fields[forClass] || []
    }
    constructor(...args: any[]) {
      super(...args)
    }
  }
  // You have no visibility of the sub-class at this stage in the object lifecycle; so we have to use a @ decorator to gain access to the higher-order features of the class
  const initialProperties = Object.getOwnPropertyNames(Ctor.prototype)
  for (const property of initialProperties) {
    if (property === "constructor") { continue }
    // For merging two classes together
    // Object.defineProperty(ConcreteArchetype.prototype, property, Object.getOwnPropertyDescriptor(Ctor.prototype, property)!)
  }
  return ConcreteArchetype
}


export class Archetype extends ArchetypeMixin(AbstractArchetype) implements IDrivable {
  public static DriverClass: typeof MyDriver = MyDriver
  public static get Driver(): IDriver {
    return this.DriverClass.Instance
  }
  public get Driver(): IDriver {
    return Archetype.Driver
  }
  public static async Query(sql: string): Promise<any> {
    return this.Driver.query(sql)
  }
  public async Query(sql: string): Promise<any> {
    return Archetype.Query(sql)
  }
  public static async Execute(sql: string): Promise<any> {
    return this.Driver.execute(sql)
  }
  public async Execute(sql: string): Promise<any> {
    return Archetype.Execute(sql)
  }

  constructor(...args: any[]) {
    super(...args)
    for (const prop of Object.getOwnPropertyNames(AbstractArchetype)) {
      if (prop === "constructor") { continue }
      Object.defineProperty(this, prop, Object.getOwnPropertyDescriptor(AbstractArchetype, prop)!)
    }
  }
}

/**
 * A manager for the Archetype system
 **/
export class ArchetypeRegistry {
  // Singleton pattern
  private static instance: ArchetypeRegistry
  public static get Instance() {
    if (!ArchetypeRegistry.instance) {
      ArchetypeRegistry.instance = new ArchetypeRegistry()
    }
    return ArchetypeRegistry.instance
  }
  private constructor() { }

  // A collection of all the Archetype classes that have been registered
  private archetypes: Map<string, ArchetypeConstructor<Archetype>> = new Map<string, typeof Archetype>()
  public Register(archetype: typeof Archetype) {
    this.archetypes.set(archetype.constructor.name, archetype)
  }
  public Deregister(archetype: Archetype) {
    this.archetypes.delete(archetype.constructor.name)
  }
  // If both are registered and the same, return true
  public Is(a: Archetype, b: Archetype) {
    return this.archetypes.get(a.constructor.name) === this.archetypes.get(b.constructor.name)
  }
}

