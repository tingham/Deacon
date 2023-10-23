"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
class Debug {
    DebugView;
    static instance;
    static get Instance() {
        if (this.instance == null) {
            this.instance = new Debug();
        }
        return this.instance;
    }
    Track(key, value) {
        let dview = this.ensureView();
        let trackedItem = dview.querySelector(`[key="${key}"]`);
        if (!trackedItem) {
            trackedItem = document.createElement("deacon-debug");
            trackedItem.setAttribute("key", key);
            let trackedLabel = document.createElement("span");
            let trackedValue = document.createElement("span");
            trackedLabel.innerHTML = `<strong>${key}</strong>`;
            trackedItem.appendChild(trackedLabel);
            trackedItem.appendChild(trackedValue);
            dview.appendChild(trackedItem);
        }
        let valueDisplay = trackedItem.querySelector("span:last-child");
        if (valueDisplay) {
            valueDisplay.innerHTML = value.toString();
        }
    }
    ensureView() {
        if (!this.DebugView) {
            this.DebugView = document.createElement("deacon-view");
            document.body.appendChild(this.DebugView);
        }
        return this.DebugView;
    }
}
exports.Debug = Debug;
//# sourceMappingURL=Debug.js.map