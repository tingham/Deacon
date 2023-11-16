import { ViewModel } from "./ViewModel";

/**
 * @class TreeModel
 * @extends ViewModel
 * @discussion A view model that contains a tree of items.
 * @example
 **/


export abstract class TreeModel<T> extends ViewModel {
    // Convenience storage for the child identifier and max depth of the tree.
    protected childIdentifier: string | undefined;
    protected maxDepth: number | undefined;

    public abstract get ChildIdentifier(): string | undefined;

    // The tree can only ever grow to this depth.
    public abstract get MaxDepth(): number | undefined;

    // The list of items to display in the view.
    public Instance: any;

  constructor() {
    super();
    if (this.Helpers) {
      this.Helpers.push("ForInstances");
    }
  }
}
