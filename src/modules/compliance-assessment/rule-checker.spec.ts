import { describe, expect, it } from 'vitest';
import { RuleCheckerService } from './rule-checker.service.js';

describe('RuleCheckerService - Deterministic Legal Assessment', () => {
  const service = new RuleCheckerService();

  const mockRequirements: any[] = [
    {
      id: 1,
      requirement_code: 'REQ_LABOR_CONTRACT_WRITTEN',
      title: 'Giao kết HĐLĐ bằng văn bản',
      legal_reference: 'Điều 13, 14 BLLĐ 2019',
    },
    {
      id: 2,
      requirement_code: 'REQ_LABOR_RULES_REGISTRATION',
      title: 'Đăng ký nội quy lao động',
      legal_reference: 'Điều 118, 119 BLLĐ 2019',
    },
    {
      id: 3,
      requirement_code: 'REQ_LABOR_SOCIAL_INSURANCE',
      title: 'Tham gia BHXH bắt buộc',
      legal_reference: 'Điều 168 BLLĐ 2019',
    },
    {
      id: 4,
      requirement_code: 'REQ_TAX_ELECTRONIC_INVOICES',
      title: 'Sử dụng Hóa đơn điện tử',
      legal_reference: 'Nghị định 123/2020/NĐ-CP',
    },
    {
      id: 5,
      requirement_code: 'REQ_TAX_DIGITAL_SIGNATURE',
      title: 'Chữ ký số điện tử',
      legal_reference: 'Nghị định 130/2018/NĐ-CP',
    },
  ];

  it('nên phát hiện lỗi chưa ký HĐLĐ và chưa đóng BHXH cho doanh nghiệp', () => {
    const profile: any = {
      total_employees: 12,
      official_employees: 10,
      probation_employees: 2,
      has_signed_all_labor_contracts: false,
      has_social_insurance_registration: false,
      has_registered_labor_rules: false,
      has_electronic_invoices: true,
      has_digital_signature: true,
    };

    const result = service.checkRules(profile, mockRequirements);

    expect(result.compliance_score).toBeLessThan(100);
    expect(result.gaps.length).toBe(3); // 3 gaps: contract, rules registration (>=10), social insurance
    expect(result.gaps.some((g) => g.requirement_code === 'REQ_LABOR_CONTRACT_WRITTEN')).toBe(true);
    expect(result.gaps.some((g) => g.requirement_code === 'REQ_LABOR_RULES_REGISTRATION')).toBe(true);
    expect(result.gaps.some((g) => g.requirement_code === 'REQ_LABOR_SOCIAL_INSURANCE')).toBe(true);
  });

  it('nên đạt 100 điểm khi doanh nghiệp hoàn thành mọi nghĩa vụ', () => {
    const compliantProfile: any = {
      total_employees: 15,
      official_employees: 15,
      probation_employees: 0,
      has_signed_all_labor_contracts: true,
      has_social_insurance_registration: true,
      has_registered_labor_rules: true,
      has_electronic_invoices: true,
      has_digital_signature: true,
    };

    const result = service.checkRules(compliantProfile, mockRequirements);

    expect(result.compliance_score).toBe(100);
    expect(result.gaps.length).toBe(0);
  });
});
