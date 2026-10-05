import { ComplianceAssessmentService } from './compliance-assessment.service.js';
export declare class ComplianceAssessmentController {
    private readonly assessmentService;
    constructor(assessmentService: ComplianceAssessmentService);
    runAssessment(companyId: number, userId: number): Promise<import("../../database/entities/compliance-assessment.entity.js").ComplianceAssessment>;
    getLatestAssessment(companyId: number): Promise<import("../../database/entities/compliance-assessment.entity.js").ComplianceAssessment | null>;
    getAssessmentById(companyId: number, id: number): Promise<import("../../database/entities/compliance-assessment.entity.js").ComplianceAssessment>;
}
