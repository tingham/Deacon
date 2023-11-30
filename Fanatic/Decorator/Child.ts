import { Archetype } from "../Model/Archetype";
import { HydrationRule } from "../Enumerations";

// One to One Uni-Directional
// @param childType The type of the target row that is linked to this row
// @param loadingRule The loading rule for the target row

export function Child(childType: typeof Archetype, loadingRule: HydrationRule) {
    return function(target: any, property: any) {
    };
}
