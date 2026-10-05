import { SeverityLevel } from '../../configs/constants.js';

export interface SeedRegulationData {
  code: string;
  title: string;
  category: string;
  description: string;
  issuing_authority: string;
  effective_date: string;
  requirements: Array<{
    requirement_code: string;
    title: string;
    description: string;
    legal_reference: string;
    severity: SeverityLevel;
    cycle: string;
    trigger_conditions: Record<string, any>;
    penalty_summary: string;
    action_guide: string;
    required_evidence_type: string;
  }>;
}

export const SEED_LEGAL_DATA: SeedRegulationData[] = [
  {
    code: 'BLLD_2019',
    title: 'Bộ luật Lao động 2019 (Số 45/2019/QH14)',
    category: 'LABOR',
    description: 'Quy định tiêu chuẩn lao động, quyền, nghĩa vụ, trách nhiệm của người lao động và người sử dụng lao động.',
    issuing_authority: 'Quốc hội',
    effective_date: '2021-01-01',
    requirements: [
      {
        requirement_code: 'REQ_LABOR_PROBATION_PERIOD',
        title: 'Giới hạn thời gian thử việc theo trình độ chuyên môn',
        description: 'Thời gian thử việc không quá 60 ngày đối với công việc có chức danh nghề nghiệp cần trình độ từ cao đẳng trở lên; không quá 30 ngày đối với trình độ trung cấp, công nhân kỹ thuật.',
        legal_reference: 'Điều 25 Bộ luật Lao động 2019',
        severity: SeverityLevel.STANDARD,
        cycle: 'ONE_TIME',
        trigger_conditions: { min_employees: 1, has_flags: ['probation_employees'] },
        penalty_summary: 'Phạt tiền từ 2.000.000đ đến 5.000.000đ đối với hành vi thử việc quá thời hạn quy định (Nghị định 12/2022/NĐ-CP).',
        action_guide: 'Rà soát hợp đồng thử việc / điều khoản thử việc, đảm bảo thời hạn không vượt quá 60 ngày hoặc 30 ngày tương ứng.',
        required_evidence_type: 'Hợp đồng thử việc hoặc Thỏa thuận thử việc',
      },
      {
        requirement_code: 'REQ_LABOR_CONTRACT_WRITTEN',
        title: 'Giao kết hợp đồng lao động bằng văn bản',
        description: 'Người sử dụng lao động phải giao kết hợp đồng lao động bằng văn bản đối với công việc có thời hạn từ 01 tháng trở lên trước khi nhận người lao động vào làm việc.',
        legal_reference: 'Điều 13, 14 Bộ luật Lao động 2019',
        severity: SeverityLevel.CRITICAL,
        cycle: 'ONE_TIME',
        trigger_conditions: { min_employees: 1, has_flags: ['missing_labor_contracts'] },
        penalty_summary: 'Phạt tiền từ 2.000.000đ đến 50.000.000đ tùy số lượng lao động chưa ký hợp đồng bằng văn bản (Nghị định 12/2022/NĐ-CP).',
        action_guide: 'Tiến hành ký hợp đồng lao động chính thức bằng văn bản hoặc hợp đồng điện tử có giá trị pháp lý với 100% nhân sự.',
        required_evidence_type: 'File scan Hợp đồng lao động có chữ ký 2 bên',
      },
      {
        requirement_code: 'REQ_LABOR_RULES_REGISTRATION',
        title: 'Ban hành và đăng ký Nội quy lao động',
        description: 'Người sử dụng lao động sử dụng từ 10 người lao động trở lên phải có nội quy lao động bằng văn bản và phải đăng ký với cơ quan chuyên môn về lao động cấp tỉnh/huyện.',
        legal_reference: 'Điều 118, 119 Bộ luật Lao động 2019',
        severity: SeverityLevel.MAJOR,
        cycle: 'ONE_TIME',
        trigger_conditions: { min_employees: 10, has_flags: ['unregistered_labor_rules'] },
        penalty_summary: 'Phạt tiền từ 5.000.000đ đến 10.000.000đ khi không có nội quy lao động bằng văn bản hoặc không đăng ký theo quy định.',
        action_guide: 'Biên soạn bộ Nội quy lao động theo đúng 9 nội dung luật định và nộp hồ sơ đăng ký tại Sở/Phòng Lao động - Thương binh và Xã hội.',
        required_evidence_type: 'Biên nhận tiếp nhận hồ sơ đăng ký Nội quy lao động',
      },
      {
        requirement_code: 'REQ_LABOR_SOCIAL_INSURANCE',
        title: 'Đăng ký và đóng Bảo hiểm xã hội bắt buộc',
        description: 'Người sử dụng lao động phải tham gia BHXH bắt buộc, BHYT, BHTN cho người lao động làm việc theo hợp đồng lao động có thời hạn từ đủ 01 tháng trở lên.',
        legal_reference: 'Điều 168 Bộ luật Lao động 2019 & Luật BHXH 2014',
        severity: SeverityLevel.CRITICAL,
        cycle: 'MONTHLY',
        trigger_conditions: { min_employees: 1, has_flags: ['missing_social_insurance'] },
        penalty_summary: 'Phạt tiền từ 12% đến 15% tổng số tiền phải đóng BHXH bắt buộc, tối đa 75.000.000đ và truy thu tiền lãi chậm nộp.',
        action_guide: 'Lập hồ sơ đăng ký tham gia bảo hiểm xã hội lần đầu (Mẫu D02-LT) và thực hiện trích nộp định kỳ hàng tháng.',
        required_evidence_type: 'Thông báo đóng BHXH (Mẫu C12-TS) hoặc Ủy nhiệm chi nộp BHXH',
      },
      {
        requirement_code: 'REQ_LABOR_SAFETY_TRAINING',
        title: 'Huấn luyện An toàn, Vệ sinh lao động định kỳ',
        description: 'Tổ chức huấn luyện an toàn, vệ sinh lao động cho người lao động, người quản lý phụ trách công tác an toàn định kỳ hàng năm.',
        legal_reference: 'Điều 14 Luật An toàn, vệ sinh lao động 2015',
        severity: SeverityLevel.STANDARD,
        cycle: 'ANNUAL',
        trigger_conditions: { min_employees: 1 },
        penalty_summary: 'Phạt tiền từ 1.000.000đ đến 50.000.000đ tùy số lượng người chưa được huấn luyện an toàn vệ sinh lao động.',
        action_guide: 'Lập kế hoạch huấn luyện ATVSLĐ nội bộ hoặc liên hệ đơn vị dịch vụ huấn luyện có chứng chỉ để cấp thẻ/giấy chứng nhận.',
        required_evidence_type: 'Biên bản huấn luyện ATVSLĐ hoặc Giấy chứng nhận huấn luyện',
      },
    ],
  },
  {
    code: 'LQLT_2019',
    title: 'Luật Quản lý Thuế 2019 (Số 38/2019/QH14)',
    category: 'TAX',
    description: 'Quy định việc quản lý các loại thuế, các khoản thu khác thuộc ngân sách nhà nước.',
    issuing_authority: 'Quốc hội',
    effective_date: '2020-07-01',
    requirements: [
      {
        requirement_code: 'REQ_TAX_VAT_DECLARATION_QUARTERLY',
        title: 'Nộp tờ khai thuế Giá trị gia tăng (GTGT) theo Quý',
        description: 'Doanh nghiệp thuộc diện kê khai theo quý phải nộp hồ sơ khai thuế GTGT chậm nhất là ngày cuối cùng của tháng đầu của quý tiếp theo quý phát sinh nghĩa vụ thuế.',
        legal_reference: 'Điều 44 Luật Quản lý Thuế 2019',
        severity: SeverityLevel.CRITICAL,
        cycle: 'QUARTERLY',
        trigger_conditions: { requires_tax_type: 'QUARTERLY' },
        penalty_summary: 'Phạt tiền từ 2.000.000đ đến 25.000.000đ đối với hành vi nộp hồ sơ khai thuế quá thời hạn (Nghị định 125/2020/NĐ-CP).',
        action_guide: 'Lập tờ khai thuế GTGT mẫu 01/GTGT trên phần mềm HTKK và nộp qua cổng thuedientu.gdt.gov.vn trước ngày 30/31 của tháng đầu quý kế tiếp.',
        required_evidence_type: 'Thông báo chấp nhận tờ khai thuế điện tử của Tổng cục Thuế',
      },
      {
        requirement_code: 'REQ_TAX_CIT_FINALIZATION_ANNUAL',
        title: 'Quyết toán thuế Thu nhập doanh nghiệp (TNDN) năm',
        description: 'Hồ sơ quyết toán thuế TNDN năm chậm nhất là ngày cuối cùng của tháng thứ 3 kể từ ngày kết thúc năm dương lịch hoặc năm tài chính.',
        legal_reference: 'Điều 44 Luật Quản lý Thuế 2019',
        severity: SeverityLevel.CRITICAL,
        cycle: 'ANNUAL',
        trigger_conditions: { min_employees: 1 },
        penalty_summary: 'Phạt chậm nộp tờ khai và tính tiền phạt chậm nộp 0,03%/ngày trên số tiền thuế chậm nộp vào ngân sách nhà nước.',
        action_guide: 'Hoàn thiện Báo cáo tài chính năm, lập tờ khai quyết toán thuế TNDN mẫu 03/TNDN và nộp kèm BCTC trước ngày 31/03 hàng năm.',
        required_evidence_type: 'Thông báo xác nhận nộp tờ khai quyết toán TNDN',
      },
      {
        requirement_code: 'REQ_TAX_PIT_WITHHOLDING',
        title: 'Khấu trừ và kê khai thuế Thu nhập cá nhân (TNCN)',
        description: 'Tổ chức chi trả thu nhập có trách nhiệm khấu trừ thuế TNCN khi trả lương và nộp hồ sơ khai thuế TNCN định kỳ theo tháng hoặc theo quý.',
        legal_reference: 'Điều 44 Luật Quản lý Thuế 2019 & Thông tư 111/2013/TT-BTC',
        severity: SeverityLevel.MAJOR,
        cycle: 'QUARTERLY',
        trigger_conditions: { min_employees: 1 },
        penalty_summary: 'Phạt cảnh cáo hoặc phạt tiền từ 2.000.000đ đến 25.000.000đ đối với hành vi chậm nộp tờ khai TNCN.',
        action_guide: 'Lập bảng tính thuế TNCN hàng tháng/quý và nộp tờ khai mẫu 05/KK-TNCN cùng thời hạn với tờ khai GTGT.',
        required_evidence_type: 'Tờ khai thuế TNCN kèm chứng từ nộp tiền vào ngân sách nhà nước',
      },
      {
        requirement_code: 'REQ_TAX_ELECTRONIC_INVOICES',
        title: 'Sử dụng Hóa đơn điện tử hợp chuẩn',
        description: '100% doanh nghiệp, tổ chức kinh tế bắt buộc phải sử dụng hóa đơn điện tử khi bán hàng hóa, cung cấp dịch vụ theo quy định.',
        legal_reference: 'Điều 90 Luật Quản lý Thuế 2019 & Nghị định 123/2020/NĐ-CP',
        severity: SeverityLevel.CRITICAL,
        cycle: 'ONE_TIME',
        trigger_conditions: { min_employees: 1, has_flags: ['missing_electronic_invoices'] },
        penalty_summary: 'Phạt tiền từ 10.000.000đ đến 20.000.000đ đối với hành vi không sử dụng hóa đơn điện tử theo quy định.',
        action_guide: 'Đăng ký sử dụng hóa đơn điện tử mẫu 01/ĐKTĐ-HĐĐT và được cơ quan thuế chấp thuận.',
        required_evidence_type: 'Thông báo chấp nhận Mẫu 01/ĐKTĐ-HĐĐT từ Cơ quan Thuế',
      },
      {
        requirement_code: 'REQ_TAX_DIGITAL_SIGNATURE',
        title: 'Duy trì Chữ ký số điện tử (Token/SmartCA)',
        description: 'Doanh nghiệp phải có chứng thư số hợp lệ còn thời hạn để thực hiện kê khai thuế, hải quan, BHXH và xuất hóa đơn điện tử.',
        legal_reference: 'Nghị định 130/2018/NĐ-CP & Luật Giao dịch điện tử',
        severity: SeverityLevel.MAJOR,
        cycle: 'ANNUAL',
        trigger_conditions: { min_employees: 1, has_flags: ['missing_digital_signature'] },
        penalty_summary: 'Không thể nộp tờ khai đúng hạn dẫn đến bị phạt chậm nộp tờ khai thuế.',
        action_guide: 'Kiểm tra hạn sử dụng chữ ký số USB Token hoặc SmartCA, liên hệ nhà cung cấp gia hạn trước khi hết hạn ít nhất 15 ngày.',
        required_evidence_type: 'Hợp đồng/Biên bản bàn giao chữ ký số còn hiệu lực',
      },
    ],
  },
];
