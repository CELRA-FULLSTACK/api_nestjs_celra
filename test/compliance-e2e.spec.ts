import { describe, expect, it } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { TaskStatus } from '../src/configs/constants.js';
import { EmbeddingService } from '../src/modules/legal-knowledge/embedding.service.js';
import { ComplianceProfileService } from '../src/modules/compliance-profile/compliance-profile.service.js';
import { RuleCheckerService } from '../src/modules/compliance-assessment/rule-checker.service.js';
import { ComplianceTaskService } from '../src/modules/compliance-task/compliance-task.service.js';

describe('CELRA Full Compliance Suite - End-to-End Integration Verification', () => {
  const configService = new ConfigService();
  const embeddingService = new EmbeddingService(configService);
  const profileService = new ComplianceProfileService(null as any, null as any);
  const ruleChecker = new RuleCheckerService();

  const mockLegalRequirements: any[] = [
    {
      id: 1,
      requirement_code: 'REQ_LABOR_CONTRACT_WRITTEN',
      title: 'Giao kết hợp đồng lao động bằng văn bản',
      legal_reference: 'Điều 13, 14 Bộ luật Lao động 2019',
      severity: 'CRITICAL',
    },
    {
      id: 2,
      requirement_code: 'REQ_LABOR_RULES_REGISTRATION',
      title: 'Ban hành và đăng ký Nội quy lao động',
      legal_reference: 'Điều 118, 119 Bộ luật Lao động 2019',
      severity: 'MAJOR',
    },
    {
      id: 3,
      requirement_code: 'REQ_LABOR_SOCIAL_INSURANCE',
      title: 'Đăng ký và đóng Bảo hiểm xã hội bắt buộc',
      legal_reference: 'Điều 168 Bộ luật Lao động 2019 & Luật BHXH 2014',
      severity: 'CRITICAL',
    },
    {
      id: 4,
      requirement_code: 'REQ_TAX_ELECTRONIC_INVOICES',
      title: 'Sử dụng Hóa đơn điện tử hợp chuẩn',
      legal_reference: 'Nghị định 123/2020/NĐ-CP',
      severity: 'CRITICAL',
    },
    {
      id: 5,
      requirement_code: 'REQ_TAX_DIGITAL_SIGNATURE',
      title: 'Duy trì Chữ ký số điện tử',
      legal_reference: 'Nghị định 130/2018/NĐ-CP',
      severity: 'MAJOR',
    },
  ];

  it('1. Luồng Bối cảnh Doanh nghiệp: Tính điểm hoàn thiện hồ sơ khảo sát chính xác', () => {
    const surveyData = {
      total_employees: 18,
      official_employees: 15,
      probation_employees: 3,
      has_signed_all_labor_contracts: false,
      has_social_insurance_registration: false,
      has_internal_labor_rules: true,
      tax_declaration_cycle: 'QUARTERLY',
      accounting_standard: 'CIRCULAR_133',
      has_electronic_invoices: true,
      has_digital_signature: false,
    };

    const completeness = profileService.calculateCompleteness(surveyData as any);
    expect(completeness).toBeGreaterThanOrEqual(40);
    expect(completeness).toBeLessThan(100);
  });

  it('2. Luồng Đánh giá Tuân thủ (Assessment Engine): Phát hiện chính xác các lỗ hổng vi phạm', () => {
    const surveyData: any = {
      total_employees: 18,
      official_employees: 15,
      probation_employees: 3,
      has_signed_all_labor_contracts: false,
      has_social_insurance_registration: false,
      has_registered_labor_rules: false,
      has_electronic_invoices: true,
      has_digital_signature: false,
    };

    const assessmentResult = ruleChecker.checkRules(surveyData, mockLegalRequirements);

    expect(assessmentResult.compliance_score).toBeLessThan(100);
    expect(assessmentResult.gaps.length).toBe(4); // contracts, insurance, rules (>=10), digital signature

    const contractGap = assessmentResult.gaps.find((g) => g.requirement_code === 'REQ_LABOR_CONTRACT_WRITTEN');
    expect(contractGap).toBeDefined();
    expect(contractGap?.severity).toBe('CRITICAL');
    expect(contractGap?.legal_reference).toContain('Bộ luật Lao động 2019');
  });

  it('3. Luồng Thực thi Kanban (Task State Machine): Chặn chuyển DONE nếu thiếu minh chứng/giải trình', async () => {
    const mockTask = {
      id: 101,
      company_id: 1,
      status: TaskStatus.IN_PROGRESS,
      evidences: [],
      completion_note: null,
    };

    const taskRepo: any = {
      findOne: async () => mockTask,
      save: async (t: any) => t,
    };
    const taskService = new ComplianceTaskService(taskRepo, {} as any);

    // Không có note, không có file -> Phải reject
    await expect(
      taskService.updateStatus(1, 101, {
        status: TaskStatus.DONE,
        completion_note: '',
      }),
    ).rejects.toThrow();

    // Có giải trình hoàn tất hợp lệ -> Phải chấp thuận
    const resolvedTask = await taskService.updateStatus(1, 101, {
      status: TaskStatus.DONE,
      completion_note: 'Đã hoàn tất ký phụ lục bổ sung tại chi nhánh',
    });

    expect(resolvedTask.status).toBe(TaskStatus.DONE);
    expect(resolvedTask.completed_at).toBeDefined();
  });

  it('4. Luồng Cô lập Đa Doanh nghiệp (Multi-tenant Isolation Guard): Không cho phép thao tác chéo giữa 2 công ty', async () => {
    const mockCompanyATask = {
      id: 201,
      company_id: 10, // Thuộc Công ty A
      status: TaskStatus.TODO,
    };

    const taskRepo: any = {
      findOne: async ({ where }: any) => {
        if (where.company_id === mockCompanyATask.company_id && where.id === mockCompanyATask.id) {
          return mockCompanyATask;
        }
        return null;
      },
    };

    const taskService = new ComplianceTaskService(taskRepo, {} as any);

    // User Công ty B (ID = 99) cố tình truy cập Task của Công ty A (ID = 10)
    await expect(taskService.getTaskById(99, 201)).rejects.toThrow(
      'Không tìm thấy công việc với ID: 201',
    );
  });

  it('5. Luồng Tìm kiếm Ngữ nghĩa (RAG Semantic Search): Cosine similarity xếp hạng đúng điều khoản', async () => {
    const query = 'Đăng ký nội quy lao động khi có trên 10 người';
    const targetDoc = 'Ban hành và đăng ký Nội quy lao động cho doanh nghiệp từ 10 lao động trở lên';
    const unrelatedDoc = 'Kê khai thuế giá trị gia tăng theo quý trên cổng thuedientu';

    const qVec = await embeddingService.generateEmbedding(query);
    const targetVec = await embeddingService.generateEmbedding(targetDoc);
    const unrelatedVec = await embeddingService.generateEmbedding(unrelatedDoc);

    const scoreTarget = embeddingService.calculateCosineSimilarity(qVec, targetVec);
    const scoreUnrelated = embeddingService.calculateCosineSimilarity(qVec, unrelatedVec);

    expect(scoreTarget).toBeGreaterThan(scoreUnrelated);
  });
});
