export class View extends HTMLElement {
  public static TAG = "deacon-view"
  public static Instances: Set<View> = new Set<View>()

  public static Layout() {
    this.SetDepths()
  }

  public static SetDepths() {
    let depthSets = new Map<string | ZPriority, Set<View>>()
    for (const depth of Object.values(ZPriority)) {
      depthSets.set(depth, new Set(Array.from(this.Instances.values()).filter(instance => instance.DepthPriority == depth)))
    }
    for (const Instance of this.Instances) {
      let depthPriority = depthSets.get(Instance.DepthPriority)
      let depthStrata = 0
      if (depthPriority) {
        depthStrata = depthPriority.size
      } else {
        depthStrata = 1
      }
      Instance.style.zIndex = `${Instance.DepthPriority * 1000 + depthStrata}`
    }
  }

  public DepthPriority: ZPriority = 0
  private RegisteredEventListeners: Map<string, EventListener> = new Map<string, EventListener>()
  public RegisterEventListener(event: string, listener: EventListener) {
    if (this.RegisteredEventListeners.has(event)) {
      let error = new Error()
      let stack = error.stack
      let signature = ""
      if (stack && stack.length > 0) {
        let stackLines = stack.split("\n")
        let callerLine = stackLines[2]
        let callerLineParts = callerLine.split(" ")
        let callerFunction = callerLineParts[5]
        let callerLineNumber = callerLineParts[6]
        signature = `${callerFunction} in ${callerLineParts[3]}:${callerLineParts[4]}:${callerLineNumber}`
      }
      throw new Error(`Event ${event} is already registered in ${signature}`)
    }
    this.RegisteredEventListeners.set(event, listener)
    this.addEventListener(event, listener)
  }
  public UnregisterEventListener(event: string) {
    let listener = this.RegisteredEventListeners.get(event)
    if (listener) {
      this.removeEventListener(event, listener)
      this.RegisteredEventListeners.delete(event)
    }
  }

  constructor() {
    super()
  }

  public connectedCallback() {
    this.baseConnectedCallback()
  }

  public baseConnectedCallback() {
    View.Instances.add(this)
  }

}

export enum ZPriority {
  Background = 0,
  Low = 1,
  Medium = 2,
  High = 3,
  Foreground = 4,
  Floating = 5
}

customElements.define("deacon-view", View)