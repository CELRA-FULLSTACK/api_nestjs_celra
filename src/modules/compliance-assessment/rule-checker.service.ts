import { Injectable } from '@nestjs/common';
import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { LegalRequirement } from '../../database/entities/legal-knowledge.entity.js';
import { AiAssessmentGap, AiAssessmentResult } from './providers/ai-provider.interface.js';

@Injectable()
export class RuleCheckerService {
  /**
   * Đánh giá tuân thủ dựa trên bộ quy tắc cứng chuẩn xác định (Rule-based Checker)
   */
  checkRules(
    profile: ComplianceProfile,
    requirements: LegalRequirement[],
  ): AiAssessmentResult {
    const gaps: AiAssessmentGap[] = [];
    const reqMap = new Map<string, LegalRequirement>();
    for (const r of requirements) {
      reqMap.set(r.requirement_code, r);
    }

    let totalPoints = 100;

    // 1. Kiểm tra ký Hợp đồng lao động
    const reqContract = reqMap.get('REQ_LABOR_CONTRACT_WRITTEN');
    if (profile.total_employees > 0 && !profile.has_signed_all_labor_contracts) {
      totalPoints -= 25;
      gaps.push({
        requirement_id: reqContract?.id,
        requirement_code: 'REQ_LABOR_CONTRACT_WRITTEN',
        title: 'Chưa giao kết hợp đồng lao động đầy đủ bằng văn bản',
        description: 'Phát hiện có nhân sự đang làm việc nhưng chưa hoàn tất ký kết HĐLĐ bằng văn bản.',
        legal_reference: reqContract?.legal_reference || 'Điều 13, 14 Bộ luật Lao động 2019',
        severity: 'CRITICAL',
        status: 'NON_COMPLIANT',
        gap_reason: 'Doanh nghiệp chưa ký hợp đồng lao động với 100% nhân sự.',
        action_guide: 'Lập danh sách nhân sự chưa ký và tiến hành ký HĐLĐ chính thức ngay trong tuần.',
        required_evidence_type: 'File scan Hợp đồng lao động có chữ ký 2 bên',
      });
    }

    // 2. Kiểm tra Đăng ký Nội quy lao động (nếu >= 10 người)
    const reqRules = reqMap.get('REQ_LABOR_RULES_REGISTRATION');
    if (profile.total_employees >= 10 && !profile.has_registered_labor_rules) {
      totalPoints -= 20;
      gaps.push({
        requirement_id: reqRules?.id,
        requirement_code: 'REQ_LABOR_RULES_REGISTRATION',
        title: 'Chưa đăng ký Nội quy lao động với cơ quan chức năng',
        description: 'Doanh nghiệp có quy mô từ 10 lao động trở lên bắt buộc phải ban hành và đăng ký Nội quy lao động.',
        legal_reference: reqRules?.legal_reference || 'Điều 118, 119 Bộ luật Lao động 2019',
        severity: 'MAJOR',
        status: 'NON_COMPLIANT',
        gap_reason: 'Quy mô >= 10 nhân sự nhưng chưa có văn bản xác nhận đăng ký Nội quy lao động.',
        action_guide: 'Hoàn thiện bản Nội quy lao động và nộp hồ sơ đăng ký tại Sở LĐTB&XH.',
        required_evidence_type: 'Biên nhận tiếp nhận hồ sơ đăng ký Nội quy lao động',
      });
    }

    // 3. Kiểm tra Bảo hiểm xã hội bắt buộc
    const reqInsurance = reqMap.get('REQ_LABOR_SOCIAL_INSURANCE');
    if (profile.official_employees > 0 && !profile.has_social_insurance_registration) {
      totalPoints -= 25;
      gaps.push({
        requirement_id: reqInsurance?.id,
        requirement_code: 'REQ_LABOR_SOCIAL_INSURANCE',
        title: 'Chưa tham gia Bảo hiểm xã hội bắt buộc cho lao động chính thức',
        description: 'Lao động chính thức có HĐLĐ từ đủ 1 tháng trở lên thuộc đối tượng bắt buộc tham gia BHXH, BHYT, BHTN.',
        legal_reference: reqInsurance?.legal_reference || 'Điều 168 Bộ luật Lao động 2019 & Luật BHXH',
        severity: 'CRITICAL',
        status: 'NON_COMPLIANT',
        gap_reason: 'Chưa đăng ký mã đơn vị tham gia BHXH cho người lao động.',
        action_guide: 'Nộp hồ sơ đăng ký tham gia BHXH lần đầu qua phần mềm kê khai BHXH điện tử.',
        required_evidence_type: 'Thông báo đóng BHXH (Mẫu C12-TS) hoặc Ủy nhiệm chi nộp BHXH',
      });
    }

    // 4. Kiểm tra Hóa đơn điện tử
    const reqInvoice = reqMap.get('REQ_TAX_ELECTRONIC_INVOICES');
    if (!profile.has_electronic_invoices) {
      totalPoints -= 15;
      gaps.push({
        requirement_id: reqInvoice?.id,
        requirement_code: 'REQ_TAX_ELECTRONIC_INVOICES',
        title: 'Chưa đăng ký sử dụng Hóa đơn điện tử',
        description: 'Doanh nghiệp bắt buộc phải đăng ký sử dụng hóa đơn điện tử hợp pháp theo Nghị định 123.',
        legal_reference: reqInvoice?.legal_reference || 'Nghị định 123/2020/NĐ-CP & Luật Quản lý Thuế 2019',
        severity: 'CRITICAL',
        status: 'NON_COMPLIANT',
        gap_reason: 'Chưa đăng ký thông báo phát hành hóa đơn điện tử.',
        action_guide: 'Liên hệ nhà cung cấp dịch vụ hóa đơn điện tử và nộp Mẫu 01/ĐKTĐ-HĐĐT.',
        required_evidence_type: 'Thông báo chấp nhận Mẫu 01/ĐKTĐ-HĐĐT từ Cơ quan Thuế',
      });
    }

    // 5. Kiểm tra Chữ ký số điện tử
    const reqToken = reqMap.get('REQ_TAX_DIGITAL_SIGNATURE');
    if (!profile.has_digital_signature) {
      totalPoints -= 15;
      gaps.push({
        requirement_id: reqToken?.id,
        requirement_code: 'REQ_TAX_DIGITAL_SIGNATURE',
        title: 'Chưa trang bị Chữ ký số (USB Token / SmartCA) hợp lệ',
        description: 'Chữ ký số là điều kiện tiên quyết để nộp tờ khai thuế, BHXH và xuất hóa đơn điện tử.',
        legal_reference: reqToken?.legal_reference || 'Nghị định 130/2018/NĐ-CP',
        severity: 'MAJOR',
        status: 'NON_COMPLIANT',
        gap_reason: 'Chưa có chữ ký số điện tử hoặc chữ ký số đã hết hạn.',
        action_guide: 'Đăng ký gói chứng thư số doanh nghiệp từ nhà cung cấp CA uy tín.',
        required_evidence_type: 'Hợp đồng hoặc Biên bản bàn giao chữ ký số còn hiệu lực',
      });
    }

    const finalScore = Math.max(0, totalPoints);
    const summary =
      gaps.length === 0
        ? 'Doanh nghiệp cơ bản đáp ứng các tiêu chuẩn tuân thủ trọng tâm về Lao động và Thuế.'
        : `Phát hiện ${gaps.length} điểm rủi ro pháp lý cần khắc phục ngay để tránh bị xử phạt hành chính.`;

    return {
      compliance_score: finalScore,
      ai_summary: summary,
      gaps,
    };
  }
}
