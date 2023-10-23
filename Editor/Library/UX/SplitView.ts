const TAG = "deacon-splitview"
import { View, ZPriority } from "./View"
import { Debug } from "../System/Debug"
import { WindowPoint } from "../Data/Types"
export class SplitView extends View {
  public static TAG = "deacon-splitview"

  public resizeable: boolean = true
  public orientation: "horizontal" | "vertical" = "vertical"
  private resizer?: Resizer
  public sizes: number[] = []

  public static get observedAttributes() {
    return ["resizeable", "orientation"]
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "resizeable":
        this.resizeable = newValue == "true"
        break
      case "orientation":
        this.orientation = newValue == "vertical" ? "vertical" : "horizontal"
        break
      default:
        break
    }

    if (this.resizeable) {
      this.ShowResizeHandle()
    } else {
      this.HideResizeHandle()
    }

    this.UpdateLayout()
  }

  public connectedCallback() {
    super.baseConnectedCallback()

    this.style.backgroundColor = "green"

    this.attributeChangedCallback("resizeable", "", `${this.resizeable}`)
    this.attributeChangedCallback("orientation", "", `${this.orientation}`)
  }

  // Children in this view either stack horizontally or vertically and should not wrap
  private UpdateLayout() {
    let childViews = Array.from(this.children).filter(child => child instanceof View) as View[]
    this.style.display = "flex"
    this.style.flexDirection = this.orientation == "horizontal" ? "row" : "column"
    this.style.flexBasis = "100%"
    this.style.flexWrap = "nowrap"

    // Get all top level child elements that aren't resizers
    let childElements = Array.from(this.children).filter(child => !(child instanceof Resizer)) as View[]
    let weakReference = this
    childElements.forEach((child: View, childIndex: number) => {
      let size = 1 / childElements.length
      if (weakReference.sizes[childIndex] != null) {
        size = weakReference.sizes[childIndex]
      }
      child.style.flexGrow = size.toFixed(2)
    })
  }

  // Finds a set of resize handles inside of this view and sets their visibility to true or creates a new set of resize handles between every child element
  private ShowResizeHandle() {
    if (!this.resizer) {
      this.resizer = document.createElement("deacon-resizer") as Resizer

      let weakReference = this
      let startPosition: WindowPoint = new WindowPoint()
      this.RegisterEventListener("mousedown", function splitViewMouseDown (event: Event) {
        if (event as MouseEvent) {
          // If the user has clicked in a resizer element we need to start tracking the mouse position

          if (event.target instanceof Resizer) {
            startPosition = { x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY } as WindowPoint
          } else {
            console.log(`Didn't click on a resizer`)
          }
        }
      })
      this.RegisterEventListener("mouseup", (event: Event) => {
        startPosition = new WindowPoint()
      })
      this.RegisterEventListener("mousemove", (event: Event) => {
        if (!(startPosition.MinimumPoint)) {
          let resizer = weakReference.resizer
          if (resizer) {
            let resizerIndex = Array.from(weakReference.children).indexOf(resizer)
            let position = 0
            if (weakReference.orientation == "horizontal") {
              position = (event as DragEvent).clientX / weakReference.clientWidth
            } else {
              position = (event as DragEvent).clientY / weakReference.clientHeight
            }

            if (position > 0 && position < 1) {

              Debug.Instance.Track("SplitResize", `pos: ${position}, clientY: ${(event as DragEvent).clientY}, clientHeight: ${weakReference.clientHeight}`)

              weakReference.sizes[resizerIndex - 1] = position
              weakReference.sizes[resizerIndex] = 1 - position
              weakReference.UpdateLayout()

              let splitResize = new Event("splitresize")
              this.dispatchEvent(splitResize)
            }
          }
        }
      })

      //this.resizer.RegisterEventListener("drag", (event: Event) => {
      //  // When the user drags the resizer we need to update the flex-grow property of the child elements on either side of the resizer
      //  let resizer = event.target as Resizer
      //  let resizerIndex = Array.from(weakReference.children).indexOf(resizer)
      //  let position = 0
      //  if (weakReference.orientation == "horizontal") {
      //    position = (event as DragEvent).clientX / weakReference.clientWidth
      //  } else {
      //    position = (event as DragEvent).clientY / weakReference.clientHeight
      //  }

      //  if (position > 0 && position < 1) {

      //    Debug.Instance.Track("SplitResize", `pos: ${position}, clientY: ${(event as DragEvent).clientY}, clientHeight: ${weakReference.clientHeight}`)

      //    weakReference.sizes[resizerIndex - 1] = position
      //    weakReference.sizes[resizerIndex] = 1 - position
      //    weakReference.UpdateLayout()

      //    let splitResize = new Event("splitresize")
      //    this.dispatchEvent(splitResize)
      //  }
      //})

      this.insertBefore(this.resizer, this.lastChild)
    }
    this.resizer.classList.remove("hidden")
  }

  private HideResizeHandle() {
    if (this.resizer) {
      this.resizer.classList.add("hidden")
    }
  }

  constructor() {
    super()
  }
}

export class Resizer extends View {
  public static TAG = "deacon-resizer"
  override DepthPriority: ZPriority = ZPriority.Floating

  connectedCallback() {
    super.baseConnectedCallback()
    this.style.backgroundColor = "red"
  }
}

customElements.define(SplitView.TAG, SplitView)
customElements.define(Resizer.TAG, Resizer)