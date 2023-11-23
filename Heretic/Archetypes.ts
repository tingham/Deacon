import { Archetypist } from "../Fanatic/Decorator/Archetypist"
import { Field } from "../Fanatic/Decorator/Field"
import { Archetype } from "../Fanatic/Model/Serialize/Archetype"
import { VTCHNode } from "../Witch/Stock"

// The User Archetype
@Archetypist("User", "id")
export class User extends Archetype {
  @Field("VARCHAR(255)")
  public Email?: string
  @Field("VARCHAR(255)")
  public Password?: string
}

// The Document Archetype
@Archetypist("Document", "id")
export class Document extends Archetype {
  @Field("VARCHAR(255)")
  public Name?: string
  @Field("TEXT")
  public Description?: string
}

// The Scene Archetype
@Archetypist("Scene", "id")
export class Scene extends Archetype {
  @Field("VARCHAR(255)")
  public Name?: string
  @Field("TEXT")
  public Description?: string
}

// The Element Archetype
@Archetypist("Element", "id")
export class Element extends Archetype {
  @Field("VARCHAR(255)")
  public Name?: string
  @Field("TEXT")
  public Description?: string
}

// The Component Base Class for Component Archetypes which exists so that we can later build a Scheme for the Component Archetype that knows how to get "All Components" or "Components by Type" etc. from a business logic perspective.
export class Component extends Archetype {
}

// The Transform Component Archetype
@Archetypist("Transform", "id")
export class Transform extends Component {
  // Origin
  @Field("FLOAT")
  public X?: number
  @Field("FLOAT")
  public Y?: number
  @Field("FLOAT")
  public Z?: number
  // Scale
  @Field("FLOAT")
  public Width?: number
  @Field("FLOAT")
  public Height?: number
  @Field("FLOAT")
  public Depth?: number
  // Rotation
  @Field("FLOAT")
  public Pitch?: number
  @Field("FLOAT")
  public Yaw?: number
  @Field("FLOAT")
  public Roll?: number
}

export enum PrimitiveType {
  None = "None",
  Cube = "Cube",
  Box = "Box",
  Sphere = "Sphere",
  Cylinder = "Cylinder",
  Cone = "Cone"
}

// The Primitive Component Archetype
@Archetypist("Primitive", "id")
export class Primitive extends Component {
  @Field(`ENUM(${Object.values(PrimitiveType).map(v => `'${v}'`).join("'")})`)
  public Type?: PrimitiveType
}

export class ActivityNode {
}

export class ApplicationModel extends Archetype {

}