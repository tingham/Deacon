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
import { ViewModel } from "./ViewModel";
/**
 * @class TreeModel
 * @extends ViewModel
 * @discussion A view model that contains a tree of items.
 * @example
 **/
var TreeModel = /** @class */ (function (_super) {
    __extends(TreeModel, _super);
    function TreeModel() {
        var _this = _super.call(this) || this;
        if (_this.Helpers) {
            _this.Helpers.push("ForInstances");
        }
        return _this;
    }
    return TreeModel;
}(ViewModel));
export { TreeModel };
//# sourceMappingURL=TreeModel.js.map