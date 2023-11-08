import { Archetype } from "../Model/Serialize/Archetype";
import { HydrationRule } from "../Enumerations";

// One to Many
// @param childType The target rows that are linked to this scheme's archetype

export function Children(childType: typeof Archetype, loadingRule: HydrationRule) {
    return function(target: any, property: any) {
        // Get the subclass of the Archetype that this property is attached to
        let Type = target.constructor;
        // Get the type of the property
        // Provision `Add${property}` method
        // Provision `Remove${property}` method
        // Provision `Get${property}` method
    };
}
