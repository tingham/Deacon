import { List } from "../../Sword/List"
import { Element } from "./Element"
import { Field } from "./Field"

export class CollectionField extends Field {
  public Collection: List<Element> = new List<Element>();
}