"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const Tree_js_1 = require("./Library/UX/Tree.js");
const SplitView_js_1 = require("./Library/UX/SplitView.js");
const View_js_1 = require("./Library/UX/View.js");
require("reflect-metadata");
const LocalDatabase_js_1 = require("./Library/Data/LocalDatabase.js");
const Cube_js_1 = require("./Library/Data/Model/Cube.js");
class Main extends View_js_1.View {
    connectedCallback() {
        LocalDatabase_js_1.LocalDatabase.EntityRegistry.push(Cube_js_1.Cube);
        LocalDatabase_js_1.LocalDatabase.initialize().then(() => {
            let local = LocalDatabase_js_1.LocalDatabase.Instance;
            console.log(local);
        });
        let rootSplitView = new SplitView_js_1.SplitView();
        let leftPanel = document.createElement("deacon-panel");
        let tree = document.createElement("deacon-tree");
        leftPanel.style.backgroundColor = "pink";
        leftPanel.appendChild(tree);
        console.log(tree);
        rootSplitView.appendChild(leftPanel);
        let rightPanel = document.createElement("deacon-panel");
        rightPanel.style.backgroundColor = "blue";
        let rightLabel = document.createElement("h1");
        rightLabel.innerText = "Right";
        rightPanel.appendChild(rightLabel);
        rootSplitView.appendChild(rightPanel);
        rootSplitView.orientation = "horizontal";
        rootSplitView.resizeable = true;
        rootSplitView.sizes = this.getStoredValue("sizes", [0.5, 0.5]);
        let weakReference = this;
        rootSplitView.RegisterEventListener("splitresize", (event) => {
            weakReference.setStoredValue("sizes", rootSplitView.sizes);
        });
        window.addEventListener("resize", (event) => {
            View_js_1.View.Layout();
        });
        this.appendChild(rootSplitView);
    }
    getStoredValue(key, defaultValue) {
        // Retrieve the stored value from localStorage
        let storedValue = localStorage.getItem(key);
        if (storedValue == null) {
            return defaultValue;
        }
        return JSON.parse(storedValue);
    }
    setStoredValue(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}
exports.Main = Main;
customElements.define("deacon-main", Main);
customElements.define("deacon-tree", Tree_js_1.Tree);
let main = document.querySelector("deacon-main");
if (!main) {
    main = document.createElement("deacon-main");
    document.body.appendChild(main);
}
//# sourceMappingURL=Main.js.map