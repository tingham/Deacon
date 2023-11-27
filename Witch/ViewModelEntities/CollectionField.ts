import { List } from "../../Sword/List"
import { Entity } from "./Entity"
import { Field } from "./Field"

export class CollectionField extends Field {
  public Collection: List<Entity> = new List<Entity>();

  constructor() {
    super();
  }


}