// import "reflect-metadata"
import { AbstractArchetype, Archetype, ArchetypeRegistry } from "../Model/Archetype"
import { FieldDecoratorOptions } from "./Field"
import { MixinDirective } from "../../Sword/Enum/MixinDirective"
import { ArchetypeComplianceException } from "../../Sword/Error/Exception"
import { AttachMixinMethods, AttachMixinQueries } from "../Model/Method"
import { ClassHelper } from "../../Sword/Inspect/ClassHelper"
import { Log } from "../../Sword/Inspect/Log"
import { SerializingField } from ".."
import { reflect } from "xyzw/dist/vector3"

export interface ArchetypistParameters {
  Singular: string
  Plural: string
  Key: string
  Table: string
  Mixin: MixinDirective
}

export function Archetypist(parameters: ArchetypistParameters) {
  // Return the class being modified extended by the abstract class; using an intermediate class named "Archetype"
  // @param target The class.constructor being modified
  return function (target: any, _context?: ClassDecoratorContext) {
    let reflectionTarget = target.prototype

    if (!(target.prototype instanceof Archetype)) {
      throw new ArchetypeComplianceException(`The class ${target.constructor.name} does not extend Archetype`)
    }
    // When writing to the value field of the property descriptor on a @Field we are given the following opportunity
    // let prototypeChainFields = []
    // let _sample = target.prototype
    //while (_sample != null) {
    //  Log.info("Archetypist:ownKeys", Reflect.ownKeys(_sample))
    //  for (const ff of Reflect.ownKeys(_sample)) {
    //    // By consuming and testing the identity attribute in the value field of the property descriptor we can determine if this is a thing we're interested in
    //    if (Reflect.get(_sample, ff)?.Identity == FieldDecoratorOptions.Identity) {
    //      prototypeChainFields.push({ field: ff, definition: Reflect.get(_sample, ff) })
    //    }
    //    // Log.info("Archetypist:ownKeys", Reflect.get(_sample, ff))
    //  }
    //  _sample = Object.getPrototypeOf(_sample)
    //  // New instances of target() have the value field emptied
    //}
    // [UserArchetype.Email, UserArcetype.Password] = Reflect.getOwnMetadataKeys(target.prototype.constructor.prototype)
    // Reflect.getMetadataKeys(target.prototype)
    target.Fields = []
    for (const refField of Reflect.getMetadataKeys(reflectionTarget)) {
      // let serializingField = SerializingField.FromDecoratedProperty(refField, Reflect.getMetadata(refField, target.prototype))
      target.Fields.push(Reflect.getMetadata(refField, reflectionTarget))
    }

    // Add or overwrite the static properties of the class
    if (parameters.Singular) {
      target.Singular = parameters.Singular
    }
    if (parameters.Plural) {
      target.Plural = parameters.Plural
    }
    if (parameters.Key) {
      target.Key = parameters.Key
    }
    if (parameters.Table) {
      target.Table = parameters.Table
    }
    if (parameters.Mixin) {
      target.Mixin = parameters.Mixin
    }

    // Add the class to the Archetype registry
    ArchetypeRegistry.Instance.Register(target)

    // Get the properties of the class
    const properties = ClassHelper.GetProperties(target)

    // Get the class symbol
    const classSymbol = target.name // Symbol(target.name)

    // AttachFields(target, properties, target.Fields || [])

    if (target.Mixin & MixinDirective.Query) {
      AttachMixinQueries(target, target.Fields || [])
      if (target.Mixin & MixinDirective.Method) {
        AttachMixinMethods(target, target.Fields || [])
      }
    }

    /**
    // 
    // NOTE: Does not return anything because we make these assignments by reference
    //
    **/
  }
}
