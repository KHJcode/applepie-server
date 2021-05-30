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
exports.Verify = void 0;
const typeorm_1 = require("typeorm");
let Verify = class Verify {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Verify.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 15, nullable: false, unique: true }),
    __metadata("design:type", String)
], Verify.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column({ length: 6, nullable: false }),
    __metadata("design:type", String)
], Verify.prototype, "verifyNumber", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: 'created_at', nullable: false }),
    __metadata("design:type", Date)
], Verify.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: 'updated_at', nullable: false }),
    __metadata("design:type", Date)
], Verify.prototype, "updatedDate", void 0);
Verify = __decorate([
    typeorm_1.Entity('verifies')
], Verify);
exports.Verify = Verify;
//# sourceMappingURL=verify.entity.js.map