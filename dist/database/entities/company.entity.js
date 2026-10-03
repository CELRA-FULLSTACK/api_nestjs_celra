var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { User } from './user.entity.js';
let Company = class Company {
    id;
    name;
    tax_code;
    email;
    phone;
    address;
    status;
    users;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Company.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'name' }),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, unique: true, name: 'tax_code' }),
    __metadata("design:type", String)
], Company.prototype, "tax_code", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'email' }),
    __metadata("design:type", String)
], Company.prototype, "email", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, nullable: true, name: 'phone' }),
    __metadata("design:type", Object)
], Company.prototype, "phone", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'address' }),
    __metadata("design:type", Object)
], Company.prototype, "address", void 0);
__decorate([
    Column({
        type: 'varchar',
        length: 50,
        default: 'ACTIVE',
        name: 'status',
    }),
    __metadata("design:type", String)
], Company.prototype, "status", void 0);
__decorate([
    OneToMany(() => User, (user) => user.company),
    __metadata("design:type", Array)
], Company.prototype, "users", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], Company.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Company.prototype, "updated_at", void 0);
Company = __decorate([
    Entity('companies')
], Company);
export { Company };
//# sourceMappingURL=company.entity.js.map