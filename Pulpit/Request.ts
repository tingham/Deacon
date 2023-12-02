import { IncomingMessage } from "http"
import { EmptyBuffer, ExpectationFailure } from "../Sword/Error/Exception"
import { Log } from "../Sword/Inspect/Log"
import * as uuid from "uuid"
import exp from "constants"
import { Response } from "./Response"

// Request
// A subclass of native http.IncomingMessage that is extended to provide additional functionality
export class Request {
  public OriginalRequest?: IncomingMessage
  public Session?: { [key: string]: any } = {}

  public static From (request: IncomingMessage): Request {
    let result: Request = new Request()
    result.OriginalRequest = request
    return result
  }
  // Provide get methods to common request properties
  public get Method (): string {
    return this.OriginalRequest?.method || ""
  }
  public get Url (): string {
    return this.OriginalRequest?.url || ""
  }
  public get Headers (): any {
    return this.OriginalRequest?.headers || {}
  }
  // Provide a method for reading the body of the request
  // @param expectations: Set<Expectation> = new Set<Expectation>([Expectation.None])
  //   When reading a request body you can pass in a general type to hint the return type and apply validation.
  //   I don't know why you want to, but you can, and I don't care.
  public async Read (expectation: Expectation = Expectation.None, intendedName: string | [string] | undefined = undefined): Promise<Buffer | string | {[key: string]: any} | undefined> {
    // The original request contains a non-modified stream of the request body
    // We need to read the stream into a buffer and return it
    // If the buffer is a string, we can use the toString() method to return the string value
    // If the buffer is a JSON object, we can use the JSON.parse() method to return the object
    let result: Buffer | string | {[key: string]: any} | undefined = undefined
    if (this.OriginalRequest?.readable) {
      let buffer = await this.readStream(this.OriginalRequest)
      if (!buffer) {
        Log.warn("Request", `Buffer was empty`)
        throw new EmptyBuffer(`Request body was empty`)
      }
      if (expectation == Expectation.None) {
        result = buffer
      }

      try {
        if (expectation == Expectation.Text) {
          result = this.parseAsText(buffer)
        } else if (expectation == Expectation.JSON) {
          result = this.parseAsJSON(buffer)
        } else if (expectation == Expectation.Form) {
          result = this.parseAsForm(buffer)
        } else if (expectation == Expectation.File) {
          if (!intendedName) {
            throw new ExpectationFailure(`You set the expectation that the request was a File, but did not provide a name`)
          }
          result = this.parseAsFile(intendedName, buffer)
        } else if (expectation == Expectation.XML) {
          result = this.parseAsXML(buffer)
        }
      } catch (error) {
        // Get name of expectation
        Log.warn("Request", `Buffer was not ${expectation}`)
        throw error
      }
    }
    return result
  }

  parseAsXML(buffer: Buffer): string | Buffer | { [key: string]: any } | undefined {
    let stringBody = buffer.toString()
    // Parse the string as XML
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(stringBody, "application/xml")
      return doc
    } catch (error) {
      Log.warn("Request", `Buffer was not XML`)
      throw new ExpectationFailure(`Request body was either XML and you didn't want it, or was not XML and you did`)
    }
  }

  private parseAsText(buffer: Buffer): string | undefined {
    try {
      return buffer.toString()
    } catch (error) {
      Log.warn("Request", `Buffer was not Text`)
      throw new ExpectationFailure(`Request body was either Text and you didn't want it, or was not Text and you did`)
    }
  }

  private parseAsJSON(buffer: Buffer): { [key: string]: any } | [any] {
    if ((buffer?.toString().startsWith("{") || buffer?.toString().startsWith("["))) {
      return JSON.parse(buffer.toString())
    } else {
      Log.warn("Request", `Buffer was not JSON`)
      throw new ExpectationFailure(`Request body was either JSON and you didn't want it, or was not JSON and you did`)
    }
  }

  // Assumes that there is either a single file or multiple files in the request body
  // @return Array<string> Base64 encoded file contents
  // @throws ExpectationFailure
  parseAsFile(name: string | [string], buffer: Buffer): Map<string, string> {
    // Look for the boundary, then pick out the file contents by name
    if (typeof name == "string") { name = [name] }
    let stringBody = buffer.toString()
    let boundary = stringBody.substring(0, stringBody.indexOf("\r\n"))
    let parts = stringBody.split(boundary)
    let result = new Map<string, string>()
    if (parts.length == 0) {
      Log.warn("Request", `Buffer was not File`)
      throw new ExpectationFailure(`Request body was either File and you didn't want it, or was not File and you did`)
    }
    for (let part of parts) {
      if (part.startsWith("Content-Disposition")) {
        let disposition = part.substring(0, part.indexOf("\r\n"))
        let filename = disposition.substring(disposition.indexOf("filename=") + 10, disposition.length - 1)
        if (name.includes(filename)) {
          let content = part.substring(part.indexOf("\r\n\r\n") + 4, part.length - 1)
          result.set(filename, content)
        }
      }
    }
    return result
  }
  parseAsForm(buffer: Buffer): string | Buffer | { [key: string]: any } | undefined {
    throw new Error("Method not implemented.")
  }

  private readStream(stream: any): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      let result: Buffer = Buffer.from("")
      stream.on("data", (chunk: Buffer) => {
        result = Buffer.concat([result, chunk])
      })
      stream.on("end", () => {
        resolve(result)
      })
      stream.on("error", (error: any) => {
        reject(error)
      })
      return result
    })
  }
  public async GetUserId(): Promise<string> {
    return ""
  }
}

export abstract class SessionManager {

  public AllSessions: Map<string, ManagedSession<any>> = new Map<string, ManagedSession<any>>()
}

export class MemorySessionManager extends SessionManager {
  public static instance: MemorySessionManager 
  public static get Instance(): MemorySessionManager {
    if (!MemorySessionManager.instance) {
      MemorySessionManager.instance = new MemorySessionManager()
    }
    return MemorySessionManager.instance
  }
  constructor() {
    super()
    setInterval(() => {
      this.Clean()
    }, 30000)
  }

  public Has(request: Request): boolean {
    let sessionId = request.Headers.cookie?.split(";").map((s: string) => s.trim()).find((cookie: string) => cookie.startsWith("session="))?.split("=")[1]
    return sessionId && this.AllSessions.has(sessionId)
  }

  public async Create<T>(request: Request, response: Response): Promise<ManagedSession<T>> {
    let result = new ManagedSession<T>()
    result.CreatedAt = new Date()
    this.AllSessions.set(result.Id!, result)
    request.Headers.cookie = `session=${result.Id}`
    response.OriginalResponse?.setHeader("Set-Cookie", `session=${result.Id}`)
    return result
  }

  // Attach the correct session to the request
  public async Merge(request: Request, response: Response): Promise<void> {
    let sessionId = request.Headers.cookie?.split(";").find((cookie: string) => cookie.startsWith("session="))?.split("=")[1]
    let session = this.AllSessions.get(sessionId!)
    if (session) {
      request.Session = session
      response.OriginalResponse?.setHeader("Set-Cookie", `session=${session.Id}`)
    }
  }

  public async Clean(): Promise<void> {
  }
}

export class ManagedSession<T> {
  // The id of the session
  private id?: string
  public get Id(): string | undefined {
    // Generate a GUID for the session id
    if (!this.id) {
      this.id = uuid.v4()
    }
    return this.id
  }
  // public set Id (value: string | undefined) { this.id = value }

  // The user id of the user that owns the session
  private userId?: string
  public get UserId(): string | undefined { return this.userId }
  public set UserId(value: string | undefined) { this.userId = value }

  // The time at which the session expires
  private createdAt?: Date
  public get CreatedAt(): Date | undefined { return this.createdAt }
  public set CreatedAt(value: Date) {
    if (this.createdAt == null) {
      this.createdAt = value
      this.updatedAt = value
      this.expires = AddTimeInSeconds(value, 60 * 60 * 24)
      this.etl = AddTimeInSeconds(value, 300)
    }
  }
  private expires?: Date
  public get Expires(): Date | undefined { return this.expires }
  public set Expires(value: Date) { this.expires = value }

  private updatedAt?: Date
  public get UpdatedAt(): Date | undefined { return this.updatedAt }
  public set UpdatedAt(value: Date) {
    this.updatedAt = value
    this.etl = AddTimeInSeconds(value, 300)
  }

  // The time at which the session should be refreshed (from a database, for example), bound to the UpdatedAt field of the session
  // @readonly
  private etl?: Date
  public get ETL(): Date | undefined { return this.etl }

  // The data stored in the session
  private data?: T
  public get Data(): T | undefined { return this.data }
  public set Data(value: T | undefined) {
    this.data = value
    this.etl = AddTimeInSeconds(this.etl!, 60)
  }

  public GetString(key: string): string | undefined
  public GetString(key: string, defaultValue: string): string
  public GetString(...params: any[]): string | undefined {
    let key = ""
    let defaultValue = undefined
    if (params.length > 0) {
      key = params[0]
    }
    if (params.length > 1) {
      defaultValue = params[1]
    }
    if ((this.data as any).hasOwnProperty(key)) {
      return (this.data as any)[key]
    }
    return defaultValue
  }

  public GetNumber(key: string): number | undefined
  public GetNumber(key: string, defaultValue: number): number
  public GetNumber(...params: any[]): number | undefined {
    let key = ""
    let defaultValue = undefined
    if (params.length > 0) {
      key = params[0]
    }
    if (params.length > 1) {
      defaultValue = params[1]
    }
    if ((this.data as any).hasOwnProperty(key)) {
      let value = (this.data as any)[key]
      if (typeof value == "number") {
        return value
      }
    }
    return defaultValue
  }

  public GetBoolean(key: string): boolean | undefined
  public GetBoolean(key: string, defaultValue: boolean): boolean
  public GetBoolean(...params: any[]): boolean | undefined {
    let key = ""
    let defaultValue = undefined
    if (params.length > 0) {
      key = params[0]
    }
    if (params.length > 1) {
      defaultValue = params[1]
    }
    if ((this.data as any).hasOwnProperty(key)) {
      let value = (this.data as any)[key]
      if (typeof value == "boolean") {
        return value
      }
    }
    return defaultValue
  }

  public GetObject(key: string): any | undefined
  public GetObject(key: string, defaultValue: any): any
  public GetObject(...params: any[]): any | undefined {
    let key = ""
    let defaultValue = undefined
    if (params.length > 0) {
      key = params[0]
    }
    if (params.length > 1) {
      defaultValue = params[1]
    }
    if ((this.data as any).hasOwnProperty(key)) {
      return (this.data as any)[key]
    }
    return defaultValue
  }
}

// When reading a request body you can pass in a general type to hint the return type and apply validation. I don't know why you want to, but you can, and I don't care.
export enum Expectation {
  Form = "application/x-www-form-urlencoded",
  File = "multipart/form-data",
  JSON = "application/json",
  Text = "text/plain",
  XML = "application/xml",
  None = ""
}

function AddTimeInSeconds(toDate: Date, seconds: number): Date {
  return new Date(toDate.getTime() + (seconds * 1000))
}

