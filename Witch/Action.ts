import { ImprintIdentityOrphaned } from "../Sword/Errors/Exception";

/**
 * @class Action
 * @discussion A common class for the main types of actions. Actions represent verbs of a view and are generally used to produce string outputs in the form of relative urls but in some cases may define data-### attributes for use in client-side scripting.
 * A data structure that supports several different ways of representing an action.
 * @example
 * <a href="|ImprintActionInstance.Url|">|ImprintActionInstance.Label|</a>
 * <button data-action="|ImprintActionInstance.Controller|:|ImprintActionInstance.Method|">|ImprintActionInstance.Label|</button>
 * <canvas data-action="|await ImprintActionInstance.Action()|">|ImprintActionInstance.Label|</canvas>
 **/
export class Action {
    public ControllerPath: string = "";
    public MethodPath: string = "";
    public Identity: string = "";
    // Produces the final output of an action with the base class capable of producing standardized output based on known-parameters
    public async Coalesce(): Promise<string> {
        // If controller, method and identity are defined, we can produce a url.
        if (this.ControllerPath && this.MethodPath && this.Identity) {
            return `/${this.ControllerPath}/${this.MethodPath}/${this.Identity}`;
        }
        // If the controller and method are defined, we can produce a url.
        if (this.ControllerPath && this.MethodPath) {
            return `/${this.ControllerPath}/${this.MethodPath}`;
        }
        // If only controller or method are defined, and the identity is defined, we can produce a url.
        if (this.Identity) {
            if (this.ControllerPath) {
                return `/${this.ControllerPath}/${this.Identity}`;
            }
            if (this.MethodPath) {
                return `/${this.MethodPath}/${this.Identity}`;
            }
        }
        // If only the identity is defined we cannot produce a url and need to throw an error because this is a misconfiguration
        throw new ImprintIdentityOrphaned(`An ImprintAction cannot have an identity (${this.Identity}) without a controller or method.`);
    }
}
