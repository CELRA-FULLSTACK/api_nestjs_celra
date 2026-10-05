import { ConfigService } from '@nestjs/config';
import { ComplianceProfile } from '../../../database/entities/compliance-profile.entity.js';
import { LegalRequirement } from '../../../database/entities/legal-knowledge.entity.js';
import { AiAssessmentResult, IAiProvider } from './ai-provider.interface.js';
export declare class OpenAiProvider implements IAiProvider {
    private readonly configService;
    private readonly logger;
    private readonly apiKey;
    constructor(configService: ConfigService);
    analyzeCompliance(profile: ComplianceProfile, requirements: LegalRequirement[]): Promise<AiAssessmentResult>;
}
