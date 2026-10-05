import { type Relation } from 'typeorm';
import { SeverityLevel } from '../../configs/constants.js';
export declare class LegalRegulation {
    id: number;
    code: string;
    title: string;
    category: string;
    description: string | null;
    issuing_authority: string | null;
    effective_date: string | null;
    requirements: Relation<LegalRequirement[]>;
    created_at: Date;
    updated_at: Date;
}
export declare class LegalRequirement {
    id: number;
    regulation_id: number;
    regulation: Relation<LegalRegulation>;
    requirement_code: string;
    title: string;
    description: string;
    legal_reference: string;
    severity: SeverityLevel;
    cycle: string;
    trigger_conditions: {
        min_employees?: number;
        max_employees?: number;
        requires_tax_type?: string;
        has_flags?: string[];
    } | null;
    penalty_summary: string | null;
    action_guide: string | null;
    required_evidence_type: string | null;
    embedding: string | null;
    created_at: Date;
    updated_at: Date;
}
