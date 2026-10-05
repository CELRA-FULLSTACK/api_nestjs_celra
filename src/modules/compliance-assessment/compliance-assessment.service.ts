import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  AssessmentStatus,
  ComplianceItemStatus,
  SeverityLevel,
  TaskStatus,
} from '../../configs/constants.js';
import { Company } from '../../database/entities/company.entity.js';
import {
  AssessmentItem,
  ComplianceAssessment,
} from '../../database/entities/compliance-assessment.entity.js';
import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { LegalRequirement } from '../../database/entities/legal-knowledge.entity.js';
import { LegalKnowledgeService } from '../legal-knowledge/legal-knowledge.service.js';
import { AiReasoningService } from './ai-reasoning.service.js';

@Injectable()
export class ComplianceAssessmentService {
  private readonly logger = new Logger(ComplianceAssessmentService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ComplianceAssessment)
    private readonly assessmentRepo: Repository<ComplianceAssessment>,
    @InjectRepository(AssessmentItem)
    private readonly itemRepo: Repository<AssessmentItem>,
    @InjectRepository(ComplianceProfile)
    private readonly profileRepo: Repository<ComplianceProfile>,
    @InjectRepository(ComplianceTask)
    private readonly taskRepo: Repository<ComplianceTask>,
    @InjectRepository(LegalRequirement)
    private readonly requirementRepo: Repository<LegalRequirement>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly legalService: LegalKnowledgeService,
    private readonly aiReasoningService: AiReasoningService,
  ) {}

  /**
   * Khởi chạy quét và đánh giá tuân thủ toàn diện (Core Assessment Engine)
   */
  async runAssessment(companyId: number, userId: number): Promise<ComplianceAssessment> {
    this.logger.log(`Bắt đầu quy trình đánh giá tuân thủ cho Doanh nghiệp ID: ${companyId}`);

    // 1. Lấy thông tin công ty và hồ sơ tuân thủ
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException(`Không tìm thấy doanh nghiệp với ID: ${companyId}`);
    }

    let profile = await this.profileRepo.findOne({ where: { company_id: companyId } });
    if (!profile) {
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
    }

    // 2. Lấy danh mục nghĩa vụ pháp lý mẫu (tự động seed nếu trống)
    let requirements = await this.requirementRepo.find({ relations: ['regulation'] });
    if (requirements.length === 0) {
      await this.legalService.seedLegalData();
      requirements = await this.requirementRepo.find({ relations: ['regulation'] });
    }

    // 3. Gọi AI Reasoning Engine (hoặc Fallback Rule-based Checker)
    const analysisResult = await this.aiReasoningService.analyze(profile, requirements);

    // 4. Lưu kết quả trong Database Transaction
    return this.dataSource.transaction(async (manager) => {
      // 4.1. Tạo phiên đánh giá
      const assessment = manager.create(ComplianceAssessment, {
        company_id: companyId,
        created_by_user_id: userId,
        overall_score: analysisResult.compliance_score,
        status: AssessmentStatus.COMPLETED,
        total_requirements_checked: requirements.length,
        compliant_count: requirements.length - analysisResult.gaps.length,
        non_compliant_count: analysisResult.gaps.filter(
          (g) => g.status === 'NON_COMPLIANT',
        ).length,
        missing_evidence_count: analysisResult.gaps.filter(
          (g) => g.status === 'MISSING_EVIDENCE',
        ).length,
        ai_summary: analysisResult.ai_summary,
      });
      const savedAssessment = await manager.save(assessment);

      // 4.2. Lưu chi tiết các AssessmentItems và tự động sinh ComplianceTasks
      const savedItems: AssessmentItem[] = [];

      for (const gap of analysisResult.gaps) {
        // Tìm requirement tương ứng nếu có
        let matchedReq = requirements.find(
          (r) =>
            r.id === gap.requirement_id ||
            r.requirement_code === gap.requirement_code,
        );

        const item = manager.create(AssessmentItem, {
          assessment_id: savedAssessment.id,
          requirement_id: matchedReq ? matchedReq.id : null,
          title: gap.title,
          legal_reference: gap.legal_reference,
          severity: (gap.severity as SeverityLevel) || SeverityLevel.STANDARD,
          status: (gap.status as ComplianceItemStatus) || ComplianceItemStatus.NON_COMPLIANT,
          gap_reason: gap.gap_reason || gap.description,
          recommended_action: gap.action_guide,
        });
        const savedItem = await manager.save(item);

        // Tự động tạo Task TODO trên bảng Kanban
        const task = manager.create(ComplianceTask, {
          company_id: companyId,
          assessment_item_id: savedItem.id,
          title: `[Khắc phục] ${gap.title}`,
          description: gap.gap_reason || gap.description,
          legal_reference: gap.legal_reference,
          action_guide: gap.action_guide,
          severity: (gap.severity as SeverityLevel) || SeverityLevel.STANDARD,
          status: TaskStatus.TODO,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0], // Mặc định 14 ngày
        });
        const savedTask = await manager.save(task);

        savedItem.auto_generated_task_id = savedTask.id;
        await manager.save(savedItem);
        savedItems.push(savedItem);
      }

      savedAssessment.items = savedItems;
      return savedAssessment;
    });
  }

  /**
   * Lấy báo cáo đánh giá mới nhất của doanh nghiệp
   */
  async getLatestAssessment(companyId: number): Promise<ComplianceAssessment | null> {
    return this.assessmentRepo.findOne({
      where: { company_id: companyId },
      order: { created_at: 'DESC' },
      relations: ['items', 'created_by'],
    });
  }

  /**
   * Lấy chi tiết phiên đánh giá theo ID (Đảm bảo cô lập dữ liệu công ty)
   */
  async getAssessmentById(companyId: number, id: number): Promise<ComplianceAssessment> {
    const assessment = await this.assessmentRepo.findOne({
      where: { id, company_id: companyId },
      relations: ['items', 'created_by'],
    });
    if (!assessment) {
      throw new NotFoundException(`Không tìm thấy báo cáo đánh giá ID: ${id}`);
    }
    return assessment;
  }
}
