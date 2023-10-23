"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform = void 0;
const typeorm_1 = require("typeorm");
const Thing_js_1 = require("./Thing.js");
let Transform = class Transform extends Thing_js_1.Thing {
    X = 0;
    Y = 0;
    Z = 0;
    Width = 1;
    Height = 1;
    Depth = 1;
    Yaw = 0;
    Pitch = 0;
    Roll = 0;
};
exports.Transform = Transform;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transform.prototype, "X", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transform.prototype, "Y", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transform.prototype, "Z", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transform.prototype, "Width", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transform.prototype, "Height", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transform.prototype, "Depth", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transform.prototype, "Yaw", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transform.prototype, "Pitch", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transform.prototype, "Roll", void 0);
exports.Transform = Transform = __decorate([
    (0, typeorm_1.Entity)()
], Transform);
//# sourceMappingURL=Transform.js.map