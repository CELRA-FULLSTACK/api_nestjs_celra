import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @IsString({ message: 'Tên đăng nhập phải là chuỗi' })
  @MinLength(3, { message: 'Tên đăng nhập tối thiểu 3 ký tự' })
  username: string;

  @IsNotEmpty({ message: 'Email nhân viên không được để trống' })
  @IsEmail({}, { message: 'Email nhân viên không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu ban đầu không được để trống' })
  @IsString({ message: 'Mật khẩu ban đầu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu ban đầu tối thiểu 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Họ và tên nhân viên không được để trống' })
  @IsString({ message: 'Họ và tên phải là chuỗi' })
  full_name: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phone?: string;

  @IsNotEmpty({ message: 'Vai trò (role_id) không được để trống' })
  @IsInt({ message: 'role_id phải là số nguyên' })
  role_id: number;
}
