import { SeverityLevel } from '../../configs/constants.js';
export interface SeedRegulationData {
    code: string;
    title: string;
    category: string;
    description: string;
    issuing_authority: string;
    effective_date: string;
    requirements: Array<{
        requirement_code: string;
        title: string;
        description: string;
        legal_reference: string;
        severity: SeverityLevel;
        cycle: string;
        trigger_conditions: Record<string, any>;
        penalty_summary: string;
        action_guide: string;
        required_evidence_type: string;
    }>;
}
export declare const SEED_LEGAL_DATA: SeedRegulationData[];
