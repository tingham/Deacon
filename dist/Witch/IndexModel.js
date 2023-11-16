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
 * @class IndexModel
 * @extends ViewModel
 * @discussion A view model that contains a list of items.
 **/
var IndexModel = /** @class */ (function (_super) {
    __extends(IndexModel, _super);
    function IndexModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // The list of items to display in the view.
        _this.items = new Array();
        _this.columns = new Array();
        _this.Observers = new Array();
        return _this;
    }
    Object.defineProperty(IndexModel.prototype, "Items", {
        get: function () {
            return this.items;
        },
        set: function (value) {
            var _this = this;
            if (this.items != value) {
                this.items = value;
                this.Observers.forEach(function (observer) {
                    observer.InstanceModified(_this);
                });
            }
        },
        enumerable: false,
        configurable: true
    });
    return IndexModel;
}(ViewModel));
export { IndexModel };
//# sourceMappingURL=IndexModel.js.map