var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../../database/entities/company.entity.js';
import { AssessmentItem, ComplianceAssessment, } from '../../database/entities/compliance-assessment.entity.js';
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
let ComplianceAssessmentModule = class ComplianceAssessmentModule {
};
ComplianceAssessmentModule = __decorate([
    Module({
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
], ComplianceAssessmentModule);
export { ComplianceAssessmentModule };
//# sourceMappingURL=compliance-assessment.module.js.map