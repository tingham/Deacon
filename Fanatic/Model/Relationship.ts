import { Archetype } from "./Archetype";
import { HydrationRule, RelationType } from "../Enumerations";

// One to Many
// @param childType The target rows that are linked to this scheme's archetype

export class Relationship {
    constructor(public ChildType: typeof Archetype, public LoadingRule: HydrationRule, Relation: RelationType) { }
}
