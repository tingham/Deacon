import { Turnstyle } from "./Pew"
import { MaskedPath, PathElement, PathMaskStyle } from "./Processing"
import { Request } from "./Request"
import { Response } from "./Response"

// A collection of sub-classes of Route objects make up the application
export abstract class AbstractRoute {
  // A symbolic template for the path of the route
  public abstract get Path (): string

  // A hierarchical collection of sub-routes
  public abstract get Handlers(): RouteHandler[]
}

// A concrete implementation of the Route class that serves most purposes but lacks complexity
export class Route extends AbstractRoute {
  // A symbolic template for the path of the route
  public Path: string = ""
  public MaskedPathInstance: MaskedPath = new MaskedPath("", PathMaskStyle.NONE)
  // A hierarchical collection of sub-routes
  public Handlers: RouteHandler[] = []

  // Takes a string, which is simple, and easy to understand; or a structured object and returns a Map of PathElements
  public Mask(token: string): any {
    // Get the value of the path element from the maskedpath instance if it exists
    let pathElement = this.MaskedPathInstance.MappedElements.get(token)
    if (pathElement) {
      return pathElement.Value
    }
  }

  // Produces a new route to which handlers can be added for a given method
  public static Generate (path: string, maskStyle: PathMaskStyle): Route {
    let maskedPath = new MaskedPath(path, maskStyle)
    let result: Route = new class extends Route {
      public Path: string = path
      public MaskedPathInstance: MaskedPath = maskedPath
      public Handlers: RouteHandler[] = []
    }
    return result
  }

  // Attaches a handler to a route for a given method
  public Attach (method: RouteMethod, handler: (request: Request, response: Response, context: Route) => Promise<Turnstyle>): Route {
    let routeHandler = RouteHandler.Generate(method, handler)
    this.Handlers.push(routeHandler)
    return this
  }
}

// RouteHandler
// A monoid class that is extended to arbitrate a singular incoming path request for a given method
export abstract class RouteHandler {
  public abstract get Method (): RouteMethod
  public abstract handle (request: Request, response: Response, context: Route):  Promise<Turnstyle>
  constructor () {}

  public static Generate (method: RouteMethod, handler: (request: Request, response: Response, context: Route) => Promise<Turnstyle>): RouteHandler {
    let result: RouteHandler = new class extends RouteHandler {
      public Method: RouteMethod = method
      public handle = handler
    }
    return result
  }
}

export enum RouteMethod {
  GET = "GET",
  POST = "POST"
}