import { Request, Response, Route, RouteMethod, PathMaskStyle, Pew, Turnstyle} from '../Pulpit/index';
import {Log} from "../System/Log"

export class Application  extends Pew {
    constructor() {
        super(PathMaskStyle.COLON, 8080, 8081)
    }
}

const appInstance = new Application()

let index = appInstance.AddRoute("/")

index.Attach(RouteMethod.GET, async (request: Request, response: Response, context: Route):  Promise<Turnstyle> => {
    response.Write(`Hello, World!`)
    return Turnstyle.Stop
})

let artifact = appInstance.AddRoute("/artifact/:artifactId")

artifact.Attach(RouteMethod.GET, async (request: Request, response: Response, context: Route):  Promise<Turnstyle> => {
    response.Write(`The message is ${artifact.Mask.MappedElements.get("artifactId")?.Value}`)
    return Turnstyle.Stop
})

artifact.Attach(RouteMethod.POST, async (request: Request, response: Response, context: Route):  Promise<Turnstyle> => {
    response.Write(`The message is ${artifact.Mask.MappedElements.get("artifactId")?.Value}`)
    let body = await request.Read()
    Log.info("Application", {body})
    response.Write(body? JSON.stringify(body, null, 2) : `Empty Body`)
    return Turnstyle.Stop
})

appInstance.Start()