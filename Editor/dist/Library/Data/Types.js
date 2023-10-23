"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = exports.WindowPoint = exports.Vector = void 0;
const Three = __importStar(require("three"));
/**
 * This file wraps basic types from dependency libraries as independent types.
 */
class Vector extends Three.Vector3 {
    constructor(x, y, z) {
        super(x ? typeof x == "string" ? parseFloat(x) : x : 0, y ? typeof y == "string" ? parseFloat(y) : y : 0, z ? typeof z == "string" ? parseFloat(z) : z : 0);
    }
}
exports.Vector = Vector;
class WindowPoint {
    x = Number.MIN_SAFE_INTEGER;
    y = Number.MIN_SAFE_INTEGER;
    get MinimumPoint() {
        return (this.x == Number.MIN_SAFE_INTEGER && this.y == Number.MIN_SAFE_INTEGER);
    }
    get Length() {
        return this.x * this.y;
    }
    get LengthNormalized() {
        return 1.0 / this.Length;
    }
    // The direction in angles from the origin to this point
    get Normal() {
        return Math.atan2(this.y, this.x);
    }
    // Monoidal linear interpolation
    Lerp(toWindowPoint, t) {
        return { x: this.x + (toWindowPoint.x - this.x) * t, y: this.y + (toWindowPoint.y - this.y) * t };
    }
    // Monoidal smooth-linear interpolation
    Slerp(toWindowPoint, t) {
        return { x: this.x + (toWindowPoint.x - this.x) * (1 - Math.cos(t * Math.PI)) / 2, y: this.y + (toWindowPoint.y - this.y) * (1 - Math.cos(t * Math.PI)) / 2 };
    }
}
exports.WindowPoint = WindowPoint;
class Color extends Three.Color {
    constructor(...params) {
        super(params.length == 1 ? params[0] :
            params.length == 3 ? `rgb(${params[0]},${params[1]},${params[2]})` :
                `rgba(${params[0]},${params[1]},${params[2]},${params[3]})`);
    }
}
exports.Color = Color;
//# sourceMappingURL=Types.js.map