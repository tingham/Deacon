import { Element } from "./ViewModelEntities/Element";
import { ViewModel } from "./ViewModel";
import { IModelInstanceObserver } from "./ModelInstanceObserver";

/**
 * @class IndexModel
 * @extends ViewModel
 * @discussion A view model that contains a list of items.
 **/


export abstract class IndexModel<T> extends ViewModel {
    // The list of items to display in the view.
    protected items: Array<T> = new Array<T>();
    protected columns: Array<Element> = new Array<Element>();

    public Observers: Array<IModelInstanceObserver> = new Array<IModelInstanceObserver>();
    public get Items(): Array<T> {
        return this.items;
    }
    public set Items(value: Array<T>) {
        if (this.items != value) {
            this.items = value;
            this.Observers.forEach((observer: IModelInstanceObserver) => {
                observer.InstanceModified(this);
            });
        }
    }
}
