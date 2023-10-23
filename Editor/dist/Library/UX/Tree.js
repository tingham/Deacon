"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const Panel_js_1 = require("./Panel.js");
// A panel that contains a sequence of records, presumably with children, and an item view for each record type: Container and Item
class Tree extends Panel_js_1.Panel {
    static TAG = "deacon-tree";
    items;
    ChildAccessor;
    ItemView;
    ContainerView;
    openItems = new Set();
    containerItems = new Set();
    connectedCallback() {
    }
    set Items(value) {
        this.items = value;
        this.UpdateLayout();
    }
    UpdateLayout() {
        let renderedItems = new Array();
        // Iterate through the items and create a view for each based on the type
        if (this.items) {
            for (const item of this.items) {
                if (item.Schema.Fields.has(this.ChildAccessor)) {
                    let childValues = item.Values.get(this.ChildAccessor);
                    if (childValues instanceof Array) {
                        // This is a container
                        this.containerItems.add(item);
                    }
                }
                this.renderItem(item, renderedItems);
            }
            for (const renderedItem of renderedItems) {
                this.appendChild(renderedItem);
            }
        }
    }
    renderItem(item, renderedItems) {
        let view = this.ViewForRow(item);
        let weakReference = this;
        view.addEventListener("mouseup", (event) => {
            weakReference.ItemSelected(item);
        });
        if (weakReference.openItems.has(item)) {
            for (const childItem of item.Values.get(weakReference.ChildAccessor)) {
                weakReference.renderItem(childItem, renderedItems);
            }
        }
        renderedItems.push(view);
    }
    ViewForRow(row) {
        let view = null;
        if (this.containerItems.has(row)) {
            if (!this.ContainerView) {
                throw new Error("ContainerView not set");
            }
            view = document.createElement(this.ContainerView.tagName);
        }
        else {
            if (!this.ItemView) {
                throw new Error("ItemView not set");
            }
            view = document.createElement(this.ItemView.tagName);
        }
        return view;
    }
    ItemSelected(item) {
        let event = new CustomEvent("itemselected", { detail: item });
        if (this.containerItems.has(item)) {
            this.openItems.add(item);
        }
        else {
            this.openItems.delete(item);
        }
        this.dispatchEvent(event);
    }
}
exports.Tree = Tree;
//# sourceMappingURL=Tree.js.map