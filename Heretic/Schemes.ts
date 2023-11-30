import { Children, HydrationRule, Magic, Scheme, SchemeManager, Schemer } from "../Fanatic";
import { Document, Scene } from "./Archetypes";

@Magic(Scene)
export class DocumentScheme extends Scheme implements IFaulting<DocumentScheme> {
  public FaultingKeypaths: Set<keyof DocumentScheme> = new Set<keyof DocumentScheme>(["Root", "Name", "Description", "Scenes"])

  public static RootArchetype = Document

  public Root?: Document | undefined;
  public IsDirty = false;

  public get Name(): string | undefined {
    return this.Root?.Name
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

  public get Scenes(): Array<Scene> | undefined {
    if (this.scenes == undefined) {
      this.Fault(["Scenes"])
    }
    return this.scenes
  }

  @Children(Scene, HydrationRule.Lazy)
  private scenes?: Array<Scene>

  public async Fault(keypath: (keyof DocumentScheme)[]): Promise<void> {
    return
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


