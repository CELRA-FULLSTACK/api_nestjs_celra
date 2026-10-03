var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength, } from 'class-validator';
export class CreateEmployeeDto {
    username;
    email;
    password;
    full_name;
    phone;
    role_id;
}
__decorate([
    IsNotEmpty({ message: 'Tên đăng nhập không được để trống' }),
    IsString({ message: 'Tên đăng nhập phải là chuỗi' }),
    MinLength(3, { message: 'Tên đăng nhập tối thiểu 3 ký tự' }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "username", void 0);
__decorate([
    IsNotEmpty({ message: 'Email nhân viên không được để trống' }),
    IsEmail({}, { message: 'Email nhân viên không đúng định dạng' }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "email", void 0);
__decorate([
    IsNotEmpty({ message: 'Mật khẩu ban đầu không được để trống' }),
    IsString({ message: 'Mật khẩu ban đầu phải là chuỗi' }),
    MinLength(6, { message: 'Mật khẩu ban đầu tối thiểu 6 ký tự' }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "password", void 0);
__decorate([
    IsNotEmpty({ message: 'Họ và tên nhân viên không được để trống' }),
    IsString({ message: 'Họ và tên phải là chuỗi' }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "full_name", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Số điện thoại phải là chuỗi' }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "phone", void 0);
__decorate([
    IsNotEmpty({ message: 'Vai trò (role_id) không được để trống' }),
    IsInt({ message: 'role_id phải là số nguyên' }),
    __metadata("design:type", Number)
], CreateEmployeeDto.prototype, "role_id", void 0);
//# sourceMappingURL=create-employee.dto.js.map