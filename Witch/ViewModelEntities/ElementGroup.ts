import { ViewModel } from "../ViewModel";
import { Element } from "./Element";

// An element that can include a collection of other elements to make up a group of elements

export class ElementGroup extends Element {
    public Components: Array<ViewModel> = new Array<ViewModel>();
}
