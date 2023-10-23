const TAG = "deacon-view"
export class View extends HTMLElement {
  public RegisteredEvents: Map<string, EventListener> = new Map<string, EventListener>()
  public unregisterEvents() {
    // Iterate members of RegisteredEvents and unregister them from the element
    for (const key of this.RegisteredEvents.keys()) {
      this.unregister(key)
    }
  }
  public register (name: string, callback: EventListener) {
    this.RegisteredEvents.set(name, callback)
    this.addEventListener(name, callback)
  }

  public unregister(name: string) {
    this.RegisteredEvents.delete(name)
  }
}

customElements.define(TAG, View, { extends: "div" })