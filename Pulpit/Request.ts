import { IncomingMessage } from "http"
import { Log } from "../System/Log"

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
  public async Read (): Promise<Buffer | string | {[key: string]: any} | undefined> {
    // The original request contains a non-modified stream of the request body
    // We need to read the stream into a buffer and return it
    // If the buffer is a string, we can use the toString() method to return the string value
    // If the buffer is a JSON object, we can use the JSON.parse() method to return the object
    let result: Buffer | string | {[key: string]: any} | undefined = undefined
    if (this.OriginalRequest?.readable) {
      let buffer = await this.readStream(this.OriginalRequest)
      if (buffer) {
        result = buffer.toString()
        Log.info("Request", `Buffer was ${result}`)
      } else {
        Log.warn("Request", `Buffer was empty`)
      }
    }
    if (result?.toString().startsWith("{")) {
      result = JSON.parse(result.toString())
    } else if (result?.toString().startsWith("[")) {
      result = JSON.parse(result.toString())
    }
    return result
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
