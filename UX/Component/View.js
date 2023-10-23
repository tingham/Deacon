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
//# sourceMappingURL=View.js.map