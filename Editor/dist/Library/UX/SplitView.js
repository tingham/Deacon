"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resizer = exports.SplitView = void 0;
const TAG = "deacon-splitview";
const View_1 = require("./View");
const Debug_1 = require("../System/Debug");
const Types_1 = require("../Data/Types");
class SplitView extends View_1.View {
    static TAG = "deacon-splitview";
    resizeable = true;
    orientation = "vertical";
    resizer;
    sizes = [];
    static get observedAttributes() {
        return ["resizeable", "orientation"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "resizeable":
                this.resizeable = newValue == "true";
                break;
            case "orientation":
                this.orientation = newValue == "vertical" ? "vertical" : "horizontal";
                break;
            default:
                break;
        }
        if (this.resizeable) {
            this.ShowResizeHandle();
        }
        else {
            this.HideResizeHandle();
        }
        this.UpdateLayout();
    }
    connectedCallback() {
        super.baseConnectedCallback();
        this.style.backgroundColor = "green";
        this.attributeChangedCallback("resizeable", "", `${this.resizeable}`);
        this.attributeChangedCallback("orientation", "", `${this.orientation}`);
    }
    // Children in this view either stack horizontally or vertically and should not wrap
    UpdateLayout() {
        let childViews = Array.from(this.children).filter(child => child instanceof View_1.View);
        this.style.display = "flex";
        this.style.flexDirection = this.orientation == "horizontal" ? "row" : "column";
        this.style.flexBasis = "100%";
        this.style.flexWrap = "nowrap";
        // Get all top level child elements that aren't resizers
        let childElements = Array.from(this.children).filter(child => !(child instanceof Resizer));
        let weakReference = this;
        childElements.forEach((child, childIndex) => {
            let size = 1 / childElements.length;
            if (weakReference.sizes[childIndex] != null) {
                size = weakReference.sizes[childIndex];
            }
            child.style.flexGrow = size.toFixed(2);
        });
    }
    // Finds a set of resize handles inside of this view and sets their visibility to true or creates a new set of resize handles between every child element
    ShowResizeHandle() {
        if (!this.resizer) {
            this.resizer = document.createElement("deacon-resizer");
            let weakReference = this;
            let startPosition = new Types_1.WindowPoint();
            this.RegisterEventListener("mousedown", function splitViewMouseDown(event) {
                if (event) {
                    // If the user has clicked in a resizer element we need to start tracking the mouse position
                    if (event.target instanceof Resizer) {
                        startPosition = { x: event.clientX, y: event.clientY };
                    }
                    else {
                        console.log(`Didn't click on a resizer`);
                    }
                }
            });
            this.RegisterEventListener("mouseup", (event) => {
                startPosition = new Types_1.WindowPoint();
            });
            this.RegisterEventListener("mousemove", (event) => {
                if (!(startPosition.MinimumPoint)) {
                    let resizer = weakReference.resizer;
                    if (resizer) {
                        let resizerIndex = Array.from(weakReference.children).indexOf(resizer);
                        let position = 0;
                        if (weakReference.orientation == "horizontal") {
                            position = event.clientX / weakReference.clientWidth;
                        }
                        else {
                            position = event.clientY / weakReference.clientHeight;
                        }
                        if (position > 0 && position < 1) {
                            Debug_1.Debug.Instance.Track("SplitResize", `pos: ${position}, clientY: ${event.clientY}, clientHeight: ${weakReference.clientHeight}`);
                            weakReference.sizes[resizerIndex - 1] = position;
                            weakReference.sizes[resizerIndex] = 1 - position;
                            weakReference.UpdateLayout();
                            let splitResize = new Event("splitresize");
                            this.dispatchEvent(splitResize);
                        }
                    }
                }
            });
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
            this.insertBefore(this.resizer, this.lastChild);
        }
        this.resizer.classList.remove("hidden");
    }
    HideResizeHandle() {
        if (this.resizer) {
            this.resizer.classList.add("hidden");
        }
    }
    constructor() {
        super();
    }
}
exports.SplitView = SplitView;
class Resizer extends View_1.View {
    static TAG = "deacon-resizer";
    DepthPriority = View_1.ZPriority.Floating;
    connectedCallback() {
        super.baseConnectedCallback();
        this.style.backgroundColor = "red";
    }
}
exports.Resizer = Resizer;
customElements.define(SplitView.TAG, SplitView);
customElements.define(Resizer.TAG, Resizer);
//# sourceMappingURL=SplitView.js.map