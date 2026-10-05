import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateComplianceProfileDto {
  // 1. Nhóm Lao động & Nhân sự
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Tổng số nhân viên không thể âm' })
  total_employees?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Số lao động thử việc không thể âm' })
  probation_employees?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Số lao động chính thức không thể âm' })
  official_employees?: number;

  @IsOptional()
  @IsBoolean()
  has_internal_labor_rules?: boolean;

  @IsOptional()
  @IsBoolean()
  has_registered_labor_rules?: boolean;

  @IsOptional()
  @IsBoolean()
  has_signed_all_labor_contracts?: boolean;

  @IsOptional()
  @IsBoolean()
  has_social_insurance_registration?: boolean;

  // 2. Nhóm Thuế & Kế toán
  @IsOptional()
  @IsString()
  tax_declaration_cycle?: string; // 'MONTHLY' | 'QUARTERLY'

  @IsOptional()
  @IsString()
  accounting_standard?: string; // 'CIRCULAR_133' | 'CIRCULAR_200' | 'CIRCULAR_88'

  @IsOptional()
  @IsBoolean()
  has_electronic_invoices?: boolean;

  @IsOptional()
  @IsBoolean()
  has_digital_signature?: boolean;

  // 3. Giấy phép & Hồ sơ sẵn có
  @IsOptional()
  @IsArray()
  business_licenses?: Array<{
    name: string;
    license_number?: string;
    issued_date?: string;
    expiry_date?: string;
    status: 'ACTIVE' | 'EXPIRED' | 'MISSING';
  }>;
}
