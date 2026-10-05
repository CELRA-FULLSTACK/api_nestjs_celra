import { Repository } from 'typeorm';
import { LegalRegulation, LegalRequirement } from '../../database/entities/legal-knowledge.entity.js';
import { CreateRequirementDto } from './dto/create-requirement.dto.js';
import { LegalSearchDto } from './dto/legal-search.dto.js';
import { EmbeddingService } from './embedding.service.js';
export declare class LegalKnowledgeService {
    private readonly regulationRepo;
    private readonly requirementRepo;
    private readonly embeddingService;
    private readonly logger;
    constructor(regulationRepo: Repository<LegalRegulation>, requirementRepo: Repository<LegalRequirement>, embeddingService: EmbeddingService);
    seedLegalData(): Promise<void>;
    getAllRegulations(): Promise<LegalRegulation[]>;
    getRegulationById(id: number): Promise<LegalRegulation>;
    getAllRequirements(category?: string): Promise<LegalRequirement[]>;
    searchSimilarRequirements(dto: LegalSearchDto): Promise<{
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
    createRequirement(dto: CreateRequirementDto): Promise<LegalRequirement>;
}
