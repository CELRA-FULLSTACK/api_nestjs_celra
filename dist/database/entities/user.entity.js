var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { Company } from './company.entity.js';
import { Role } from './role.entity.js';
let User = class User {
    id;
    company_id;
    company;
    username;
    email;
    password_hash;
    full_name;
    phone;
    status;
    roles;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Column({ type: 'integer', nullable: true, name: 'company_id' }),
    __metadata("design:type", Object)
], User.prototype, "company_id", void 0);
__decorate([
    ManyToOne(() => Company, (company) => company.users, {
        onDelete: 'RESTRICT',
    }),
    JoinColumn({ name: 'company_id' }),
    __metadata("design:type", Object)
], User.prototype, "company", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, unique: true, name: 'username' }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, unique: true, name: 'email' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'password_hash' }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'full_name' }),
    __metadata("design:type", String)
], User.prototype, "full_name", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, nullable: true, name: 'phone' }),
    __metadata("design:type", Object)
], User.prototype, "phone", void 0);
__decorate([
    Column({
        type: 'varchar',
        length: 50,
        default: 'ACTIVE',
        name: 'status',
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    ManyToMany(() => Role, (role) => role.users, { cascade: true }),
    JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
User = __decorate([
    Entity('users')
], User);
export { User };
//# sourceMappingURL=user.entity.js.map