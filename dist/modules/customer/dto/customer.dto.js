var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, } from 'class-validator';
import { CustomerStatus } from '../../../database/entities/customer.entity.js';
export class CreateCustomerDto {
    name;
    phone;
    email;
    address;
    notes;
}
__decorate([
    IsNotEmpty({ message: 'Tên khách hàng không được để trống' }),
    IsString(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "name", void 0);
__decorate([
    IsNotEmpty({ message: 'Số điện thoại không được để trống' }),
    Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
        message: 'Số điện thoại không đúng định dạng',
    }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    IsEmail({}, { message: 'Email không đúng định dạng' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "email", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "address", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "notes", void 0);
export class UpdateCustomerDto {
    name;
    phone;
    email;
    address;
    notes;
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
        message: 'Số điện thoại không đúng định dạng',
    }),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    IsEmail({}, { message: 'Email không đúng định dạng' }),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "email", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "address", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "notes", void 0);
export class ToggleCustomerStatusDto {
    status;
}
__decorate([
    IsNotEmpty(),
    IsEnum(CustomerStatus),
    __metadata("design:type", String)
], ToggleCustomerStatusDto.prototype, "status", void 0);
//# sourceMappingURL=customer.dto.js.map