import { type Relation } from 'typeorm';
import { EvidenceVerificationStatus } from '../../configs/constants.js';
import { ComplianceTask } from './compliance-task.entity.js';
import { User } from './user.entity.js';
export declare class TaskEvidence {
    id: number;
    task_id: number;
    task: Relation<ComplianceTask>;
    file_name: string;
    file_url: string;
    file_type: string | null;
    file_size: number | null;
    verified_status: EvidenceVerificationStatus;
    uploaded_by_user_id: number | null;
    uploaded_by: Relation<User> | null;
    created_at: Date;
    updated_at: Date;
}
