import { Archetype } from "../Model/Archetype";
import { HydrationRule } from "../Enumerations";

// Many to Many with a join table
// @param subscriptionType The target row that is linked to this row
// @param brokerType The join table that links the two rows
// @param loadingRule The loading rule for the target row

export function Subscriber(subscriptionType: typeof Archetype, brokerType: typeof Archetype, loadingRule: HydrationRule) {
    return function(target: any, property: any) {
    };
}
