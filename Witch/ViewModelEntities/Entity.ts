import { SentenceCase } from "../../Sword/Generate/String"
import { ViewModelEntity } from "./ViewModelEntity"

// A single column (field) definition for consumption by a ViewModel to render a form or table (list)
export class Entity extends ViewModelEntity {
  public Label: string = ""
  public KeyPath: string = ""
  public Instance: any = {}
  public Attributes: Map<string, string> = new Map<string, string>()

  // Polymorphic factory method that produces an instance of Element based on the type of the given value
  public static Factory(value?: any): Entity
  public static Factory(keyPath?: string, value?: any): Entity
  public static Factory(keyPath?: string, label?: string, value?: any): Entity
  public static Factory(...args: Array<any>): Entity {
    let elementInstance: Entity = new Entity()

    if (args.length === 1) {
      // Just the raw value
      elementInstance.Instance = args[0]
    }

    if (args.length === 2) {
      elementInstance.KeyPath = args[0]
      // Proper-case the key path to produce a label
      elementInstance.Label = SentenceCase(args[0])
      elementInstance.Instance = args[1]
    }

    return elementInstance
  }
}
