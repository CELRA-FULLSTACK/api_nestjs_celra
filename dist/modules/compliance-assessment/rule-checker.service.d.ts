import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { LegalRequirement } from '../../database/entities/legal-knowledge.entity.js';
import { AiAssessmentResult } from './providers/ai-provider.interface.js';
export declare class RuleCheckerService {
    checkRules(profile: ComplianceProfile, requirements: LegalRequirement[]): AiAssessmentResult;
}
