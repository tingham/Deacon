import { View } from "../UX/View"
export class Debug {

  public DebugView?: View
  private static instance?: Debug
  public static get Instance(): Debug {
    if (this.instance == null) {
      this.instance = new Debug()
    }
    return this.instance
  }

  public Track (key: string, value: any) {
    let dview = this.ensureView()
    let trackedItem = dview.querySelector(`[key="${key}"]`)
    if (!trackedItem) {
      trackedItem = document.createElement("deacon-debug")
      trackedItem.setAttribute("key", key)
      let trackedLabel = document.createElement("span")
      let trackedValue = document.createElement("span")
      trackedLabel.innerHTML = `<strong>${key}</strong>`
      trackedItem.appendChild(trackedLabel)
      trackedItem.appendChild(trackedValue)
      dview.appendChild(trackedItem)
    }
    let valueDisplay = trackedItem.querySelector("span:last-child")
    if (valueDisplay) {
      valueDisplay.innerHTML = value.toString()
    }
  }

  private ensureView() : View {
    if (!this.DebugView) {
      this.DebugView = (document.createElement("deacon-view") as View)
      document.body.appendChild(this.DebugView)
    }
    return this.DebugView
  }

}
