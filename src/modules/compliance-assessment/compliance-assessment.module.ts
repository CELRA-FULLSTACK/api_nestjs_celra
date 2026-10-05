import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../../database/entities/company.entity.js';
import {
  AssessmentItem,
  ComplianceAssessment,
} from '../../database/entities/compliance-assessment.entity.js';
import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { LegalRequirement } from '../../database/entities/legal-knowledge.entity.js';
import { LegalKnowledgeModule } from '../legal-knowledge/legal-knowledge.module.js';
import { AiReasoningService } from './ai-reasoning.service.js';
import { ComplianceAssessmentController } from './compliance-assessment.controller.js';
import { ComplianceAssessmentService } from './compliance-assessment.service.js';
import { GeminiAiProvider } from './providers/gemini.provider.js';
import { OpenAiProvider } from './providers/openai.provider.js';
import { RuleCheckerService } from './rule-checker.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ComplianceAssessment,
      AssessmentItem,
      ComplianceProfile,
      ComplianceTask,
      LegalRequirement,
      Company,
    ]),
    LegalKnowledgeModule,
  ],
  controllers: [ComplianceAssessmentController],
  providers: [
    ComplianceAssessmentService,
    AiReasoningService,
    RuleCheckerService,
    GeminiAiProvider,
    OpenAiProvider,
  ],
  exports: [ComplianceAssessmentService, RuleCheckerService],
})
export class ComplianceAssessmentModule {}
