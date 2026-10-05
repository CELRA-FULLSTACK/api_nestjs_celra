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
var ComplianceAssessmentService_1;
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AssessmentStatus, ComplianceItemStatus, SeverityLevel, TaskStatus, } from '../../configs/constants.js';
import { Company } from '../../database/entities/company.entity.js';
import { AssessmentItem, ComplianceAssessment, } from '../../database/entities/compliance-assessment.entity.js';
import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { LegalRequirement } from '../../database/entities/legal-knowledge.entity.js';
import { LegalKnowledgeService } from '../legal-knowledge/legal-knowledge.service.js';
import { AiReasoningService } from './ai-reasoning.service.js';
let ComplianceAssessmentService = ComplianceAssessmentService_1 = class ComplianceAssessmentService {
    dataSource;
    assessmentRepo;
    itemRepo;
    profileRepo;
    taskRepo;
    requirementRepo;
    companyRepo;
    legalService;
    aiReasoningService;
    logger = new Logger(ComplianceAssessmentService_1.name);
    constructor(dataSource, assessmentRepo, itemRepo, profileRepo, taskRepo, requirementRepo, companyRepo, legalService, aiReasoningService) {
        this.dataSource = dataSource;
        this.assessmentRepo = assessmentRepo;
        this.itemRepo = itemRepo;
        this.profileRepo = profileRepo;
        this.taskRepo = taskRepo;
        this.requirementRepo = requirementRepo;
        this.companyRepo = companyRepo;
        this.legalService = legalService;
        this.aiReasoningService = aiReasoningService;
    }
    async runAssessment(companyId, userId) {
        this.logger.log(`Bắt đầu quy trình đánh giá tuân thủ cho Doanh nghiệp ID: ${companyId}`);
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
        let requirements = await this.requirementRepo.find({ relations: ['regulation'] });
        if (requirements.length === 0) {
            await this.legalService.seedLegalData();
            requirements = await this.requirementRepo.find({ relations: ['regulation'] });
        }
        const analysisResult = await this.aiReasoningService.analyze(profile, requirements);
        return this.dataSource.transaction(async (manager) => {
            const assessment = manager.create(ComplianceAssessment, {
                company_id: companyId,
                created_by_user_id: userId,
                overall_score: analysisResult.compliance_score,
                status: AssessmentStatus.COMPLETED,
                total_requirements_checked: requirements.length,
                compliant_count: requirements.length - analysisResult.gaps.length,
                non_compliant_count: analysisResult.gaps.filter((g) => g.status === 'NON_COMPLIANT').length,
                missing_evidence_count: analysisResult.gaps.filter((g) => g.status === 'MISSING_EVIDENCE').length,
                ai_summary: analysisResult.ai_summary,
            });
            const savedAssessment = await manager.save(assessment);
            const savedItems = [];
            for (const gap of analysisResult.gaps) {
                let matchedReq = requirements.find((r) => r.id === gap.requirement_id ||
                    r.requirement_code === gap.requirement_code);
                const item = manager.create(AssessmentItem, {
                    assessment_id: savedAssessment.id,
                    requirement_id: matchedReq ? matchedReq.id : null,
                    title: gap.title,
                    legal_reference: gap.legal_reference,
                    severity: gap.severity || SeverityLevel.STANDARD,
                    status: gap.status || ComplianceItemStatus.NON_COMPLIANT,
                    gap_reason: gap.gap_reason || gap.description,
                    recommended_action: gap.action_guide,
                });
                const savedItem = await manager.save(item);
                const task = manager.create(ComplianceTask, {
                    company_id: companyId,
                    assessment_item_id: savedItem.id,
                    title: `[Khắc phục] ${gap.title}`,
                    description: gap.gap_reason || gap.description,
                    legal_reference: gap.legal_reference,
                    action_guide: gap.action_guide,
                    severity: gap.severity || SeverityLevel.STANDARD,
                    status: TaskStatus.TODO,
                    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split('T')[0],
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
    async getLatestAssessment(companyId) {
        return this.assessmentRepo.findOne({
            where: { company_id: companyId },
            order: { created_at: 'DESC' },
            relations: ['items', 'created_by'],
        });
    }
    async getAssessmentById(companyId, id) {
        const assessment = await this.assessmentRepo.findOne({
            where: { id, company_id: companyId },
            relations: ['items', 'created_by'],
        });
        if (!assessment) {
            throw new NotFoundException(`Không tìm thấy báo cáo đánh giá ID: ${id}`);
        }
        return assessment;
    }
};
ComplianceAssessmentService = ComplianceAssessmentService_1 = __decorate([
    Injectable(),
    __param(1, InjectRepository(ComplianceAssessment)),
    __param(2, InjectRepository(AssessmentItem)),
    __param(3, InjectRepository(ComplianceProfile)),
    __param(4, InjectRepository(ComplianceTask)),
    __param(5, InjectRepository(LegalRequirement)),
    __param(6, InjectRepository(Company)),
    __metadata("design:paramtypes", [DataSource,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        LegalKnowledgeService,
        AiReasoningService])
], ComplianceAssessmentService);
export { ComplianceAssessmentService };
//# sourceMappingURL=compliance-assessment.service.js.map