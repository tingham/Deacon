import { Action, DetailModel, Entity, IndexDetailModel } from "../Witch";
import { ActivityNode } from "./Archetypes";

export class ApplicationActivityImprint extends DetailModel<ActivityNode> {

  public Name: string = ""
  public Description: string = ""
  public ActivityAction: Action = new Action()

  public get Fields(): Entity[] | undefined {
    return [
      Entity.Factory("Name", null),
      Entity.Factory("Description", null)
    ]
  }
  public get Title(): string | undefined {
    return this.title;
  }
  public get PluralName(): string | undefined {
    return "ACtivities";
  }
  public get SingularName(): string | undefined {
    return "Activity";
  }
  public get AddAction(): Action | undefined {
    throw new Error("Method not implemented.");
  }
}

export class MainImprint extends IndexDetailModel<ActivityNode, ApplicationActivityImprint> {
  public HTML: string | undefined
  public CSS: string | undefined
  public Counter: number = 0

  public get Title(): string | undefined {
    return this.title;
  }
  public get Description(): string | undefined {
    return this.description;
  }
  public get PluralName(): string | undefined {
    return "Applications";
  }
  public get SingularName(): string | undefined {
    return "Application";
  }
  public get AddAction(): Action | undefined {
    throw new Error("Method not implemented.");
  }
}