import type { Vector3 } from "xyzw/dist/vector3"
import { Archetypist } from "../Fanatic/Decorator/Archetypist"
import { Field } from "../Fanatic/Decorator/Field"
import { Archetype, IMagicMethodable } from "../Fanatic/Model/Archetype"
import { Log } from "../Sword/Log"
import { VTCHNode } from "../Witch/Stock"

class BaseRecordType extends Archetype {
  // The date on which the record was created in database time
  @Field("DATETIME")
  public CreatedAt?: Date
  // The date on which the record was last updated in database time
  @Field("DATETIME")
  public UpdatedAt?: Date
  // A flag that indicates whether or not the record has been removed from use
  @Field("BOOLEAN")
  public Deleted?: boolean

  constructor() {
    super()
  }
}

// The User Archetype
@Archetypist("User", "id")
export class User extends BaseRecordType {
  @Field("VARCHAR(36)")
  public Id?: string
  @Field("VARCHAR(255)")
  public Email?: string
  @Field("VARCHAR(255)")
  public Password?: string
}

// The Document Archetype
@Archetypist("Document", "id")
export class Document extends BaseRecordType {
  @Field("VARCHAR(36)")
  public Id?: string
  @Field("VARCHAR(36)")
  public UserId?: string
  @Field("VARCHAR(255)")
  public Name?: string
  @Field("TEXT")
  public Description?: string
}

// The Scene Archetype
@Archetypist("Scene", "id")
export class Scene extends BaseRecordType {
  @Field("VARCHAR(36)")
  public Id?: string

  @Field("VARCHAR(36)")
  public DocumentId?: string

  public static Plural = "Scenes"
  public static Singular = "Scene"
  @Field("VARCHAR(255)")
  public Name?: string
  @Field("TEXT")
  public Description?: string
  @Field("JSON")
  public Origin?: Vector3
}

// The Element Archetype
@Archetypist("Element", "id")
export class Element extends BaseRecordType {
  @Field("VARCHAR(36)")
  public Id?: string
  @Field("VARCHAR(36)")
  public SceneId?: string
  @Field("VARCHAR(255)")
  public Name?: string
  @Field("TEXT")
  public Description?: string
}

// The Component Base Class for Component Archetypes which exists so that we can later build a Scheme for the Component Archetype that knows how to get "All Components" or "Components by Type" etc. from a business logic perspective.
export class Component extends BaseRecordType {
  @Field("VARCHAR(36)")
  public Id?: string
  @Field("VARCHAR(36)")
  public ElementId?: string
  @Field("int")
  public Ordinal?: string
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