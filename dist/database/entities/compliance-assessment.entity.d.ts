import { type Relation } from 'typeorm';
import { AssessmentStatus, ComplianceItemStatus, SeverityLevel } from '../../configs/constants.js';
import { Company } from './company.entity.js';
import { User } from './user.entity.js';
import { LegalRequirement } from './legal-knowledge.entity.js';
export declare class ComplianceAssessment {
    id: number;
    company_id: number;
    company: Relation<Company>;
    created_by_user_id: number;
    created_by: Relation<User>;
    overall_score: number;
    status: AssessmentStatus;
    total_requirements_checked: number;
    compliant_count: number;
    non_compliant_count: number;
    missing_evidence_count: number;
    ai_summary: string | null;
    items: Relation<AssessmentItem[]>;
    created_at: Date;
    updated_at: Date;
}
export declare class AssessmentItem {
    id: number;
    assessment_id: number;
    assessment: Relation<ComplianceAssessment>;
    requirement_id: number | null;
    requirement: Relation<LegalRequirement> | null;
    title: string;
    legal_reference: string;
    severity: SeverityLevel;
    status: ComplianceItemStatus;
    gap_reason: string | null;
    recommended_action: string | null;
    auto_generated_task_id: number | null;
    created_at: Date;
    updated_at: Date;
}
