import { InvalidInstance } from "../Sword/Errors/Exception";
import { Element } from "./Element";
import { ViewModel } from "./ViewModel";
import { IModelInstanceObserver } from "./ModelInstanceObserver";

// @class DetailModel
// @extends ViewModel
// An abstract generic class that represents a single record or business object whose instance is enforced to be of a specific type.
// T must be newable so that we can create an instance of it.

export abstract class DetailModel<T> extends ViewModel {
    // Instance is the data object to be displayed by the view model; it is stored as a reference so that its value can be replaced and the implementing view model class can be notified of the change.
    protected instance?: T;

    public InstanceObservers: Array<IModelInstanceObserver> = new Array<IModelInstanceObserver>();

    public get Instance(): T {
        if (this.instance) {
            return this.instance;
        }
        throw new InvalidInstance(`The Instance of ${this.constructor.name} is not defined.`);
    }

    public set Instance(value: any) {
        if (this.instance != value) {
            this.instance = value;
            this.InstanceObservers.forEach((observer: IModelInstanceObserver) => {
                observer.InstanceModified(this);
            });
        }
    }
    public abstract get Fields(): Array<Element> | undefined;
}
