var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class ResetPasswordDto {
    token;
    new_password;
}
__decorate([
    IsNotEmpty({ message: 'Token không được để trống' }),
    IsString({ message: 'Token phải là chuỗi' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    IsNotEmpty({ message: 'Mật khẩu mới không được để trống' }),
    IsString({ message: 'Mật khẩu mới phải là chuỗi' }),
    MinLength(6, { message: 'Mật khẩu mới tối thiểu 6 ký tự' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "new_password", void 0);
//# sourceMappingURL=reset-password.dto.js.map