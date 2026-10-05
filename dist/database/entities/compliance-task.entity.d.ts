import { type Relation } from 'typeorm';
import { SeverityLevel, TaskStatus } from '../../configs/constants.js';
import { Company } from './company.entity.js';
import { User } from './user.entity.js';
import { AssessmentItem } from './compliance-assessment.entity.js';
import { TaskEvidence } from './task-evidence.entity.js';
export declare class ComplianceTask {
    id: number;
    company_id: number;
    company: Relation<Company>;
    assessment_item_id: number | null;
    assessment_item: Relation<AssessmentItem> | null;
    title: string;
    description: string | null;
    legal_reference: string | null;
    action_guide: string | null;
    severity: SeverityLevel;
    status: TaskStatus;
    deadline: string | null;
    assigned_to_user_id: number | null;
    assigned_to: Relation<User> | null;
    completion_note: string | null;
    completed_at: Date | null;
    evidences: Relation<TaskEvidence[]>;
    created_at: Date;
    updated_at: Date;
}
