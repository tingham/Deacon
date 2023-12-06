import { Archetypist, ArchetypistParameters } from "../Fanatic/Decorator/Archetypist"
import { Field, FieldDecoratorOptions } from "../Fanatic/Decorator/Field"
import { Archetype } from "../Fanatic/Model/Archetype"
import { MethodMixin, QueryMixin } from "../Fanatic/Model/Method"
import { MixinDirective } from "../Sword"

class Vector3 {
  constructor(public x: number, public y: number, public z: number) {
  }
}

class BaseRecordType extends Archetype {
  @Field({
    Type: "VARCHAR(36)",
    Nullable: false,
    PrimaryKey: true,
    Default: "(uuid())"
  } as FieldDecoratorOptions)
  public Id?: string

  // The date on which the record was created in database time
  @Field({
    Type: "DATETIME",
    Nullable: false,
    Default: "CURRENT_TIMESTAMP",
    LogicalType: Date
  } as FieldDecoratorOptions)
  public CreatedAt?: Date
  // The date on which the record was last updated in database time
  @Field({
    Type: "DATETIME",
    Nullable: false,
    Default: "CURRENT_TIMESTAMP",
    LogicalType: Date
  } as FieldDecoratorOptions)
  public UpdatedAt?: Date
  // A flag that indicates whether or not the record has been removed from use
  @Field({
    Type: "BOOLEAN",
    Nullable: false,
    Default: false
  } as FieldDecoratorOptions)
  public Deleted?: boolean

  constructor() {
    super()
  }
}


// The User Archetype
@Archetypist({ Table: "User", Key: "Id" } as ArchetypistParameters)
export class UserArchetype extends BaseRecordType {
  @Field({ Type: "VARCHAR(255)", Nullable: true } as FieldDecoratorOptions)
  public Email?: string
  @Field({ Type: "VARCHAR(255)", Nullable: true } as FieldDecoratorOptions)
  public Password?: string
}

type UserType = typeof UserArchetype & MethodMixin<UserArchetype> & QueryMixin<UserArchetype>
export const User = UserArchetype as UserType

//declare const UserAPI: Findish<Required<User>>

//UserAPI.FindAllById("19b0d457-8fe2-11ee-bcc8-c87f546a3c87")

// The Document Archetype
@Archetypist({ Table: "Document", Key: "Id", Mixin: MixinDirective.Method | MixinDirective.Query } as ArchetypistParameters)
export class DocumentArchetype extends BaseRecordType {
  @Field({ Type: "VARCHAR(255)", Nullable: true } as FieldDecoratorOptions)
  public Name: string = ""
  @Field({ Type: "TEXT", Nullable: true } as FieldDecoratorOptions)
  public Description: string = ""
}
export const Document = DocumentArchetype as typeof DocumentArchetype & Required<MethodMixin<DocumentArchetype>> & Required<QueryMixin<DocumentArchetype>>

// The Scene Archetype
@Archetypist({
  Table: "Scene",
  Key: "Id", Mixin: MixinDirective.Method | MixinDirective.Query,
  Singular: "Scene",
  Plural: "Scenes"
} as ArchetypistParameters)
export class SceneArchetype extends BaseRecordType {

  @Field({ Type: "VARCHAR(36)", Nullable: false } as FieldDecoratorOptions)
  public DocumentId?: string

  @Field({ Type: "VARCHAR(255)", Nullable: true } as FieldDecoratorOptions)
  public Name: string = ""

  @Field({ Type: "TEXT", Nullable: true } as FieldDecoratorOptions)
  public Description: string = ""

  @Field({
    Type: "JSON",
    Nullable: false,
    Default: { x: 0, y: 0, z: 0 },
    LogicalType: Vector3
  } as FieldDecoratorOptions)
  public Origin: Vector3 = new Vector3(0, 0, 0)
}
export const Scene = SceneArchetype as typeof SceneArchetype & Required<MethodMixin<SceneArchetype>> & Required<QueryMixin<SceneArchetype>>

// The Element Archetype
@Archetypist({ Table: "Element", Key: "Id" } as ArchetypistParameters)
export class ElementArchetype extends BaseRecordType {
  @Field({ Type: "VARCHAR(36)" } as FieldDecoratorOptions)
  public SceneId?: string
  @Field({ Type: "VARCHAR(255)" } as FieldDecoratorOptions)
  public Name?: string
  @Field({ Type: "TEXT" } as FieldDecoratorOptions)
  public Description?: string
}
export const Element = ElementArchetype as typeof ElementArchetype & Required<MethodMixin<ElementArchetype>> & Required<QueryMixin<ElementArchetype>>

// The Component Base Class for Component Archetypes which exists so that we can later build a Scheme for the Component Archetype that knows how to get "All Components" or "Components by Type" etc. from a business logic perspective.
export class Component extends BaseRecordType {
  @Field({ Type: "VARCHAR(36)" } as FieldDecoratorOptions)
  public ElementId?: string
  @Field({ Type: "int" } as FieldDecoratorOptions)
  public Ordinal?: string
}

// The Transform Component Archetype
@Archetypist({ Table: "Transform", Key: "Id" } as ArchetypistParameters)
export class TransformArchetype extends Component {
  // Origin
  @Field({ Type: "FLOAT" } as FieldDecoratorOptions)
  public X?: number
  @Field({ Type: "FLOAT" } as FieldDecoratorOptions)
  public Y?: number
  @Field({ Type: "FLOAT" } as FieldDecoratorOptions)
  public Z?: number
  // Scale
  @Field({ Type: "FLOAT" } as FieldDecoratorOptions)
  public Width?: number
  @Field({ Type: "FLOAT" } as FieldDecoratorOptions)
  public Height?: number
  @Field({ Type: "FLOAT" } as FieldDecoratorOptions)
  public Depth?: number
  // Rotation
  @Field({ Type: "FLOAT" } as FieldDecoratorOptions)
  public Pitch?: number
  @Field({ Type: "FLOAT" } as FieldDecoratorOptions)
  public Yaw?: number
  @Field({ Type: "FLOAT" } as FieldDecoratorOptions)
  public Roll?: number
}
export const Transform = TransformArchetype as typeof TransformArchetype & Required<MethodMixin<TransformArchetype>> & Required<QueryMixin<TransformArchetype>>

export enum PrimitiveType {
  None = "None",
  Cube = "Cube",
  Box = "Box",
  Sphere = "Sphere",
  Cylinder = "Cylinder",
  Cone = "Cone"
}

// The Primitive Component Archetype
@Archetypist({ Table: "Primitive", Key: "Id" } as ArchetypistParameters)
export class PrimitiveArchetype extends Component {
  @Field({ Type: `ENUM(${Object.values(PrimitiveType).map(v => `'${v}'`).join("'")})` } as FieldDecoratorOptions)
  public Type?: PrimitiveType
}
export const Primitive = PrimitiveArchetype as typeof PrimitiveArchetype & Required<MethodMixin<PrimitiveArchetype>> & Required<QueryMixin<PrimitiveArchetype>>

export class ActivityNode {
}

@Archetypist({ Table: "Application", Key: "Id" } as ArchetypistParameters)
export class ApplicationArchetype extends BaseRecordType {
  @Field({ Type: "VARCHAR(255)" } as FieldDecoratorOptions)
  public Title: string = "Heretic v0.0.1"

  @Field({ Type: "JSON" } as FieldDecoratorOptions)
  public Settings?: any
}
export const Application = ApplicationArchetype as typeof ApplicationArchetype & Required<MethodMixin<ApplicationArchetype>> & Required<QueryMixin<ApplicationArchetype>>
