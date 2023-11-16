var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import { Log } from "../Sword/Log";
var Helpers = /** @class */ (function () {
    function Helpers() {
        // While I'm sure it is actually possible to reliably get methods from a class by string name, the last time I did it in typescript it wasn't worth the juice.
        // This also allows us to store class instances in the register, which is nice. (The AI add the 'which is nice' part, I'm not sure why but I like it)
        this.Registered = new Map();
    }
    Object.defineProperty(Helpers, "Instance", {
        get: function () {
            if (!Helpers.instance) {
                Helpers.instance = new Helpers();
            }
            return Helpers.instance;
        },
        enumerable: false,
        configurable: true
    });
    Helpers.prototype.Register = function (name, helper) {
        this.Registered.set(name, helper);
    };
    // Consumers adopt helpers from the register by name, passing in the locals bundle by reference
    Helpers.prototype.Adopt = function (helpers, locals) {
        for (var _i = 0, helpers_1 = helpers; _i < helpers_1.length; _i++) {
            var helper = helpers_1[_i];
            if (this.Registered.has(helper)) {
                // If the helper is a function, we assume it is a function that can be called with the locals bundle as the only argument
                // If it's a class that implements IHelper, we assume it has a Perform method that can be called with the locals bundle as the only argument and we bind it to the class instance
                if (this.Registered.get(helper)) {
                    // This should result in a hoisted function that can be called in the template
                    var helperInstance = this.Registered.get(helper);
                    var fn = helperInstance.Perform;
                    locals[helper] = fn.bind(helperInstance);
                }
                else if (this.Registered.get(helper) instanceof Function) {
                    locals[helper] = this.Registered.get(helper);
                }
            }
        }
    };
    return Helpers;
}());
export { Helpers };
var ForEachHelper = /** @class */ (function () {
    function ForEachHelper() {
        this.Template = "<vtch-index-item><%= Name %></vtch-index-item>";
        // Arguments are the variable names expected by the perform method (in a Helpful) to assist consumers in self-documenting this stupid mousetrap
        this.Arguments = { "Instances": "Instances" };
    }
    Object.defineProperty(ForEachHelper.prototype, "Name", {
        get: function () {
            return this.constructor.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ForEachHelper.prototype, "Description", {
        get: function () {
            return "A for-loop renderer helper; this actually produces output";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ForEachHelper.prototype, "Dependencies", {
        // NOTE: Dependencies might be important later
        get: function () {
            return ["ejs"];
        },
        enumerable: false,
        configurable: true
    });
    ForEachHelper.prototype.Perform = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var template, instances, _a, _b, help;
            return __generator(this, function (_c) {
                if (args.length > 0 && args[0] instanceof Helpful) {
                    for (_a = 0, _b = args; _a < _b.length; _a++) {
                        help = _b[_a];
                        if (help.Name == this.Arguments.Instances) {
                            instances = help.Value;
                        }
                    }
                }
                if (args.length > 0 && args[0] instanceof Array) {
                    instances = args[0];
                }
                if (instances) {
                    // TODO: Clean up these template references
                    return [2 /*return*/, this.ForInstances(this.Template, instances)];
                }
                return [2 /*return*/];
            });
        });
    };
    // A method that encapsulates a string segment and safely iterates a collection of unknown items
    // @volatile templateText The template text to be compiled, the consumer assumes responsibility for ensuring that the template is valid
    // @param instances
    ForEachHelper.prototype.ForInstances = function (templateText, instances) {
        return __awaiter(this, void 0, void 0, function () {
            var compiledTemplate, result, _i, instances_1, instance;
            return __generator(this, function (_a) {
                compiledTemplate = ejs.compile(templateText);
                result = new Array();
                for (_i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
                    instance = instances_1[_i];
                    try {
                        result.push(compiledTemplate(instance));
                    }
                    catch (error) {
                        // We only log the error, we don't throw it because we want to continue processing the rest of the instances if we can; hopefully reporting the rendering error will assist in debugging the template (but probably not)
                        Log.error(error);
                    }
                }
                return [2 /*return*/, result.join("")];
            });
        });
    };
    ForEachHelper = __decorate([
        HelpersHelper()
    ], ForEachHelper);
    return ForEachHelper;
}());
export { ForEachHelper };
/**
 * @class Helpful
 * A general purpose dictionary-type class that can be used to send named-arguments to IHelper.Perform
 **/
var Helpful = /** @class */ (function () {
    function Helpful(Name, Value) {
        this.Name = Name;
        this.Value = Value;
    }
    return Helpful;
}());
export { Helpful };
// Helpers are functions that can be used in ejs templates, a decorator is used to mark them as helpers and automatically register them with VTCH
// This decorator is made available so that consumers can register their own helpers, or override the default helpers
export function Helper() {
    return function (target, propertyKey, descriptor) {
        if (!Helpers.Instance.Registered) {
            Helpers.Instance.Registered = new Map();
        }
        Helpers.Instance.Registered.set(propertyKey, descriptor.value);
    };
}
// A decorator for full-on helper classes, that will add a class instance to the registered helpers
export function HelpersHelper() {
    return function (target, propertyKey) {
        if (!Helpers.Instance.Registered) {
            Helpers.Instance.Registered = new Map();
        }
        // Enforce the IHelper interface implementation
        Helpers.Instance.Registered.set(target.name, new target());
    };
}
//# sourceMappingURL=Helpers.js.map