import { CreateRequirementDto } from './dto/create-requirement.dto.js';
import { LegalSearchDto } from './dto/legal-search.dto.js';
import { LegalKnowledgeService } from './legal-knowledge.service.js';
export declare class LegalKnowledgeController {
    private readonly legalService;
    constructor(legalService: LegalKnowledgeService);
    getRegulations(): Promise<import("../../database/entities/legal-knowledge.entity.js").LegalRegulation[]>;
    getRegulationDetail(id: number): Promise<import("../../database/entities/legal-knowledge.entity.js").LegalRegulation>;
    getRequirements(category?: string): Promise<import("../../database/entities/legal-knowledge.entity.js").LegalRequirement[]>;
    searchRequirements(dto: LegalSearchDto): Promise<{
        id: number;
        requirement_code: string;
        title: string;
        description: string;
        legal_reference: string;
        severity: import("../../configs/constants.js").SeverityLevel;
        cycle: string;
        penalty_summary: string | null;
        action_guide: string | null;
        required_evidence_type: string | null;
        regulation: {
            code: string;
            title: string;
            category: string;
        };
        similarity_score: number;
    }[]>;
    createRequirement(dto: CreateRequirementDto): Promise<import("../../database/entities/legal-knowledge.entity.js").LegalRequirement>;
    seedLegalData(): Promise<{
        message: string;
    }>;
}
