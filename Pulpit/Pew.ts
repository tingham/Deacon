 import { IncomingMessage, ServerResponse, Server } from "http"
 import { Route } from "./Routing"
 import { Request } from "./Request"
 import { Response } from "./Response"
 import { PathMaskStyle } from "./Processing"
 import { Log } from "../Sword/Log"

 export enum Turnstyle {
        Continue = 0,
        Stop = 1,
        Missing = 2
 }

export class Pew {

    // The http server instance
    private service?: Server

    // The style of path matching to be used by the application
    private maskStyle: PathMaskStyle
    
    // The port on which the http server will listen, if unset the http server will not be started
    private httpPort: number

    // The port on which the web socket server will listen, if unset the web socket server will not be started
    private webSocketPort: number

    // A map of template strings to route instances
    private routingTable: Map<string, Route> = new Map<string, Route>()

    constructor (maskStyle: PathMaskStyle)
    constructor (maskStyle: PathMaskStyle, httpPort: number) 
    constructor (maskStyle: PathMaskStyle, httpPort: number, webSocketPort: number) 
    constructor (...args: any[]) {
        // Delayed entry
        this.maskStyle = PathMaskStyle.NONE
        this.httpPort = 0
        this.webSocketPort = 0

        if (args.length > 0 && args[0] && args[0] as  PathMaskStyle) {
            this.maskStyle = args[0]
        }
        if (args.length > 1 && args[1] && args[1] as number) {
            this.httpPort = args[1]
        }
        if (args.length > 2 && args[2] && args[2] as number) {
            this.webSocketPort = args[2]
        }
    }

    public  AddRoute(template: string): Route {
        if (this.routingTable.has(template)) {
            return this.routingTable.get(template) as Route
        }
        let route = Route.Generate(template, this.maskStyle)
        this.routingTable.set(template, route)
        return route
    }

    public GetApplicableRoutes(actualUrl: string): Array<Route> {
        let result = new Array<Route>()
        let allRoutes = Array.from(this.routingTable.values())
        for (const route of allRoutes) {
            // If the comparison of the requested route and the template of this route line up
            if (route?.MaskedPathInstance?.Test(actualUrl)) {
                // Add to the list of processable routes
                result.push(route)
            }
        }
        return result
    }

    // Retrieve the matching routes for the given template and method and execute them in order until we receive a stop code
    public async ExecuteRoute(actualUrl: string, request: Request, response: Response): Promise<Turnstyle> {
        // Look at the routing table to find routes that match the actual request url scheme
        // What are the characteristics of a matching route as fulfilled by the Mask.MappedElements?
        // TODO: Add a variable match predicate
        let routes = this.GetApplicableRoutes(actualUrl)
        if (!routes || routes.length === 0) {
            // No route assigned to this url
            return Turnstyle.Missing
        }

        for (let route of routes) {
            for (let handler of route.Handlers) {
                if (handler.Method === request.Method) {
                    let mappedMask = route.MaskedPathInstance.Match(actualUrl)
                    let turn = await handler.handle(request, response, route)
                    if (turn === Turnstyle.Stop) {
                        response.End()
                        return Turnstyle.Stop
                    }
                }
            }
        }
        return Turnstyle.Stop
    }

    public async Start(): Promise<void> {
        // Curried reference to this
        const self = this
        // Open http server and listen for requests
        this.service = new Server(async (request, response) => {
            // Process request
            await self.Process(request, response)
        })
        this.service?.on("error", (error) => {
            Log.error(error)
        })
        this.service?.on("listening", () => {
            Log.info("Pew", `Listening on port ${self.httpPort}`)
        })
        this.service?.listen(this.httpPort)
    }

    // Elevate request and response to the internal types; then resolve the request url and method to a compatible route
    public async Process(originalRequest: IncomingMessage, originalResponse: ServerResponse<IncomingMessage>) {
        let request = Request.From(originalRequest)
        let response = Response.From(originalResponse)
        if (request.Url === undefined) {
            response.Write(`The request url is undefined`)
            return response.End()
        }
        let turn = await this.ExecuteRoute(request.Url, request, response)
        if (turn != Turnstyle.Stop) {
            // Get the string rep of turn
            let turnString = Turnstyle[turn]
            response.Write(`The requested route is not defined ${turnString}`)
            return response.End()
        }
    }
}