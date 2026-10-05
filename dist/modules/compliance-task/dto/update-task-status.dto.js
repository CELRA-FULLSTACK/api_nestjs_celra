var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../../../configs/constants.js';
export class UpdateTaskStatusDto {
    status;
    completion_note;
}
__decorate([
    IsNotEmpty({ message: 'Vui lòng cung cấp trạng thái mới cho task' }),
    IsEnum(TaskStatus, { message: 'Trạng thái không hợp lệ' }),
    __metadata("design:type", String)
], UpdateTaskStatusDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateTaskStatusDto.prototype, "completion_note", void 0);
//# sourceMappingURL=update-task-status.dto.js.map