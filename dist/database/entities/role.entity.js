var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, } from 'typeorm';
import { Permission } from './permission.entity.js';
import { User } from './user.entity.js';
let Role = class Role {
    id;
    code;
    name;
    description;
    is_system;
    permissions;
    permission_matrix;
    users;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Role.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, unique: true, name: 'code' }),
    __metadata("design:type", String)
], Role.prototype, "code", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'name' }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'description' }),
    __metadata("design:type", Object)
], Role.prototype, "description", void 0);
__decorate([
    Column({ type: 'boolean', default: true, name: 'is_system' }),
    __metadata("design:type", Boolean)
], Role.prototype, "is_system", void 0);
__decorate([
    ManyToMany(() => Permission, (permission) => permission.roles, {
        cascade: true,
    }),
    JoinTable({
        name: 'role_permissions',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Role.prototype, "permissions", void 0);
__decorate([
    Column({ type: 'json', nullable: true, name: 'permission_matrix' }),
    __metadata("design:type", Object)
], Role.prototype, "permission_matrix", void 0);
__decorate([
    ManyToMany(() => User, (user) => user.roles),
    __metadata("design:type", Array)
], Role.prototype, "users", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], Role.prototype, "created_at", void 0);
Role = __decorate([
    Entity('roles')
], Role);
export { Role };
//# sourceMappingURL=role.entity.js.map