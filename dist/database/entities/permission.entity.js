var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, } from 'typeorm';
import { Role } from './role.entity.js';
let Permission = class Permission {
    id;
    code;
    name;
    module;
    roles;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Permission.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, unique: true, name: 'code' }),
    __metadata("design:type", String)
], Permission.prototype, "code", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'name' }),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, name: 'module' }),
    __metadata("design:type", String)
], Permission.prototype, "module", void 0);
__decorate([
    ManyToMany(() => Role, (role) => role.permissions),
    __metadata("design:type", Array)
], Permission.prototype, "roles", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], Permission.prototype, "created_at", void 0);
Permission = __decorate([
    Entity('permissions')
], Permission);
export { Permission };
//# sourceMappingURL=permission.entity.js.map