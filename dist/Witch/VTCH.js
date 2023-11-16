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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import ejs from "ejs";
import { InvalidInstance, UnregisteredRenderer, ViewRenderError } from "../Sword/Errors/Exception";
import { Helpers } from "./Helpers";
import { IsConcreteViewModel } from "./Imprint";
var VTCH = /** @class */ (function () {
    function VTCH() {
        this.Template = "";
        this.RequestedHelpers = new Array();
    }
    Object.defineProperty(VTCH.prototype, "ViewModelClass", {
        get: function () {
            if (!this.viewModelClass) {
                throw new Error("(Portable Class Wrapper) The view model class is not defined.");
            }
            return this.viewModelClass;
        },
        set: function (T) {
            this.viewModelClass = T;
        },
        enumerable: false,
        configurable: true
    });
    VTCH.prototype.AddHelper = function (name, helper) {
        Helpers.Instance.Register(name, helper);
    };
    VTCH.Factory = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var template, helpers, Type;
        if (args.length == 2) {
            Type = args[0], template = args[1];
        }
        if (args.length == 3) {
            Type = args[0], helpers = args[1], template = args[2];
        }
        var concrete = /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.Template = template;
                _this.RequestedHelpers = helpers;
                _this.viewModelClass = Type;
                return _this;
            }
            return class_1;
        }(VTCH));
        return concrete;
    };
    // Render the view using the given instance, enforcing type safety
    VTCH.prototype.Render = function (viewModelInstance) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // NOTE: Downcasting is stupid when it is just mutability
                        if (((_a = this.RequestedHelpers) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                            Helpers.Instance.Adopt(this.RequestedHelpers, viewModelInstance);
                        }
                        // Override any helpers requested by the view model instance or whatever up top
                        if (((_b = viewModelInstance.Helpers) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                            Helpers.Instance.Adopt(viewModelInstance.Helpers, viewModelInstance);
                        }
                        // TODO: Validate that the given instance is of the correct type based on the configuration of this anonymous VTCH sub-class
                        if (!IsConcreteViewModel(viewModelInstance, this.ViewModelClass)) {
                            throw new InvalidInstance("The given instance T<".concat(typeof viewModelInstance, "> is not an instance T<").concat(this.ViewModelClass.constructor, "> of the expected type"));
                        }
                        // TODO: It is vital that we move this logic into the view model class so that if there are exceptions during rendering; the location can be reported and resolutions can be made much more efficiently.
                        try {
                            if (typeof this.Template === "string") {
                                return [2 /*return*/, ejs.render(this.Template, viewModelInstance, { async: true })];
                            }
                        }
                        catch (error) {
                            throw ViewRenderError.FromError("string", error);
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        if (!(typeof this.Template === "function")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.Template(viewModelInstance, { async: true })];
                    case 2: return [2 /*return*/, _c.sent()];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _c.sent();
                        throw ViewRenderError.FromError("function", error_1);
                    case 5: throw new UnregisteredRenderer("The view model ".concat(this.ViewModelClass.name, " is not registered with the renderer."));
                }
            });
        });
    };
    return VTCH;
}());
export { VTCH };
//# sourceMappingURL=VTCH.js.map