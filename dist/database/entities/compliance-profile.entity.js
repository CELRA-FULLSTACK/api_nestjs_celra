var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { Company } from './company.entity.js';
let ComplianceProfile = class ComplianceProfile {
    id;
    company_id;
    company;
    total_employees;
    probation_employees;
    official_employees;
    has_internal_labor_rules;
    has_registered_labor_rules;
    has_signed_all_labor_contracts;
    has_social_insurance_registration;
    tax_declaration_cycle;
    accounting_standard;
    has_electronic_invoices;
    has_digital_signature;
    business_licenses;
    completeness_score;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ComplianceProfile.prototype, "id", void 0);
__decorate([
    Column({ type: 'integer', unique: true, name: 'company_id' }),
    __metadata("design:type", Number)
], ComplianceProfile.prototype, "company_id", void 0);
__decorate([
    OneToOne(() => Company, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'company_id' }),
    __metadata("design:type", Object)
], ComplianceProfile.prototype, "company", void 0);
__decorate([
    Column({ type: 'integer', default: 0, name: 'total_employees' }),
    __metadata("design:type", Number)
], ComplianceProfile.prototype, "total_employees", void 0);
__decorate([
    Column({ type: 'integer', default: 0, name: 'probation_employees' }),
    __metadata("design:type", Number)
], ComplianceProfile.prototype, "probation_employees", void 0);
__decorate([
    Column({ type: 'integer', default: 0, name: 'official_employees' }),
    __metadata("design:type", Number)
], ComplianceProfile.prototype, "official_employees", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'has_internal_labor_rules' }),
    __metadata("design:type", Boolean)
], ComplianceProfile.prototype, "has_internal_labor_rules", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'has_registered_labor_rules' }),
    __metadata("design:type", Boolean)
], ComplianceProfile.prototype, "has_registered_labor_rules", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'has_signed_all_labor_contracts' }),
    __metadata("design:type", Boolean)
], ComplianceProfile.prototype, "has_signed_all_labor_contracts", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'has_social_insurance_registration' }),
    __metadata("design:type", Boolean)
], ComplianceProfile.prototype, "has_social_insurance_registration", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'QUARTERLY', name: 'tax_declaration_cycle' }),
    __metadata("design:type", String)
], ComplianceProfile.prototype, "tax_declaration_cycle", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'CIRCULAR_133', name: 'accounting_standard' }),
    __metadata("design:type", String)
], ComplianceProfile.prototype, "accounting_standard", void 0);
__decorate([
    Column({ type: 'boolean', default: true, name: 'has_electronic_invoices' }),
    __metadata("design:type", Boolean)
], ComplianceProfile.prototype, "has_electronic_invoices", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'has_digital_signature' }),
    __metadata("design:type", Boolean)
], ComplianceProfile.prototype, "has_digital_signature", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true, name: 'business_licenses' }),
    __metadata("design:type", Object)
], ComplianceProfile.prototype, "business_licenses", void 0);
__decorate([
    Column({ type: 'integer', default: 0, name: 'completeness_score' }),
    __metadata("design:type", Number)
], ComplianceProfile.prototype, "completeness_score", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], ComplianceProfile.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ComplianceProfile.prototype, "updated_at", void 0);
ComplianceProfile = __decorate([
    Entity('compliance_profiles')
], ComplianceProfile);
export { ComplianceProfile };
//# sourceMappingURL=compliance-profile.entity.js.map