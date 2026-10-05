var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class LegalSearchDto {
    query;
    category;
    limit = 5;
}
__decorate([
    IsNotEmpty({ message: 'Vui lòng cung cấp nội dung truy vấn tìm kiếm' }),
    IsString(),
    __metadata("design:type", String)
], LegalSearchDto.prototype, "query", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], LegalSearchDto.prototype, "category", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], LegalSearchDto.prototype, "limit", void 0);
//# sourceMappingURL=legal-search.dto.js.map