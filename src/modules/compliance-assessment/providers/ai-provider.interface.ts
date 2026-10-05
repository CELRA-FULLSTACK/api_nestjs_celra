import { ComplianceProfile } from '../../../database/entities/compliance-profile.entity.js';
import { LegalRequirement } from '../../../database/entities/legal-knowledge.entity.js';

export interface AiAssessmentGap {
  requirement_id?: number;
  requirement_code?: string;
  title: string;
  description: string;
  legal_reference: string;
  severity: 'CRITICAL' | 'MAJOR' | 'STANDARD';
  status: 'NON_COMPLIANT' | 'MISSING_EVIDENCE' | 'NEED_EXPERT';
  gap_reason: string;
  action_guide: string;
  required_evidence_type: string;
}

export interface AiAssessmentResult {
  compliance_score: number;
  ai_summary: string;
  gaps: AiAssessmentGap[];
}

export interface IAiProvider {
  analyzeCompliance(
    profile: ComplianceProfile,
    requirements: LegalRequirement[],
  ): Promise<AiAssessmentResult>;
}
