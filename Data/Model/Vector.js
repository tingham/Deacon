"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
const three_1 = __importDefault(require("three"));
class Vector extends three_1.default.Vector3 {
    // Accept creation of a vector with no arguments, three strings or three numbers
    constructor(x, y, z) {
        super(x ? (typeof x === "string" ? parseFloat(x) : x) : 0, y ? (typeof y === "string" ? parseFloat(y) : y) : 0, z ? (typeof z === "string" ? parseFloat(z) : z) : 0);
    }
}
exports.Vector = Vector;
//# sourceMappingURL=Vector.js.map