var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { SeverityLevel } from '../../../configs/constants.js';
export class CreateRequirementDto {
    regulation_id;
    requirement_code;
    title;
    description;
    legal_reference;
    severity = SeverityLevel.STANDARD;
    cycle = 'ONE_TIME';
    trigger_conditions;
    penalty_summary;
    action_guide;
    required_evidence_type;
}
__decorate([
    IsNotEmpty({ message: 'Vui lòng cung cấp mã văn bản luật (regulation_id)' }),
    IsNumber(),
    __metadata("design:type", Number)
], CreateRequirementDto.prototype, "regulation_id", void 0);
__decorate([
    IsNotEmpty({ message: 'Vui lòng cung cấp mã nghĩa vụ' }),
    IsString(),
    __metadata("design:type", String)
], CreateRequirementDto.prototype, "requirement_code", void 0);
__decorate([
    IsNotEmpty({ message: 'Vui lòng cung cấp tiêu đề nghĩa vụ' }),
    IsString(),
    __metadata("design:type", String)
], CreateRequirementDto.prototype, "title", void 0);
__decorate([
    IsNotEmpty({ message: 'Vui lòng cung cấp mô tả chi tiết' }),
    IsString(),
    __metadata("design:type", String)
], CreateRequirementDto.prototype, "description", void 0);
__decorate([
    IsNotEmpty({ message: 'Vui lòng cung cấp căn cứ pháp lý' }),
    IsString(),
    __metadata("design:type", String)
], CreateRequirementDto.prototype, "legal_reference", void 0);
__decorate([
    IsOptional(),
    IsEnum(SeverityLevel),
    __metadata("design:type", String)
], CreateRequirementDto.prototype, "severity", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateRequirementDto.prototype, "cycle", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", Object)
], CreateRequirementDto.prototype, "trigger_conditions", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateRequirementDto.prototype, "penalty_summary", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateRequirementDto.prototype, "action_guide", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateRequirementDto.prototype, "required_evidence_type", void 0);
//# sourceMappingURL=create-requirement.dto.js.map