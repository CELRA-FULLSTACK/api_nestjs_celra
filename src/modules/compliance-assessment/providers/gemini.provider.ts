import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ComplianceProfile } from '../../../database/entities/compliance-profile.entity.js';
import { LegalRequirement } from '../../../database/entities/legal-knowledge.entity.js';
import { AiAssessmentResult, IAiProvider } from './ai-provider.interface.js';

@Injectable()
export class GeminiAiProvider implements IAiProvider {
  private readonly logger = new Logger(GeminiAiProvider.name);
  private readonly apiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
  }

  async analyzeCompliance(
    profile: ComplianceProfile,
    requirements: LegalRequirement[],
  ): Promise<AiAssessmentResult> {
    if (!this.apiKey) {
      throw new Error('Chưa cấu hình GEMINI_API_KEY');
    }

    const systemPrompt = `Bạn là Chuyên gia Đánh giá Tuân thủ Pháp chế Doanh nghiệp CELRA dành cho khối SME tại Việt Nam.
Nhiệm vụ của bạn: Đối chiếu dữ liệu thực tế hồ sơ doanh nghiệp với danh sách quy định pháp luật được cung cấp.
Xác định chính xác các điểm CHƯA TUÂN THỦ (NON_COMPLIANT), THIẾU BẰNG CHỨNG (MISSING_EVIDENCE) hoặc CẦN CHUYÊN GIA (NEED_EXPERT).
Bắt buộc trả về đúng cấu trúc JSON sau (không kèm markdown ngoài khối JSON):
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
      enterprise_profile: {
        total_employees: profile.total_employees,
        probation_employees: profile.probation_employees,
        official_employees: profile.official_employees,
        has_internal_labor_rules: profile.has_internal_labor_rules,
        has_registered_labor_rules: profile.has_registered_labor_rules,
        has_signed_all_labor_contracts: profile.has_signed_all_labor_contracts,
        has_social_insurance_registration: profile.has_social_insurance_registration,
        tax_declaration_cycle: profile.tax_declaration_cycle,
        accounting_standard: profile.accounting_standard,
        has_electronic_invoices: profile.has_electronic_invoices,
        has_digital_signature: profile.has_digital_signature,
        business_licenses: profile.business_licenses,
      },
      legal_requirements: requirements.map((r) => ({
        id: r.id,
        requirement_code: r.requirement_code,
        title: r.title,
        description: r.description,
        legal_reference: r.legal_reference,
        severity: r.severity,
        cycle: r.cycle,
        penalty_summary: r.penalty_summary,
        action_guide: r.action_guide,
        required_evidence_type: r.required_evidence_type,
      })),
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemPrompt}\n\n=== DỮ LIỆU ĐẦU VÀO ===\n${JSON.stringify(contextPayload, null, 2)}`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Gemini API không trả về nội dung hợp lệ');
    }

    const parsed: AiAssessmentResult = JSON.parse(candidateText);
    return parsed;
  }
}
