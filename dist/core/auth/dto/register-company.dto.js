var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, } from 'class-validator';
export class RegisterCompanyDto {
    company_name;
    tax_code;
    company_email;
    company_phone;
    address;
    username;
    email;
    password;
    full_name;
    phone;
}
__decorate([
    IsNotEmpty({ message: 'Tên doanh nghiệp không được để trống' }),
    IsString({ message: 'Tên doanh nghiệp phải là chuỗi' }),
    __metadata("design:type", String)
], RegisterCompanyDto.prototype, "company_name", void 0);
__decorate([
    IsNotEmpty({ message: 'Mã số thuế không được để trống' }),
    IsString({ message: 'Mã số thuế phải là chuỗi' }),
    __metadata("design:type", String)
], RegisterCompanyDto.prototype, "tax_code", void 0);
__decorate([
    IsNotEmpty({ message: 'Email doanh nghiệp không được để trống' }),
    IsEmail({}, { message: 'Email doanh nghiệp không đúng định dạng' }),
    __metadata("design:type", String)
], RegisterCompanyDto.prototype, "company_email", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Số điện thoại doanh nghiệp phải là chuỗi' }),
    __metadata("design:type", String)
], RegisterCompanyDto.prototype, "company_phone", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Địa chỉ doanh nghiệp phải là chuỗi' }),
    __metadata("design:type", String)
], RegisterCompanyDto.prototype, "address", void 0);
__decorate([
    IsNotEmpty({ message: 'Tên đăng nhập không được để trống' }),
    IsString({ message: 'Tên đăng nhập phải là chuỗi' }),
    MinLength(3, { message: 'Tên đăng nhập tối thiểu 3 ký tự' }),
    __metadata("design:type", String)
], RegisterCompanyDto.prototype, "username", void 0);
__decorate([
    IsNotEmpty({ message: 'Email người đại diện không được để trống' }),
    IsEmail({}, { message: 'Email người đại diện không đúng định dạng' }),
    __metadata("design:type", String)
], RegisterCompanyDto.prototype, "email", void 0);
__decorate([
    IsNotEmpty({ message: 'Mật khẩu không được để trống' }),
    IsString({ message: 'Mật khẩu phải là chuỗi' }),
    MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' }),
    __metadata("design:type", String)
], RegisterCompanyDto.prototype, "password", void 0);
__decorate([
    IsNotEmpty({ message: 'Họ và tên người đại diện không được để trống' }),
    IsString({ message: 'Họ và tên người đại diện phải là chuỗi' }),
    __metadata("design:type", String)
], RegisterCompanyDto.prototype, "full_name", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Số điện thoại người đại diện phải là chuỗi' }),
    __metadata("design:type", String)
], RegisterCompanyDto.prototype, "phone", void 0);
//# sourceMappingURL=register-company.dto.js.map