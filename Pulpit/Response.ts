import { ServerResponse, IncomingMessage } from "http"
import { Log } from "../System/Log"

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
