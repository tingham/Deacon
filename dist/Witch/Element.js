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
import { SentenceCase } from "../Sword/String";
var ViewModelEntity = /** @class */ (function () {
    function ViewModelEntity() {
    }
    return ViewModelEntity;
}());
// A single column (field) definition for consumption by a ViewModel to render a form or table (list)
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    function Element() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Label = "";
        _this.KeyPath = "";
        _this.Instance = {};
        return _this;
    }
    Element.Factory = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var elementInstance = new Element();
        if (args.length == 1) {
            // Just the raw value
            elementInstance.Instance = args[0];
        }
        if (args.length == 2) {
            elementInstance.KeyPath = args[0];
            // Proper-case the key path to produce a label
            elementInstance.Label = SentenceCase(args[0]);
            elementInstance.Instance = args[1];
        }
        return elementInstance;
    };
    return Element;
}(ViewModelEntity));
export { Element };
// An element that can include a sub-form or sub-table (list)
var ElementGroup = /** @class */ (function (_super) {
    __extends(ElementGroup, _super);
    function ElementGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Components = new Array();
        return _this;
    }
    return ElementGroup;
}(Element));
export { ElementGroup };
//# sourceMappingURL=Element.js.map