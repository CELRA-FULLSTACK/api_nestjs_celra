import { DataSource, Repository } from 'typeorm';
import { Company } from '../../database/entities/company.entity.js';
import { AssessmentItem, ComplianceAssessment } from '../../database/entities/compliance-assessment.entity.js';
import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { LegalRequirement } from '../../database/entities/legal-knowledge.entity.js';
import { LegalKnowledgeService } from '../legal-knowledge/legal-knowledge.service.js';
import { AiReasoningService } from './ai-reasoning.service.js';
export declare class ComplianceAssessmentService {
    private readonly dataSource;
    private readonly assessmentRepo;
    private readonly itemRepo;
    private readonly profileRepo;
    private readonly taskRepo;
    private readonly requirementRepo;
    private readonly companyRepo;
    private readonly legalService;
    private readonly aiReasoningService;
    private readonly logger;
    constructor(dataSource: DataSource, assessmentRepo: Repository<ComplianceAssessment>, itemRepo: Repository<AssessmentItem>, profileRepo: Repository<ComplianceProfile>, taskRepo: Repository<ComplianceTask>, requirementRepo: Repository<LegalRequirement>, companyRepo: Repository<Company>, legalService: LegalKnowledgeService, aiReasoningService: AiReasoningService);
    runAssessment(companyId: number, userId: number): Promise<ComplianceAssessment>;
    getLatestAssessment(companyId: number): Promise<ComplianceAssessment | null>;
    getAssessmentById(companyId: number, id: number): Promise<ComplianceAssessment>;
}
