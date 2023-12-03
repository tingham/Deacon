import "reflect-metadata"
import { Archetype, ArchetypeRegistry } from "../Model/Archetype"
import { MixinDirective } from "../../Sword/Enum/MixinDirective"
import { ArchetypeComplianceException } from "../../Sword/Error/Exception"
import { AttachFields, AttachMixinMethods, AttachMixinQueries } from "../Model/Method"
import { ClassHelper } from "../../Sword/Inspect/ClassHelper"

export interface ArchetypistParameters {
  Singular: string
  Plural: string
  Key: string
  Table: string
  Mixin: MixinDirective
}

export function Archetypist(parameters: ArchetypistParameters) {
  // Return the class being modified extended by the abstract class; using an intermediate class named "Archetype"
  return function (target: any, _context?: ClassDecoratorContext) {
    if (!(target.prototype instanceof Archetype)) {
      throw new ArchetypeComplianceException(`The class ${target.constructor.name} does not extend Archetype`)
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

    // Get the fields of the class
    let fields = target.GetFields(classSymbol)

    AttachFields(target, properties, fields || [])

    if (target.Mixin & MixinDirective.Query) {
      AttachMixinQueries(target, fields || [])
      if (target.Mixin & MixinDirective.Method) {
        AttachMixinMethods(target, fields || [])
      }
    }

    /**
    // 
    // NOTE: Does not return anything because we make these assignments by reference
    //
    **/
  }
}
