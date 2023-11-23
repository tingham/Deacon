import { SentenceCase } from "../../Sword/String"
import { ViewModelEntity } from "./ViewModelEntity"

// A single column (field) definition for consumption by a ViewModel to render a form or table (list)
export class Element extends ViewModelEntity {
  public Label: string = ""
  public KeyPath: string = ""
  public Instance: any = {}

  // Polymorphic factory method that produces an instance of Element based on the type of the given value
  public static Factory(value?: any): Element
  public static Factory(keyPath?: string, value?: any): Element
  public static Factory(keyPath?: string, label?: string, value?: any): Element
  public static Factory(...args: Array<any>): Element {
    let elementInstance: Element = new Element()
    if (args.length == 1) {
      // Just the raw value
      elementInstance.Instance = args[0]
    }
    if (args.length == 2) {
      elementInstance.KeyPath = args[0]
      // Proper-case the key path to produce a label
      elementInstance.Label = SentenceCase(args[0])
      elementInstance.Instance = args[1]
    }

    return elementInstance
  }
}

export interface IRenderable {
  get Template () : string
}

export interface IHTMLRenderable extends IRenderable {
  get HTML(): string
}
