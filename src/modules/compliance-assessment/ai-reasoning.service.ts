import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { LegalRequirement } from '../../database/entities/legal-knowledge.entity.js';
import { AiAssessmentResult, IAiProvider } from './providers/ai-provider.interface.js';
import { GeminiAiProvider } from './providers/gemini.provider.js';
import { OpenAiProvider } from './providers/openai.provider.js';
import { RuleCheckerService } from './rule-checker.service.js';

@Injectable()
export class AiReasoningService {
  private readonly logger = new Logger(AiReasoningService.name);
  private readonly provider: IAiProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly geminiProvider: GeminiAiProvider,
    private readonly openAiProvider: OpenAiProvider,
    private readonly ruleChecker: RuleCheckerService,
  ) {
    const providerName = (this.configService.get<string>('AI_PROVIDER') || 'gemini').toLowerCase();
    if (providerName === 'openai') {
      this.provider = this.openAiProvider;
    } else {
      this.provider = this.geminiProvider;
    }
  }

  /**
   * Chạy phân tích AI đối chiếu với kho luật, có cơ chế Fallback tự động sang Rule-based
   */
  async analyze(
    profile: ComplianceProfile,
    requirements: LegalRequirement[],
  ): Promise<AiAssessmentResult> {
    try {
      this.logger.log('Đang gọi AI Reasoning Engine để đánh giá bối cảnh tuân thủ...');
      const result = await this.provider.analyzeCompliance(profile, requirements);
      if (result && Array.isArray(result.gaps)) {
        return result;
      }
      throw new Error('Dữ liệu AI trả về không đúng cấu trúc');
    } catch (error: any) {
      this.logger.warn(`AI Provider failed: ${error.message}. Kích hoạt Fallback Rule-based Checker.`);
      return this.ruleChecker.checkRules(profile, requirements);
    }
  }
}
