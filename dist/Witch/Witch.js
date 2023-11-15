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
// Witch allows you to render output using a template engine. The engine is specified; not during configuration or invocation, but in the fact that encapsulated (curried) functions are provided as raw providers.
// Witch does not know what you are using to render output; what kind of output you're rendering, or even if you're rendering output at all. It just provides the tools to do so.
var Witch = /** @class */ (function () {
    function Witch() {
        // The layout is the container for any future rendering in this instance.
        this.Layout = "{{{body}}}";
    }
    // The consumer specifies how to render a "component" by assigning a derived function<t> to the component.
    // Utility Method to allow iteration in a Witch master template.
    Witch.For = function (collection, template) {
        return __awaiter(this, void 0, void 0, function () {
            var output, _i, collection_1, item, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        output = "";
                        _i = 0, collection_1 = collection;
                        _b.label = 1;
                    case 1:
                        if (!(_i < collection_1.length)) return [3 /*break*/, 4];
                        item = collection_1[_i];
                        _a = output;
                        return [4 /*yield*/, template.Render(item)];
                    case 2:
                        output = _a + _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, output];
                }
            });
        });
    };
    // Utility method to allow conditional rendering in a Witch master template.
    Witch.If = function (condition, template, templateArgs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!condition) return [3 /*break*/, 2];
                        return [4 /*yield*/, template.Render(templateArgs)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, ""];
                }
            });
        });
    };
    // The string that we will match for in the witch template.
    Witch.BodyTag = "body";
    return Witch;
}());
export { Witch };
// Witch standard syntax for master templates.
/**
 * <html>
 *  <head>
 *   <title>{{{title}}}</title>
 * </head>
 * <body>
 * {{{If(showHouses, For(houses, HouseComponentRenderer))}}}
 * </body>
 * </html>
 **/
var AbstractComponentRenderer = /** @class */ (function () {
    function AbstractComponentRenderer() {
    }
    return AbstractComponentRenderer;
}());
export { AbstractComponentRenderer };
var HouseComponentRenderer = /** @class */ (function (_super) {
    __extends(HouseComponentRenderer, _super);
    function HouseComponentRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HouseComponentRenderer.prototype.Render = function (component) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, "<div class=\"house\">".concat(component.Name, "</div>")];
            });
        });
    };
    return HouseComponentRenderer;
}(AbstractComponentRenderer));
export { HouseComponentRenderer };
//let houses = new Array<House>()
//Witch.For<House>(houses, new HouseComponentRenderer())
//# sourceMappingURL=Witch.js.map