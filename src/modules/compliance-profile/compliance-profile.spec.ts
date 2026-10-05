import { describe, expect, it } from 'vitest';
import { ComplianceProfileService } from './compliance-profile.service.js';

describe('ComplianceProfileService - Completeness Score Calculation', () => {
  const service = new ComplianceProfileService(null as any, null as any);

  it('nên tính điểm 0% cho profile trống chưa điền', () => {
    const profile = {
      total_employees: 0,
      has_signed_all_labor_contracts: false,
      has_social_insurance_registration: false,
      has_internal_labor_rules: false,
      tax_declaration_cycle: '',
      accounting_standard: '',
      has_electronic_invoices: false,
      has_digital_signature: false,
      business_licenses: null,
    };

    const score = service.calculateCompleteness(profile as any);
    expect(score).toBe(0);
  });

  it('nên tính điểm 100% khi doanh nghiệp điền đầy đủ tất cả thông tin khảo sát', () => {
    const fullProfile = {
      total_employees: 25,
      has_signed_all_labor_contracts: true,
      has_social_insurance_registration: true,
      has_internal_labor_rules: true,
      tax_declaration_cycle: 'QUARTERLY',
      accounting_standard: 'CIRCULAR_133',
      has_electronic_invoices: true,
      has_digital_signature: true,
      business_licenses: [
        { name: 'Giấy phép ĐKKD', status: 'ACTIVE' as const },
        { name: 'Chứng chỉ PCCC', status: 'ACTIVE' as const },
      ],
    };

    const score = service.calculateCompleteness(fullProfile as any);
    expect(score).toBe(100);
  });
});
