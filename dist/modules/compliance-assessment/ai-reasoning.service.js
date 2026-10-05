var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiReasoningService_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiAiProvider } from './providers/gemini.provider.js';
import { OpenAiProvider } from './providers/openai.provider.js';
import { RuleCheckerService } from './rule-checker.service.js';
let AiReasoningService = AiReasoningService_1 = class AiReasoningService {
    configService;
    geminiProvider;
    openAiProvider;
    ruleChecker;
    logger = new Logger(AiReasoningService_1.name);
    provider;
    constructor(configService, geminiProvider, openAiProvider, ruleChecker) {
        this.configService = configService;
        this.geminiProvider = geminiProvider;
        this.openAiProvider = openAiProvider;
        this.ruleChecker = ruleChecker;
        const providerName = (this.configService.get('AI_PROVIDER') || 'gemini').toLowerCase();
        if (providerName === 'openai') {
            this.provider = this.openAiProvider;
        }
        else {
            this.provider = this.geminiProvider;
        }
    }
    async analyze(profile, requirements) {
        try {
            this.logger.log('Đang gọi AI Reasoning Engine để đánh giá bối cảnh tuân thủ...');
            const result = await this.provider.analyzeCompliance(profile, requirements);
            if (result && Array.isArray(result.gaps)) {
                return result;
            }
            throw new Error('Dữ liệu AI trả về không đúng cấu trúc');
        }
        catch (error) {
            this.logger.warn(`AI Provider failed: ${error.message}. Kích hoạt Fallback Rule-based Checker.`);
            return this.ruleChecker.checkRules(profile, requirements);
        }
    }
};
AiReasoningService = AiReasoningService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService,
        GeminiAiProvider,
        OpenAiProvider,
        RuleCheckerService])
], AiReasoningService);
export { AiReasoningService };
//# sourceMappingURL=ai-reasoning.service.js.map