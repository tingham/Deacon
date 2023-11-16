import { IncomingMessage } from "http"
import { EmptyBuffer, ExpectationFailure } from "../Sword/Errors/Exception"
import { Log } from "../Sword/Log"
import exp from "constants"

// Request
// A subclass of native http.IncomingMessage that is extended to provide additional functionality
export class Request {
  public OriginalRequest?: IncomingMessage
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
