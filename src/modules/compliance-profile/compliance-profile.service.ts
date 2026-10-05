import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { Company } from '../../database/entities/company.entity.js';
import { UpdateComplianceProfileDto } from './dto/update-compliance-profile.dto.js';

@Injectable()
export class ComplianceProfileService {
  private readonly logger = new Logger(ComplianceProfileService.name);

  constructor(
    @InjectRepository(ComplianceProfile)
    private readonly profileRepo: Repository<ComplianceProfile>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  /**
   * Lấy hoặc tự động tạo hồ sơ tuân thủ số cho doanh nghiệp
   */
  async getProfile(companyId: number): Promise<ComplianceProfile> {
    let profile = await this.profileRepo.findOne({
      where: { company_id: companyId },
      relations: ['company'],
    });

    if (!profile) {
      // Kiểm tra công ty có tồn tại không
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

  /**
   * Cập nhật thông tin khảo sát hồ sơ tuân thủ số
   */
  async updateProfile(companyId: number, dto: UpdateComplianceProfileDto): Promise<ComplianceProfile> {
    const profile = await this.getProfile(companyId);

    // Validate logic nghiệp vụ tương quan
    if (
      dto.total_employees !== undefined &&
      dto.probation_employees !== undefined &&
      dto.official_employees !== undefined
    ) {
      if (dto.probation_employees + dto.official_employees > dto.total_employees) {
        throw new BadRequestException(
          'Tổng số lao động thử việc và chính thức không được vượt quá tổng số nhân sự',
        );
      }
    }

    // Cập nhật các trường
    Object.assign(profile, dto);

    // Tính toán lại completeness_score
    profile.completeness_score = this.calculateCompleteness(profile);

    return this.profileRepo.save(profile);
  }

  /**
   * Thuật toán tính tỷ lệ hoàn thiện hồ sơ (0 - 100%)
   */
  calculateCompleteness(profile: Partial<ComplianceProfile>): number {
    let score = 0;

    // 1. Nhóm Lao động (Tối đa 40 điểm)
    if (profile.total_employees && profile.total_employees > 0) score += 10;
    if (profile.has_signed_all_labor_contracts === true) score += 10;
    if (profile.has_social_insurance_registration === true) score += 10;
    if (profile.has_internal_labor_rules === true) score += 10;

    // 2. Nhóm Thuế & Kế toán (Tối đa 40 điểm)
    if (profile.tax_declaration_cycle && profile.tax_declaration_cycle.trim() !== '') score += 10;
    if (profile.accounting_standard && profile.accounting_standard.trim() !== '') score += 10;
    if (profile.has_electronic_invoices === true) score += 10;
    if (profile.has_digital_signature === true) score += 10;

    // 3. Nhóm Giấy tờ & Giấy phép sẵn có (Tối đa 20 điểm)
    if (Array.isArray(profile.business_licenses) && profile.business_licenses.length > 0) {
      score += 20;
    }

    return Math.min(100, Math.max(0, score));
  }
}
