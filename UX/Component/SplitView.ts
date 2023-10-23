import { View } from "./View"

const TAG = "deacon-splitview"

export class SplitView extends HTMLElement {
  public orientation: string = "horizontal"
  public resizeable: boolean = true

  private resizeHandle?: View

  public static get observedAttributes() {
    return ["orientation", "resizeable"]
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "orientation") {
      this.orientation = newValue
    }
    if (name == "resizeable") {
      this.resizeable = newValue === "true"
    }
  }

  onConnectedCallback() {
    this.style.backgroundColor = "red"
  }

  private updateResizeHandle() {
    if (this.resizeable) {
      this.showResizeHandle()
    } else {
      this.hideResizeHandle()
    }
  }

  private showResizeHandle() {
    if (!this.resizeHandle) {
      this.resizeHandle = new View()
      if (this.children.length > 1) {
        this.insertBefore(this.resizeHandle, this.children[1])
      } else {
        this.appendChild(this.resizeHandle)
      }
    }
  }
  private hideResizeHandle() {
    if (this.resizeHandle) {
      this.resizeHandle.unregisterEvents()
      this.removeChild(this.resizeHandle)
      this.resizeHandle = undefined
    }
  }
}

customElements.define(TAG, SplitView, { extends: "div" })