export type InterfaceConstructor<T> = new (...args: any[]) => T;

// @interface IInstanceObserver
// When the value of a model instance changes, the implementing view model class can be notified of the change.
// A constructor method so that we can store delegates in an array and call them later.
export interface IModelInstanceObserver {
    InstanceModified(sender: any): void;
}
