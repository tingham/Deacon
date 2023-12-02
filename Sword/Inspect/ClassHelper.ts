import { Scoping } from "../Enum/Scoping"

// Decompose PropertyDescriptor and inject name and type(if available)
export interface Property {
  Scope: Scoping,
  Name: string
  Type: string
  Value: any
  Writable?: boolean
  Get?: () => any
  Set?: (value: any) => void
  Configurable?: boolean
  Enumerable?: boolean
  Reference: PropertyDescriptor
}

export class ClassHelper {
  public static GetProperties(ofClassOrInstance: any): Property[] {
    let result: Property[] = []
    // Is the object passed a class or an instance?
    if (ofClassOrInstance.prototype) {
      // It's a class
      result = this.GetPropertiesFrom(ofClassOrInstance, Scoping.Class)
      let instance = new ofClassOrInstance()
      result = result.concat(this.GetPropertiesFrom(instance, Scoping.Instance))
    } else {
      // It's an instance
      result = this.GetPropertiesFrom(ofClassOrInstance.constructor.prototype, Scoping.Class)
      result = result.concat(this.GetPropertiesFrom(ofClassOrInstance, Scoping.Instance))
    }
    return result
  }

  public static GetPropertiesFrom(something: any, scope: Scoping): Property[] {
    let properties = Object.getOwnPropertyDescriptors(something)
    let result: Property[] = []
    for (const prop of Object.keys(properties)) {
      result.push({
        Scope: scope,
        Name: prop,
        Type: typeof properties[prop].value,
        Value: properties[prop].value,
        Writable: properties[prop].writable,
        Get: properties[prop].get,
        Set: properties[prop].set,
        Configurable: properties[prop].configurable,
        Enumerable: properties[prop].enumerable,
        Reference: properties[prop]
      })
    }
    return result
  }
}
