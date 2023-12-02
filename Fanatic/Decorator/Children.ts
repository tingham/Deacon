import { Archetype } from "../Model/Archetype";
import { HydrationRule } from "../Enum/HydrationRule";
import { RelationType } from "../Enum/RelationType";
import { Relationship } from "../Model/Relationship";

export function Children(ChildType: typeof Archetype, LoadingRule: HydrationRule) {
  return function (classPrototype: any, property: any) {

    // Get the subclass of the Archetype that this property is attached to
    let Type = classPrototype.constructor;
    const classSymbol = Type.name;
    if (!((Type as any).Metadata)) {
      Type.Metadata = new Map<string, any>();
      Type.Metadata.set(classSymbol, { "Children": [], "Child": [], "Peer": [], "Subscriber": [] });
    }
    Type.Metadata.get(classSymbol)?.Children?.push(new Relationship(ChildType, LoadingRule, RelationType.Many));

    // Get the type of the property
    // Provision `Add${property}` method
    Type.prototype[`Add${property}`] = async function (...params: any[]) {
    };

    // Provision `Remove${property}` method
    Type.prototype[`Remove${property}`] = async function (...params: any[]) {
    };

    // Provision `Get${property}` method
    Type.prototype[`Get${property}`] = async function (...params: any[]) {
    };

    return classPrototype;

  };
}
