import { SortKeys } from "../Sword/Inspect/Constant";
import { IndexModel } from "./IndexModel";
import { DetailModel } from "./DetailModel";
import { InterfaceConstructor } from "./ModelInstanceObserver";

// Bitwise enumerator for view model options
export enum IndexDetailFlag {
  None = 0,
  SingleSelect = 1 << 0,
  MultiSelect = 1 << 1,
  SingleEdit = 1 << 2,
  MultiEdit = 1 << 3,
  Delete = 1 << 4,
  Order = 1 << 5,
  Filter = 1 << 6,
  Duplicate = 1 << 7
}


// @class IndexDetailModel
// @extends IndexModel
// An abstract generic class that represents a list of business objects that is aware of selection and how to queue detail view models for items
// Builds upon the IndexModel class by adding a detail view model and a selection property.

export abstract class IndexDetailModel<T, D extends DetailModel<any>> extends IndexModel<T> {
    // The class of the detail view model that will be used to render the detail view.
    protected detailViewModelClass?: InterfaceConstructor<D>;
    // The options available to the template presenting the view model.
    protected flags: IndexDetailFlag = IndexDetailFlag.None;
    // The list of items that are currently selected.
    protected selection: Array<T> = new Array<T>();
    // The detail view model that is reused to display the selected item
    protected detailViewModel?: D;

    // Encapsulates the DetailModelViewClass property
    public get DetailViewModelClass(): InterfaceConstructor<D> | undefined {
        return this.detailViewModelClass;
    }
    public set DetailViewModelClass(value: InterfaceConstructor<D> | undefined) {
        this.detailViewModelClass = value;
    }

    // Encapsulates the Flags property
    public get Flags(): IndexDetailFlag {
        return this.flags;
    }
    public set Flags(value: IndexDetailFlag) {
        this.flags = value;
    }

    // Encapsulates the Selection property
    public get Selection(): Array<T> {
        return this.selection;
    }
    public set Selection(value: Array<T>) {
        this.selection = value;
    }

    // Encapsulates the DetailViewModel property
    public get DetailViewModel(): D | undefined {
        return this.detailViewModel;
    }
    public set DetailViewModel(value: D | undefined) {
        this.detailViewModel = value;
    }

    // Selection Management
    public Select(item: T): void {
        if (this.CanHasFlag(IndexDetailFlag.SingleSelect)) {
            this.selection = new Array<T>();
        }
        this.selection.push(item);
    }

    public Deselect(item: T): void {
        this.selection = this.selection.filter((value: T) => {
            return value != item;
        });
    }

    public Move(item: T, delta: number): void {
        let index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            this.items.splice(index + delta, 0, item);
        }
        // Iterate all items in selection and if they have a native property in [Order, Ordinal, Sort, Index, Indice] then update it to reflect the new order
        for (const item of this.items as Array<any>) {
            let index = this.items.indexOf(item);
            SortKeys.forEach((sortable: string) => {
                if (item[sortable]) {
                    item[sortable] = index;
                }
            });
        }
    }

    public Promote(item: T, offset: number): void {
        this.Move(item, -1);
    }

    public Demote(item: T, offset: number): void {
        this.Move(item, 1);
    }

    public CanHasFlag(flag: IndexDetailFlag): boolean {
        return (this.flags & flag) == flag;
    }
}
