import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { SeverityLevel } from '../../../configs/constants.js';

export class CreateRequirementDto {
  @IsNotEmpty({ message: 'Vui lòng cung cấp mã văn bản luật (regulation_id)' })
  @IsNumber()
  regulation_id: number;

  @IsNotEmpty({ message: 'Vui lòng cung cấp mã nghĩa vụ' })
  @IsString()
  requirement_code: string;

  @IsNotEmpty({ message: 'Vui lòng cung cấp tiêu đề nghĩa vụ' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Vui lòng cung cấp mô tả chi tiết' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Vui lòng cung cấp căn cứ pháp lý' })
  @IsString()
  legal_reference: string;

  @IsOptional()
  @IsEnum(SeverityLevel)
  severity?: SeverityLevel = SeverityLevel.STANDARD;

  @IsOptional()
  @IsString()
  cycle?: string = 'ONE_TIME';

  @IsOptional()
  trigger_conditions?: Record<string, any>;

  @IsOptional()
  @IsString()
  penalty_summary?: string;

  @IsOptional()
  @IsString()
  action_guide?: string;

  @IsOptional()
  @IsString()
  required_evidence_type?: string;
}
