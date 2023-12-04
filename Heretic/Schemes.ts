import { Children, HydrationRule, Scheme, SchemeManager, Schemer, Findable, Archetype } from "../Fanatic";
import { Document, Scene } from "./Archetypes";

let doc = new Document()
doc.Name = "New Document"

export class DocumentScheme extends Scheme implements IFaulting<DocumentScheme> {
  public FaultingKeypaths: Set<keyof DocumentScheme> = new Set<keyof DocumentScheme>(["Root", "Name", "Description", "Scenes"])

  public static readonly RootArchetype: typeof Archetype = Document

  public Root = new Document();

  public IsDirty = false;

  public get Name(): string | undefined {
    return this.Root.Name
  }
  public set Name(value: string) {
    if (this.Root) {
      this.Root.Name = value
      this.IsDirty = true
    }
  }

  public get Description(): string | undefined {
    return this.Root?.Description
  }
  public set Description(value: string) {
    if (this.Root) {
      this.Root.Description = value
      this.IsDirty = true
    }
  }

  public get Scenes(): Array<typeof Scene> | undefined {
    if (this.scenes == undefined) {
      this.Fault(["Scenes"])
    }
    return this.scenes
  }

  @Children(Scene, HydrationRule.Lazy)
  private scenes = new Array<typeof Scene>()

  public async Fault(keypath: (keyof DocumentScheme)[]): Promise<void> {
    // Notify observers that a fault has been raised

    // Load the data from the database

    // Notify observers that the fault has been resolved
    return
  }

  public async FaultResolved(keypath: (keyof DocumentScheme)[], withData: any): Promise<void> {
    return
  }

  public async FaultRaised(keypath: (keyof DocumentScheme)[]): Promise<void> {
    return
  }

  public static async Instance(id: string): Promise<DocumentScheme> {
    let instance = new DocumentScheme()

    let db = DocumentScheme.Database

    if (db) {

      let scene = await (Scene as Required<typeof Scene>).FindByName("Test Scene 1")
      console.log(scene)

      // TODO: Find a way in Archetypist to produce the Statements object with type info preserved
      //let findQuery = DocumentScheme.RootArchetype.Statements.FindById("19b0d457-8fe2-11ee-bcc8-c87f546a3c87")
      //Log.info(`DocumentScheme:Find Query`, findQuery)

    //  const finder: Findable<Required<Document>> = DocumentScheme.RootArchetype.Jones.Find as Findable<Required<Document>>

    //  let secondFindQuery = finder.FindByName("New Document")
    //  Log.info(`DocumentScheme:Second Find Query`, secondFindQuery)

    //  let data = await db.Driver.query(id)
    //  if (data) {
    //    console.log(data)
    //  }
      //(DocumentScheme.RootArchetype as any).NativeSelect("19b0d457-8fe2-11ee-bcc8-c87f546a3c87")
    }

    return instance
  }
}

@Schemer(DocumentScheme)
export class Documents extends SchemeManager {

}


// Defines an interface that means that an implementing class has properties that can be null; and if they are null when accessed, they will be loaded from an external source.
export interface IFaulting<T> {
  // A list of keys that may produce faults
  FaultingKeypaths: Set<keyof T>
  Fault(keypath: Array<keyof T>): Promise<void>
}

// A watcher may be attached to a faulting object to watch for changes to the object
export interface IFaultingObserver<T> {
  FaultRaised(keypath: Array<keyof T>): void
  FaultResolved(keypath: Array<keyof T>, withData: any): void
}


