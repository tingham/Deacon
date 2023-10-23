"use strict";
define("Component/Buffer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Buffer = void 0;
    const TAG = "deacon-buffer";
    class Buffer extends HTMLElement {
    }
    exports.Buffer = Buffer;
    customElements.define(TAG, Buffer, { extends: "canvas" });
});
define("Component/View", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.View = void 0;
    const TAG = "deacon-view";
    class View extends HTMLElement {
        constructor() {
            super(...arguments);
            this.RegisteredEvents = new Map();
        }
        unregisterEvents() {
            // Iterate members of RegisteredEvents and unregister them from the element
            for (const key of this.RegisteredEvents.keys()) {
                this.unregister(key);
            }
        }
        register(name, callback) {
            this.RegisteredEvents.set(name, callback);
            this.addEventListener(name, callback);
        }
        unregister(name) {
            this.RegisteredEvents.delete(name);
        }
    }
    exports.View = View;
    customElements.define(TAG, View, { extends: "div" });
});
define("Component/SplitView", ["require", "exports", "Component/View"], function (require, exports, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SplitView = void 0;
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
});
//# sourceMappingURL=deacon.ux.bundle.js.map