"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitView = void 0;
const View_1 = require("./View");
const TAG = "deacon-splitview";
class SplitView extends HTMLElement {
    constructor() {
        super(...arguments);
        this.orientation = "horizontal";
        this.resizeable = true;
    }
    static get observedAttributes() {
        return ["orientation", "resizeable"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "orientation") {
            this.orientation = newValue;
        }
        if (name == "resizeable") {
            this.resizeable = newValue === "true";
        }
    }
    onConnectedCallback() {
        this.style.backgroundColor = "red";
    }
    updateResizeHandle() {
        if (this.resizeable) {
            this.showResizeHandle();
        }
        else {
            this.hideResizeHandle();
        }
    }
    showResizeHandle() {
        if (!this.resizeHandle) {
            this.resizeHandle = new View_1.View();
            if (this.children.length > 1) {
                this.insertBefore(this.resizeHandle, this.children[1]);
            }
            else {
                this.appendChild(this.resizeHandle);
            }
        }
    }
    hideResizeHandle() {
        if (this.resizeHandle) {
            this.resizeHandle.unregisterEvents();
            this.removeChild(this.resizeHandle);
            this.resizeHandle = undefined;
        }
    }
}
exports.SplitView = SplitView;
customElements.define(TAG, SplitView, { extends: "div" });
//# sourceMappingURL=SplitView.js.map