import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterCompanyDto {
  // --- Thông tin Doanh nghiệp ---
  @IsNotEmpty({ message: 'Tên doanh nghiệp không được để trống' })
  @IsString({ message: 'Tên doanh nghiệp phải là chuỗi' })
  company_name: string;

  @IsNotEmpty({ message: 'Mã số thuế không được để trống' })
  @IsString({ message: 'Mã số thuế phải là chuỗi' })
  tax_code: string;

  @IsNotEmpty({ message: 'Email doanh nghiệp không được để trống' })
  @IsEmail({}, { message: 'Email doanh nghiệp không đúng định dạng' })
  company_email: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại doanh nghiệp phải là chuỗi' })
  company_phone?: string;

  @IsOptional()
  @IsString({ message: 'Địa chỉ doanh nghiệp phải là chuỗi' })
  address?: string;

  // --- Thông tin Chủ tài khoản (COMPANY_ADMIN) ---
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @IsString({ message: 'Tên đăng nhập phải là chuỗi' })
  @MinLength(3, { message: 'Tên đăng nhập tối thiểu 3 ký tự' })
  username: string;

  @IsNotEmpty({ message: 'Email người đại diện không được để trống' })
  @IsEmail({}, { message: 'Email người đại diện không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Họ và tên người đại diện không được để trống' })
  @IsString({ message: 'Họ và tên người đại diện phải là chuỗi' })
  full_name: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại người đại diện phải là chuỗi' })
  phone?: string;
}
