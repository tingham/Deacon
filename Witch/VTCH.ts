import ejs from "ejs";
import { InvalidInstance, UnregisteredRenderer, ViewRenderError } from "../Sword/Error/Exception";
import { ViewModel } from "./ViewModel";
import { Helpers } from "./Helpers";
import { isContext } from "vm";
import { IsConcreteViewModel } from "./Imprint";

export class VTCH {
  public Template: string | Function = "";
  // The view model class must be a sub-class of the ViewModel class because ViewModel is an abstract class
  protected viewModelClass?: typeof ViewModel;

  public get ViewModelClass(): typeof ViewModel {
    if (!this.viewModelClass) {
      throw new Error(`(Portable Class Wrapper) The view model class is not defined.`);
    }
    return this.viewModelClass;
  }
  public RequestedHelpers: ReadonlyArray<string> = new Array<string>();

  public set ViewModelClass(T: typeof ViewModel) {
    this.viewModelClass = T;
  }
  public AddHelper(name: string, helper: any): void {
    Helpers.Instance.Register(name, helper);
  }

  // A Factory method that produces VTCH sub-classes that include the template text and view model type
  public static Factory(Type: new () => ViewModel, template: string | Function): typeof VTCH
  public static Factory(Type: new () => ViewModel, helpers: ReadonlyArray<string>, template: string | Function): typeof VTCH
  public static Factory(...args: Array<any>) : typeof VTCH {
    let template: string | Function, helpers: ReadonlyArray<string>, Type: typeof ViewModel;
    if (args.length == 2) {
      [Type, template] = args;
    }
    if (args.length == 3) {
      [Type, helpers, template] = args;
    }
    let concrete = class extends VTCH {
      public override Template: string | Function = template;
      public override RequestedHelpers: ReadonlyArray<string> = helpers;
      protected override viewModelClass?: typeof ViewModel = Type;
    };
    return concrete;
  }

  // Render the view using the given instance, enforcing type safety
  public async Render(viewModelInstance: ViewModel): Promise<string> {

    // NOTE: Downcasting is stupid when it is just mutability
    if (this.RequestedHelpers?.length > 0) {
      Helpers.Instance.Adopt(this.RequestedHelpers as string[], viewModelInstance);
    }
    // Override any helpers requested by the view model instance or whatever up top
    if (viewModelInstance.Helpers?.length > 0) {
      Helpers.Instance.Adopt(viewModelInstance.Helpers, viewModelInstance);
    }

    // TODO: Validate that the given instance is of the correct type based on the configuration of this anonymous VTCH sub-class
    if (!IsConcreteViewModel(viewModelInstance, this.ViewModelClass)) {
      throw new InvalidInstance(`The given instance T<${typeof viewModelInstance}> is not an instance T<${this.ViewModelClass.constructor}> of the expected type`);
    }

    // TODO: It is vital that we move this logic into the view model class so that if there are exceptions during rendering; the location can be reported and resolutions can be made much more efficiently.
    try {
      if (typeof this.Template === "string") {
        return ejs.render(this.Template, viewModelInstance, { async: true });
      }
    } catch (error: any) {
      throw ViewRenderError.FromError("string", error);
    }
    try {
      // TODO: this test might fail because the signature of the function would be a promise
      if (typeof this.Template === "function") {
        return await this.Template(viewModelInstance, { async: true });
      }
    } catch (error: any) {
      throw ViewRenderError.FromError("function", error);
    }
    throw new UnregisteredRenderer(`The view model ${this.ViewModelClass.name} is not registered with the renderer.`);
  }
}
