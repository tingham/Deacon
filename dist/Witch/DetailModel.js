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
import { InvalidInstance } from "../Sword/Errors/Exception";
import { ViewModel } from "./ViewModel";
// @class DetailModel
// @extends ViewModel
// An abstract generic class that represents a single record or business object whose instance is enforced to be of a specific type.
// T must be newable so that we can create an instance of it.
var DetailModel = /** @class */ (function (_super) {
    __extends(DetailModel, _super);
    function DetailModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.InstanceObservers = new Array();
        return _this;
    }
    Object.defineProperty(DetailModel.prototype, "Instance", {
        get: function () {
            if (this.instance) {
                return this.instance;
            }
            throw new InvalidInstance("The Instance of ".concat(this.constructor.name, " is not defined."));
        },
        set: function (value) {
            var _this = this;
            if (this.instance != value) {
                this.instance = value;
                this.InstanceObservers.forEach(function (observer) {
                    observer.InstanceModified(_this);
                });
            }
        },
        enumerable: false,
        configurable: true
    });
    return DetailModel;
}(ViewModel));
export { DetailModel };
//# sourceMappingURL=DetailModel.js.map