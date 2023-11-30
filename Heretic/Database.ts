import { Archetype, IDriver, MyDriver, Scheme } from "../Fanatic";
import { Fanatic } from "../Fanatic/Model/Fanatic";
import { Relationship } from "../Fanatic/Model/Relationship";
import { Log } from "../Sword/Log";
import { Application } from "./Application";

export class Database extends Fanatic {
  private application: Application | undefined
  public Schemes: typeof Scheme[] = [];
  public Archetypes: typeof Archetype[] = [];

  public set Driver(driver: IDriver) {
    this.driver = driver as MyDriver
  }
  public get Driver(): IDriver {
    if (!this.driver) {
      this.driver = new MyDriver("localhost:3306", "deacon", "deacon", "deacon");
      (this.driver as MyDriver).Observers.push(this.DriverReady.bind(this))
    }
    return this.driver
  }

  public async DriverReady(message: string): Promise<void> {
    if (this.application) {
      Log.info("Database:DriverReady", { message })
      this.application.DatabaseReady(message)

      // Ensure that all archetypes are available in the database
      for (let archetype of this.Archetypes) {
        await this.Driver.Provision(archetype)
      }

    }
  }

  constructor(application: Application) {
    super()
    this.application = application
  }

  // TODO: Tell schemes and archetypes how to talk to the database
  public Bless(scheme: typeof Scheme): void {
    // TODO: Check if the scheme or archetype is already blessed
    this.Schemes.push(scheme)
    if (scheme.RootArchetype) {
      this.Archetypes.push(scheme.RootArchetype)
    }
    if ((scheme as any).Metadata) {
      let children = (scheme as any).Metadata?.get(scheme.name)?.Children
      if (children) {
        for (let value of children) {
          if (value.constructor == Relationship) {
            this.Archetypes.push(value.ChildType)
          }
        }
      }
    }
    this.Schemes = this.Schemes.filter((value, index, self) => self.indexOf(value) === index )
    this.Archetypes = this.Archetypes.filter((value, index, self) => self.indexOf(value) === index)
  }
}