// A "struct" of standard template components as raw html formatted in ejs syntax
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Action } from "./Action";
import { IndexDetailModel } from "./IndexDetailModel";
import { DetailModel } from "./DetailModel";
import { TreeModel } from "./TreeModel";
import { IndexModel } from "./IndexModel";
import { InvalidInstance } from "../Sword/Errors/Exception";
import { Element } from "./Element";
// Enforce type safety for a view, such that it must be given an object of a known type, to render
// Sample Data Models
// @internal
var VTCHNode = /** @class */ (function () {
    function VTCHNode() {
        this.Name = "";
        this.Description = "";
        this.Children = new Array();
    }
    return VTCHNode;
}());
export { VTCHNode };
// A detail imprint that understands how to render a VTCHNode instance
var DetailImprint = /** @class */ (function (_super) {
    __extends(DetailImprint, _super);
    function DetailImprint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DetailImprint.prototype, "Fields", {
        get: function () {
            return [
                Element.Factory("Name", this.Instance),
                Element.Factory("Description", this.Instance)
            ];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DetailImprint.prototype, "Title", {
        get: function () {
            return this.Instance ? this.Instance.Name : "Some Node";
        },
        set: function (value) {
            this.title = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DetailImprint.prototype, "Description", {
        get: function () {
            return "This is a default detail imprint, you probably don't want to use it";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DetailImprint.prototype, "PluralName", {
        get: function () {
            return "Nodes";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DetailImprint.prototype, "SingularName", {
        get: function () {
            return "Node";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DetailImprint.prototype, "AddAction", {
        get: function () {
            return;
        },
        enumerable: false,
        configurable: true
    });
    return DetailImprint;
}(DetailModel));
export { DetailImprint };
var DefaultImprint = /** @class */ (function (_super) {
    __extends(DefaultImprint, _super);
    function DefaultImprint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DefaultImprint.prototype, "Instance", {
        // The default imprint is hard-coded to support only model instances that have a "body" property, this must be enforced by overriding the Instance property setter method. It is important, however, that we maintain the default functionality provided by the base class.
        set: function (value) {
            var _this = this;
            if (this.instance != value) {
                if (value === null || value === void 0 ? void 0 : value.body) {
                    this.instance = value;
                    this.InstanceObservers.forEach(function (observer) {
                        observer.InstanceModified(_this);
                    });
                }
                else {
                    throw new InvalidInstance("The default imprint requires a model instance with a \"body\" property.");
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultImprint.prototype, "Fields", {
        get: function () {
            return [
                Element.Factory("body", this.Instance)
            ];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultImprint.prototype, "Title", {
        get: function () {
            return this.title;
        },
        set: function (value) {
            this.title = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultImprint.prototype, "Description", {
        get: function () {
            return "This is a default imprint, you probably want to subclass it";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultImprint.prototype, "PluralName", {
        get: function () {
            return "Defaults";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultImprint.prototype, "SingularName", {
        get: function () {
            return "Default";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultImprint.prototype, "AddAction", {
        get: function () {
            return;
        },
        enumerable: false,
        configurable: true
    });
    return DefaultImprint;
}(DetailModel));
export { DefaultImprint };
/**
 * @class DefaultIndexDetailImprint
 * @extends IndexDetailModel<VTCHNode>
 * A single "page" of content that is rendered using a view model instance.
 **/
var DefaultIndexDetailImprint = /** @class */ (function (_super) {
    __extends(DefaultIndexDetailImprint, _super);
    function DefaultIndexDetailImprint() {
        var _this = _super.call(this) || this;
        _this.Helpers.push("ForEachHelper");
        return _this;
    }
    Object.defineProperty(DefaultIndexDetailImprint.prototype, "Fields", {
        get: function () {
            return [
                { Label: "Name", KeyPath: "Name" },
                { Label: "Description", KeyPath: "Description" }
            ];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultIndexDetailImprint.prototype, "Title", {
        get: function () {
            return "The Index / Detail";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultIndexDetailImprint.prototype, "Description", {
        get: function () {
            return "An example of an index-detail view";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultIndexDetailImprint.prototype, "PluralName", {
        get: function () {
            return "Stuff";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultIndexDetailImprint.prototype, "SingularName", {
        get: function () {
            return "Thing";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultIndexDetailImprint.prototype, "AddAction", {
        get: function () {
            var action = new Action();
            action.ControllerPath = "stuff";
            action.MethodPath = "add";
            return action;
        },
        enumerable: false,
        configurable: true
    });
    return DefaultIndexDetailImprint;
}(IndexDetailModel));
export { DefaultIndexDetailImprint };
/**
 * @class DefaultIndexImprint
 * @extends IndexModel<VTCHNode>
 * An example of a view model that contains a list of Node model instances.
 **/
var DefaultIndexImprint = /** @class */ (function (_super) {
    __extends(DefaultIndexImprint, _super);
    function DefaultIndexImprint() {
        return _super.call(this) || this;
    }
    Object.defineProperty(DefaultIndexImprint.prototype, "Items", {
        get: function () {
            return [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultIndexImprint.prototype, "Title", {
        get: function () {
            return "The List";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultIndexImprint.prototype, "Description", {
        get: function () {
            return "A List of Stuff";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultIndexImprint.prototype, "PluralName", {
        get: function () {
            return "Stuff";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultIndexImprint.prototype, "SingularName", {
        get: function () {
            return "Thing";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultIndexImprint.prototype, "AddAction", {
        get: function () {
            var action = new Action();
            action.ControllerPath = "stuff";
            action.MethodPath = "add";
            return action;
        },
        enumerable: false,
        configurable: true
    });
    return DefaultIndexImprint;
}(IndexModel));
export { DefaultIndexImprint };
/**
 * @class DefaultTreeImprint
 * @extends TreeModel<VTCHNode>
 * An example of a view model that contains a tree of Node model instances.
 **/
var DefaultTreeImprint = /** @class */ (function (_super) {
    __extends(DefaultTreeImprint, _super);
    function DefaultTreeImprint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DefaultTreeImprint.prototype, "Title", {
        get: function () {
            return "The Tree";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultTreeImprint.prototype, "Description", {
        get: function () {
            return "A Tree of Stuff";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultTreeImprint.prototype, "PluralName", {
        get: function () {
            return "Stuff";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultTreeImprint.prototype, "SingularName", {
        get: function () {
            return "Thing";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultTreeImprint.prototype, "ChildIdentifier", {
        get: function () {
            return "Children";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultTreeImprint.prototype, "MaxDepth", {
        get: function () {
            return 3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultTreeImprint.prototype, "AddAction", {
        get: function () {
            return;
        },
        enumerable: false,
        configurable: true
    });
    return DefaultTreeImprint;
}(TreeModel));
export { DefaultTreeImprint };
//export class Stock {
//  public static Layout = {
//    // A simple layout that renders the title and body of a model instance
//    // Layout
//    Homepage: VTCH.Factory(DefaultImprint, `<html><head><title><%= Instance.Name %></title></head><body><%= Instance.Description %></body></html>`),
//    // A master-detail view that should be rendered within a layout
//    // View
//    IndexDetail: VTCH.Factory(DefaultIndexDetailImprint, `<vtch-index-detail><vtch-index><%- index %></vtch-index><vtch-detail><%- detail %></vtch-detail></vtch-index-detail>`),
//    // A table/list of items that should be rendered within a layout or in another view (perhaps)
//    // View
//    NodeList: VTCH.Factory(DefaultIndexImprint, `<vtch-node-list><ul><% for(let i = 0; i < nodes.length; i++) { %><li><%= nodes[i] %></li><% } %></ul></vtch-node-list>`),
//    // A tree of items that should be rendered within a layout or in another view (perhaps)
//    Tree: VTCH.Factory(DefaultTreeImprint, `<vtch-tree><ul><% for(let i = 0; i < nodes.length; i++) { %><li><%= nodes[i] %></li><% } %></ul></vtch-tree>`)
//  } as const
//}
//# sourceMappingURL=Stock.js.map