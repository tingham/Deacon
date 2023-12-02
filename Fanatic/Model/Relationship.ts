import { Archetype } from "./Archetype";
import { HydrationRule } from "../Enum/HydrationRule";
import { RelationType } from "../Enum/RelationType";

// One to Many
// @param childType The target rows that are linked to this scheme's archetype

export class Relationship {
    constructor(public ChildType: typeof Archetype, public LoadingRule: HydrationRule, Relation: RelationType) { }
}
