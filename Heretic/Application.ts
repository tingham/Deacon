import { Request, Response, Route, RouteMethod, PathMaskStyle, Pew, Turnstyle} from '../Pulpit/index';
import { Scheme } from "../Fanatic/index"
import { HDocument, Scene } from "./Archetypes"
import { ApplicationScheme } from "./ApplicationScheme";
import {Log} from "../Sword/Inspect/Log"
import { VTCHNode } from '../Witch/Stock';
import { GenerateRandomInstance } from '../Sword/Generate/Generator';
import { DocumentScheme, Documents } from './Schemes';
import { Fanatic } from '../Fanatic/Model/Fanatic';
import { Database } from './Database';

export class Application  extends Pew {
  public db: Database
  public Schemes: Array<Scheme> = new Array<Scheme>()
  public AppDocumentScheme: DocumentScheme = new DocumentScheme() as DocumentScheme
  public Scheme?: ApplicationScheme

  constructor() {
    super(PathMaskStyle.COLON, 8080, 8081)

    // The application scheme contains the main controller logic for the application
    this.Scheme = new ApplicationScheme()

    this.AppDocumentScheme.Root = new HDocument()

    // this.AppDocumentScheme.AddScenes([new Scene()])
    // This will error in edit time
    // this.AppDocumentScheme.BobJones([new Scene(), new Scene()])
    // This will error in runtime
    // this.AppDocumentScheme.AddSlaves([new Scene(), new Scene()])
    Log.info("Application", this.AppDocumentScheme)

    this.db = new Database(this)
    this.db.Bless(ApplicationScheme)
    this.db.Bless(DocumentScheme)

    let document = DocumentScheme.Instance("19b0d457-8fe2-11ee-bcc8-c87f546a3c87")

    // this.AppDocumentScheme.Addarchetype(this.AppDocumentScheme.Root)
  }

  public static async Initialize(): Promise<Application> {
    let app = new Application()
    await app.db.Driver.connect()
    return app
  }

  public DatabaseReady(message: string) {
    Log.info("Application:DatabaseReady", {message})
  }
}

const appInstance = await Application.Initialize()

// What do we need to make view output?

// 1. We need an imprint (a concrete viewmodel) class to display a list of shit and a detail of a selection
// 2. We need a collection of instances to render
// 3. We need a helper

let index = appInstance.AddRoute("/")
index.Attach(RouteMethod.GET, async (request: Request, response: Response, context: Route): Promise<Turnstyle> => {
  let result = ""
  if (appInstance.Scheme) {
    result = await appInstance.Scheme.Index(request.Session?.Id)
  }
  response.Write(result)
  return Turnstyle.Stop
})

let artifact = appInstance.AddRoute("/artifact/:artifactId")
artifact.Attach(RouteMethod.GET, async (request: Request, response: Response, context: Route):  Promise<Turnstyle> => {
    response.Write(`The message is ${artifact.MaskedPathInstance.MappedElements.get("artifactId")?.Value}`)
    response.Write(`The fancy utility method used to get the message produced ${artifact.Mask("artifactId")}`)
    return Turnstyle.Stop
})
artifact.Attach(RouteMethod.POST, async (request: Request, response: Response, context: Route):  Promise<Turnstyle> => {
    response.Write(`The message is ${artifact.MaskedPathInstance.MappedElements.get("artifactId")?.Value}`)
    let body = await request.Read()
    Log.info("Application", {body})
    response.Write(body? JSON.stringify(body, null, 2) : `Empty Body`)
    return Turnstyle.Stop
})

let activity = appInstance.AddRoute("/Activity/:activityName/:identity")
activity.Attach(RouteMethod.GET, async (request: Request, response: Response, context: Route): Promise<Turnstyle> => {
  let activityName = activity.MaskedPathInstance.MappedElements.get("activityName")?.Value
  let identity = activity.MaskedPathInstance.MappedElements.get("identity")?.Value
  Log.info("Application", {activityName, identity})
  if (activityName == "Open" && identity == "~") {
    // Open the default document from the database
    let documentId = 1
  }
  return Turnstyle.Stop
})

appInstance.Start()