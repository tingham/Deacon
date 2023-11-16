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
import { SortKeys } from "../Sword/Constant";
import { IndexModel } from "./IndexModel";
// Bitwise enumerator for view model options
export var IndexDetailFlag;
(function (IndexDetailFlag) {
    IndexDetailFlag[IndexDetailFlag["None"] = 0] = "None";
    IndexDetailFlag[IndexDetailFlag["SingleSelect"] = 1] = "SingleSelect";
    IndexDetailFlag[IndexDetailFlag["MultiSelect"] = 2] = "MultiSelect";
    IndexDetailFlag[IndexDetailFlag["SingleEdit"] = 4] = "SingleEdit";
    IndexDetailFlag[IndexDetailFlag["MultiEdit"] = 8] = "MultiEdit";
    IndexDetailFlag[IndexDetailFlag["Delete"] = 16] = "Delete";
    IndexDetailFlag[IndexDetailFlag["Order"] = 32] = "Order";
    IndexDetailFlag[IndexDetailFlag["Filter"] = 64] = "Filter";
    IndexDetailFlag[IndexDetailFlag["Duplicate"] = 128] = "Duplicate";
})(IndexDetailFlag || (IndexDetailFlag = {}));
// @class IndexDetailModel
// @extends IndexModel
// An abstract generic class that represents a list of business objects that is aware of selection and how to queue detail view models for items
// Builds upon the IndexModel class by adding a detail view model and a selection property.
var IndexDetailModel = /** @class */ (function (_super) {
    __extends(IndexDetailModel, _super);
    function IndexDetailModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // The options available to the template presenting the view model.
        _this.flags = IndexDetailFlag.None;
        // The list of items that are currently selected.
        _this.selection = new Array();
        return _this;
    }
    Object.defineProperty(IndexDetailModel.prototype, "DetailViewModelClass", {
        // Encapsulates the DetailModelViewClass property
        get: function () {
            return this.detailViewModelClass;
        },
        set: function (value) {
            this.detailViewModelClass = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IndexDetailModel.prototype, "Flags", {
        // Encapsulates the Flags property
        get: function () {
            return this.flags;
        },
        set: function (value) {
            this.flags = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IndexDetailModel.prototype, "Selection", {
        // Encapsulates the Selection property
        get: function () {
            return this.selection;
        },
        set: function (value) {
            this.selection = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IndexDetailModel.prototype, "DetailViewModel", {
        // Encapsulates the DetailViewModel property
        get: function () {
            return this.detailViewModel;
        },
        set: function (value) {
            this.detailViewModel = value;
        },
        enumerable: false,
        configurable: true
    });
    // Selection Management
    IndexDetailModel.prototype.Select = function (item) {
        if (this.CanHasFlag(IndexDetailFlag.SingleSelect)) {
            this.selection = new Array();
        }
        this.selection.push(item);
    };
    IndexDetailModel.prototype.Deselect = function (item) {
        this.selection = this.selection.filter(function (value) {
            return value != item;
        });
    };
    IndexDetailModel.prototype.Move = function (item, delta) {
        var index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            this.items.splice(index + delta, 0, item);
        }
        var _loop_1 = function (item_1) {
            var index_1 = this_1.items.indexOf(item_1);
            SortKeys.forEach(function (sortable) {
                if (item_1[sortable]) {
                    item_1[sortable] = index_1;
                }
            });
        };
        var this_1 = this;
        // Iterate all items in selection and if they have a native property in [Order, Ordinal, Sort, Index, Indice] then update it to reflect the new order
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item_1 = _a[_i];
            _loop_1(item_1);
        }
    };
    IndexDetailModel.prototype.Promote = function (item, offset) {
        this.Move(item, -1);
    };
    IndexDetailModel.prototype.Demote = function (item, offset) {
        this.Move(item, 1);
    };
    IndexDetailModel.prototype.CanHasFlag = function (flag) {
        return (this.flags & flag) == flag;
    };
    return IndexDetailModel;
}(IndexModel));
export { IndexDetailModel };
//# sourceMappingURL=IndexDetailModel.js.map