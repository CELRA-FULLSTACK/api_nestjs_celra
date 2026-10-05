var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class UpdateComplianceProfileDto {
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
}
__decorate([
    IsOptional(),
    IsNumber(),
    Min(0, { message: 'Tổng số nhân viên không thể âm' }),
    __metadata("design:type", Number)
], UpdateComplianceProfileDto.prototype, "total_employees", void 0);
__decorate([
    IsOptional(),
    IsNumber(),
    Min(0, { message: 'Số lao động thử việc không thể âm' }),
    __metadata("design:type", Number)
], UpdateComplianceProfileDto.prototype, "probation_employees", void 0);
__decorate([
    IsOptional(),
    IsNumber(),
    Min(0, { message: 'Số lao động chính thức không thể âm' }),
    __metadata("design:type", Number)
], UpdateComplianceProfileDto.prototype, "official_employees", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateComplianceProfileDto.prototype, "has_internal_labor_rules", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateComplianceProfileDto.prototype, "has_registered_labor_rules", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateComplianceProfileDto.prototype, "has_signed_all_labor_contracts", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateComplianceProfileDto.prototype, "has_social_insurance_registration", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateComplianceProfileDto.prototype, "tax_declaration_cycle", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateComplianceProfileDto.prototype, "accounting_standard", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateComplianceProfileDto.prototype, "has_electronic_invoices", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateComplianceProfileDto.prototype, "has_digital_signature", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    __metadata("design:type", Array)
], UpdateComplianceProfileDto.prototype, "business_licenses", void 0);
//# sourceMappingURL=update-compliance-profile.dto.js.map