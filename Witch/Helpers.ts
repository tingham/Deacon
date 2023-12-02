import ejs from "ejs";
import { Log } from "../Sword/Inspect/Log";

type AnyFunction = (...args: any[]) => any;

export class Helpers {
  private static instance: Helpers;
  public static get Instance(): Helpers {
    if (!Helpers.instance) {
      Helpers.instance = new Helpers();
    }
    return Helpers.instance;
  }

  // While I'm sure it is actually possible to reliably get methods from a class by string name, the last time I did it in typescript it wasn't worth the juice.
  // This also allows us to store class instances in the register, which is nice. (The AI add the 'which is nice' part, I'm not sure why but I like it)
  public Registered: Map<string, AnyFunction | IHelper> = new Map<
    string,
    AnyFunction | IHelper
  >();
  public Register(name: string, helper: AnyFunction | IHelper): void {
    this.Registered.set(name, helper);
  }

  // Consumers adopt helpers from the register by name, passing in the locals bundle by reference
  public Adopt(helpers: string[], locals: any): void {
    for (const helper of helpers) {
      if (this.Registered.has(helper)) {
        // If the helper is a function, we assume it is a function that can be called with the locals bundle as the only argument
        // If it's a class that implements IHelper, we assume it has a Perform method that can be called with the locals bundle as the only argument and we bind it to the class instance
        if (this.Registered.get(helper) as IHelper) {
          // This should result in a hoisted function that can be called in the template
          const helperInstance = this.Registered.get(helper) as IHelper;
          const fn = helperInstance.Perform;
          locals[helper] = fn.bind(helperInstance);
        } else if (this.Registered.get(helper) instanceof Function) {
          locals[helper] = this.Registered.get(helper);
        }
      }
    }
  }
}

@HelpersHelper()
export class ForEachHelper implements IHelper {
  public Template = "<vtch-index-item><%= Name %></vtch-index-item>";
  public get Name(): string {
    return this.constructor.name;
  }
  public readonly Description = "A for-loop renderer helper; this actually produces output";

  // NOTE: Dependencies might be important later
  public get Dependencies(): string[] {
    return ["ejs"];
  }

  // Arguments are the variable names expected by the perform method (in a Helpful) to assist consumers in self-documenting this stupid mousetrap
  public Arguments = { Instances: "Instances" } as const;

  public async Perform(...args: any[]): Promise<string | undefined> {
    let instances: any;
    if (args.length > 0 && args[0] instanceof Helpful) {
      for (const help of args as Helpful[]) {
        if (help.Name == this.Arguments.Instances) {
          instances = help.Value;
        }
      }
    }
    if (args.length > 0 && args[0] instanceof Array) {
      instances = args[0];
    }
    if (instances) {
      // TODO: Clean up these template references
      return this.ForInstances(this.Template, instances);
    }
    return;
  }

  // A method that encapsulates a string segment and safely iterates a collection of unknown items
  // @volatile templateText The template text to be compiled, the consumer assumes responsibility for ensuring that the template is valid
  // @param instances
  async ForInstances(
    templateText: string,
    instances: any[],
  ): Promise<string> {
    let compiledTemplate = ejs.compile(templateText);
    let result = new Array<string>();
    for (const instance of instances) {
      try {
        result.push(compiledTemplate(instance));
      } catch (error: any) {
        // We only log the error, we don't throw it because we want to continue processing the rest of the instances if we can; hopefully reporting the rendering error will assist in debugging the template (but probably not)
        Log.error(error);
      }
    }
    return result.join("");
  }
}

// An interface that can be used to store class-based helpers in Registered, if you don't like the function form
export interface IHelper {
  get Name(): string;
  get Description(): string;
  get Dependencies(): string[];

  Perform: (...args: any[]) => Promise<string | undefined>;
}

/**
 * @class Helpful
 * A general purpose dictionary-type class that can be used to send named-arguments to IHelper.Perform
 **/
export class Helpful {
  constructor(
    public Name: string,
    public Value: any,
  ) {}
}

// Helpers are functions that can be used in ejs templates, a decorator is used to mark them as helpers and automatically register them with VTCH
// This decorator is made available so that consumers can register their own helpers, or override the default helpers
export function Helper() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    if (!Helpers.Instance.Registered) {
      Helpers.Instance.Registered = new Map<string, AnyFunction>();
    }
    Helpers.Instance.Registered.set(propertyKey, descriptor.value as AnyFunction);
  };
}

// A decorator for full-on helper classes, that will add a class instance to the registered helpers
export function HelpersHelper() {
  return function (target?: any, propertyKey?: string) {
    if (!Helpers.Instance.Registered) {
      Helpers.Instance.Registered = new Map<string, AnyFunction>();
    }
    // Enforce the IHelper interface implementation
    Helpers.Instance.Registered.set(target.name, new target() as IHelper);
  };
}
