import { ServerResponse, IncomingMessage } from "http"
import { Log } from "../Sword/Inspect/Log"
import { extname } from "node:path/posix"

// Response
// A wrapper of native http.ServerResponse that is extended to provide additional functionality
export class Response  {
  public OriginalResponse?: ServerResponse<IncomingMessage>
  public Ended: boolean = false
  public static From (response: ServerResponse<IncomingMessage>): Response {
    let result: Response = new Response()
    result.OriginalResponse = response
    return result
  }

  public set ContentType(value: string) {
    this.OriginalResponse?.setHeader("Content-Type", value)
  }

  public SetContentTypeForAsset(path: string): void {
    let extension = extname(path)
    switch (extension) {
      case ".js":
        this.ContentType = "application/javascript"
        break
      case ".css":
        this.ContentType = "text/css"
        break
      case ".html":
        this.ContentType = "text/html"
        break
      case ".json":
        this.ContentType = "application/json"
        break
      case ".png":
        this.ContentType = "image/png"
        break
      case ".jpg":
        this.ContentType = "image/jpeg"
        break
      case ".gif":
        this.ContentType = "image/gif"
        break
      case ".svg":
        this.ContentType = "image/svg+xml"
        break
      default:
        this.ContentType = "text/plain"
        break
    }
  }

  public async Write (data: string): Promise<void> {
    if (this.Ended) {
      Log.warn("Response", "Attempted to write to a response that has already ended")
      return
    }
    this.OriginalResponse?.write(data)
  }
  public Redirect (url: string): void {
    if (this.Ended) {
      Log.warn("Response", "Attempted to write to a response that has already ended")
      return
    }
    this.OriginalResponse?.writeHead(302, {
      location: url
    })
  }

  public async End (): Promise<void> {
    this.OriginalResponse?.end()
  }
}
