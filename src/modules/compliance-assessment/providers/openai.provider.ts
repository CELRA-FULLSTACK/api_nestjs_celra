import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ComplianceProfile } from '../../../database/entities/compliance-profile.entity.js';
import { LegalRequirement } from '../../../database/entities/legal-knowledge.entity.js';
import { AiAssessmentResult, IAiProvider } from './ai-provider.interface.js';

@Injectable()
export class OpenAiProvider implements IAiProvider {
  private readonly logger = new Logger(OpenAiProvider.name);
  private readonly apiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  async analyzeCompliance(
    profile: ComplianceProfile,
    requirements: LegalRequirement[],
  ): Promise<AiAssessmentResult> {
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
}
