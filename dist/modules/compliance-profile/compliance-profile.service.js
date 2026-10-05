var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ComplianceProfileService_1;
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { Company } from '../../database/entities/company.entity.js';
let ComplianceProfileService = ComplianceProfileService_1 = class ComplianceProfileService {
    profileRepo;
    companyRepo;
    logger = new Logger(ComplianceProfileService_1.name);
    constructor(profileRepo, companyRepo) {
        this.profileRepo = profileRepo;
        this.companyRepo = companyRepo;
    }
    async getProfile(companyId) {
        let profile = await this.profileRepo.findOne({
            where: { company_id: companyId },
            relations: ['company'],
        });
        if (!profile) {
            const company = await this.companyRepo.findOne({
                where: { id: companyId },
            });
            if (!company) {
                throw new NotFoundException(`Không tìm thấy doanh nghiệp với ID: ${companyId}`);
            }
            profile = this.profileRepo.create({
                company_id: companyId,
                total_employees: 0,
                probation_employees: 0,
                official_employees: 0,
                has_internal_labor_rules: false,
                has_registered_labor_rules: false,
                has_signed_all_labor_contracts: false,
                has_social_insurance_registration: false,
                tax_declaration_cycle: 'QUARTERLY',
                accounting_standard: 'CIRCULAR_133',
                has_electronic_invoices: true,
                has_digital_signature: false,
                completeness_score: 10,
            });
            profile = await this.profileRepo.save(profile);
            profile.company = company;
        }
        return profile;
    }
    async updateProfile(companyId, dto) {
        const profile = await this.getProfile(companyId);
        if (dto.total_employees !== undefined &&
            dto.probation_employees !== undefined &&
            dto.official_employees !== undefined) {
            if (dto.probation_employees + dto.official_employees > dto.total_employees) {
                throw new BadRequestException('Tổng số lao động thử việc và chính thức không được vượt quá tổng số nhân sự');
            }
        }
        Object.assign(profile, dto);
        profile.completeness_score = this.calculateCompleteness(profile);
        return this.profileRepo.save(profile);
    }
    calculateCompleteness(profile) {
        let score = 0;
        if (profile.total_employees && profile.total_employees > 0)
            score += 10;
        if (profile.has_signed_all_labor_contracts === true)
            score += 10;
        if (profile.has_social_insurance_registration === true)
            score += 10;
        if (profile.has_internal_labor_rules === true)
            score += 10;
        if (profile.tax_declaration_cycle && profile.tax_declaration_cycle.trim() !== '')
            score += 10;
        if (profile.accounting_standard && profile.accounting_standard.trim() !== '')
            score += 10;
        if (profile.has_electronic_invoices === true)
            score += 10;
        if (profile.has_digital_signature === true)
            score += 10;
        if (Array.isArray(profile.business_licenses) && profile.business_licenses.length > 0) {
            score += 20;
        }
        return Math.min(100, Math.max(0, score));
    }
};
ComplianceProfileService = ComplianceProfileService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(ComplianceProfile)),
    __param(1, InjectRepository(Company)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], ComplianceProfileService);
export { ComplianceProfileService };
//# sourceMappingURL=compliance-profile.service.js.map