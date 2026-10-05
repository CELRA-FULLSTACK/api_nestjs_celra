import { ConfigService } from '@nestjs/config';
import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { LegalRequirement } from '../../database/entities/legal-knowledge.entity.js';
import { AiAssessmentResult } from './providers/ai-provider.interface.js';
import { GeminiAiProvider } from './providers/gemini.provider.js';
import { OpenAiProvider } from './providers/openai.provider.js';
import { RuleCheckerService } from './rule-checker.service.js';
export declare class AiReasoningService {
    private readonly configService;
    private readonly geminiProvider;
    private readonly openAiProvider;
    private readonly ruleChecker;
    private readonly logger;
    private readonly provider;
    constructor(configService: ConfigService, geminiProvider: GeminiAiProvider, openAiProvider: OpenAiProvider, ruleChecker: RuleCheckerService);
    analyze(profile: ComplianceProfile, requirements: LegalRequirement[]): Promise<AiAssessmentResult>;
}
