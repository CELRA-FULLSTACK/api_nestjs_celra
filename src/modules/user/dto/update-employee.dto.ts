import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserStatus } from '../../../configs/constants.js';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString({ message: 'Họ và tên phải là chuỗi' })
  full_name?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phone?: string;

  @IsOptional()
  @IsEnum(UserStatus, { message: 'Trạng thái không hợp lệ' })
  status?: UserStatus;

  @IsOptional()
  @IsInt({ message: 'role_id phải là số nguyên' })
  role_id?: number;

  @IsOptional()
  @IsString({ message: 'Mật khẩu mới phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu mới tối thiểu 6 ký tự' })
  new_password?: string;
}
