import { Request, Response, Route, RouteMethod, PathMaskStyle, Pew, Turnstyle} from '../Pulpit/index';
import { VTCH, DetailModel, IndexDetailModel, Action, Element, IndexDetailFlag } from '../Witch/index';
import { Scheme } from "../Fanatic/index"
import { ApplicationModel } from "./Archetypes"
import { ApplicationScheme } from "./Schemes"
import {Log} from "../Sword/Log"
import { VTCHNode } from '../Witch/Stock';
import { GenerateRandomInstance } from '../Sword/Generator';

export class Application  extends Pew {
  public Schemes: Array<Scheme> = new Array<Scheme>()

  public Scheme?: ApplicationScheme
  constructor() {
    super(PathMaskStyle.COLON, 8080, 8081)

    // The application scheme contains the main controller logic for the application
    this.Scheme = new ApplicationScheme()
  }
}

const appInstance = new Application()

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

appInstance.Start()