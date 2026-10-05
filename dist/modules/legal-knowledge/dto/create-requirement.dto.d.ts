import { SeverityLevel } from '../../../configs/constants.js';
export declare class CreateRequirementDto {
    regulation_id: number;
    requirement_code: string;
    title: string;
    description: string;
    legal_reference: string;
    severity?: SeverityLevel;
    cycle?: string;
    trigger_conditions?: Record<string, any>;
    penalty_summary?: string;
    action_guide?: string;
    required_evidence_type?: string;
}
