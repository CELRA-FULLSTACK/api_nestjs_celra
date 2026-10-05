var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OpenAiProvider_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
let OpenAiProvider = OpenAiProvider_1 = class OpenAiProvider {
    configService;
    logger = new Logger(OpenAiProvider_1.name);
    apiKey;
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('OPENAI_API_KEY');
    }
    async analyzeCompliance(profile, requirements) {
        if (!this.apiKey) {
            throw new Error('Chưa cấu hình OPENAI_API_KEY');
        }
        const systemPrompt = `Bạn là Chuyên gia Đánh giá Tuân thủ Pháp chế Doanh nghiệp CELRA dành cho khối SME tại Việt Nam.
Nhiệm vụ của bạn: Đối chiếu dữ liệu thực tế hồ sơ doanh nghiệp với danh sách quy định pháp luật được cung cấp.
Xác định chính xác các điểm CHƯA TUÂN THỦ (NON_COMPLIANT), THIẾU BẰNG CHỨNG (MISSING_EVIDENCE) hoặc CẦN CHUYÊN GIA (NEED_EXPERT).
Bắt buộc trả về đúng cấu trúc JSON sau:
{
  "compliance_score": number (0-100),
  "ai_summary": string,
  "gaps": [
    {
      "requirement_id": number | null,
      "requirement_code": string,
      "title": string,
      "description": string,
      "legal_reference": string,
      "severity": "CRITICAL" | "MAJOR" | "STANDARD",
      "status": "NON_COMPLIANT" | "MISSING_EVIDENCE" | "NEED_EXPERT",
      "gap_reason": string,
      "action_guide": string,
      "required_evidence_type": string
    }
  ]
}`;
        const contextPayload = {
            enterprise_profile: profile,
            legal_requirements: requirements,
        };
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: JSON.stringify(contextPayload, null, 2) },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.1,
            }),
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`OpenAI API Error: ${response.status} - ${errText}`);
        }
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        return JSON.parse(content);
    }
};
OpenAiProvider = OpenAiProvider_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], OpenAiProvider);
export { OpenAiProvider };
//# sourceMappingURL=openai.provider.js.map