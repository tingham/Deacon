"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZPriority = exports.View = void 0;
class View extends HTMLElement {
    static TAG = "deacon-view";
    static Instances = new Set();
    static Layout() {
        this.SetDepths();
    }
    static SetDepths() {
        let depthSets = new Map();
        for (const depth of Object.values(ZPriority)) {
            depthSets.set(depth, new Set(Array.from(this.Instances.values()).filter(instance => instance.DepthPriority == depth)));
        }
        for (const Instance of this.Instances) {
            let depthPriority = depthSets.get(Instance.DepthPriority);
            let depthStrata = 0;
            if (depthPriority) {
                depthStrata = depthPriority.size;
            }
            else {
                depthStrata = 1;
            }
            Instance.style.zIndex = `${Instance.DepthPriority * 1000 + depthStrata}`;
        }
    }
    DepthPriority = 0;
    RegisteredEventListeners = new Map();
    RegisterEventListener(event, listener) {
        if (this.RegisteredEventListeners.has(event)) {
            let error = new Error();
            let stack = error.stack;
            let signature = "";
            if (stack && stack.length > 0) {
                let stackLines = stack.split("\n");
                let callerLine = stackLines[2];
                let callerLineParts = callerLine.split(" ");
                let callerFunction = callerLineParts[5];
                let callerLineNumber = callerLineParts[6];
                signature = `${callerFunction} in ${callerLineParts[3]}:${callerLineParts[4]}:${callerLineNumber}`;
            }
            throw new Error(`Event ${event} is already registered in ${signature}`);
        }
        this.RegisteredEventListeners.set(event, listener);
        this.addEventListener(event, listener);
    }
    UnregisterEventListener(event) {
        let listener = this.RegisteredEventListeners.get(event);
        if (listener) {
            this.removeEventListener(event, listener);
            this.RegisteredEventListeners.delete(event);
        }
    }
    constructor() {
        super();
    }
    connectedCallback() {
        this.baseConnectedCallback();
    }
    baseConnectedCallback() {
        View.Instances.add(this);
    }
}
exports.View = View;
var ZPriority;
(function (ZPriority) {
    ZPriority[ZPriority["Background"] = 0] = "Background";
    ZPriority[ZPriority["Low"] = 1] = "Low";
    ZPriority[ZPriority["Medium"] = 2] = "Medium";
    ZPriority[ZPriority["High"] = 3] = "High";
    ZPriority[ZPriority["Foreground"] = 4] = "Foreground";
    ZPriority[ZPriority["Floating"] = 5] = "Floating";
})(ZPriority || (exports.ZPriority = ZPriority = {}));
customElements.define("deacon-view", View);
//# sourceMappingURL=View.js.map