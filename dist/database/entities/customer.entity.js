var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
export var CustomerStatus;
(function (CustomerStatus) {
    CustomerStatus["ACTIVE"] = "ACTIVE";
    CustomerStatus["INACTIVE"] = "INACTIVE";
})(CustomerStatus || (CustomerStatus = {}));
let Customer = class Customer {
    id;
    name;
    phone;
    email;
    address;
    notes;
    status;
    created_by;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'name' }),
    __metadata("design:type", String)
], Customer.prototype, "name", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, unique: true, name: 'phone' }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true, name: 'email' }),
    __metadata("design:type", Object)
], Customer.prototype, "email", void 0);
__decorate([
    Column({ type: 'varchar', length: 500, nullable: true, name: 'address' }),
    __metadata("design:type", Object)
], Customer.prototype, "address", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'notes' }),
    __metadata("design:type", Object)
], Customer.prototype, "notes", void 0);
__decorate([
    Column({
        type: 'varchar',
        length: 50,
        default: 'ACTIVE',
        name: 'status',
    }),
    __metadata("design:type", String)
], Customer.prototype, "status", void 0);
__decorate([
    Column({ type: 'integer', nullable: true, name: 'created_by' }),
    __metadata("design:type", Object)
], Customer.prototype, "created_by", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], Customer.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Customer.prototype, "updated_at", void 0);
Customer = __decorate([
    Entity('customers')
], Customer);
export { Customer };
//# sourceMappingURL=customer.entity.js.map