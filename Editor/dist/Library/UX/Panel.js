"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Panel = void 0;
const View_js_1 = require("./View.js");
class Panel extends View_js_1.View {
    static TAG = "deacon-panel";
    Content = null;
    connectedCallback() {
        super.baseConnectedCallback();
    }
}
exports.Panel = Panel;
customElements.define(Panel.TAG, Panel);
//# sourceMappingURL=Panel.js.map