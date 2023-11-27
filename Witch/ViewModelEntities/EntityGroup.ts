import { ViewModel } from "../ViewModel";
import { Entity } from "./Entity";

// An element that can include a collection of other elements to make up a group of elements

export class EntityGroup extends Entity {
    public Components: Array<ViewModel> = new Array<ViewModel>();
}
