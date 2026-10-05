var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards, } from '@nestjs/common';
import { PermissionCode } from '../../configs/constants.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { ComplianceTaskService } from './compliance-task.service.js';
import { AssignTaskDto } from './dto/assign-task.dto.js';
import { FilterTaskDto } from './dto/filter-task.dto.js';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto.js';
let ComplianceTaskController = class ComplianceTaskController {
    taskService;
    constructor(taskService) {
        this.taskService = taskService;
    }
    async getTasks(companyId, filter) {
        return this.taskService.getTasks(companyId, filter);
    }
    async getKanbanBoard(companyId) {
        return this.taskService.getKanbanBoard(companyId);
    }
    async getTaskDetail(companyId, id) {
        return this.taskService.getTaskById(companyId, id);
    }
    async updateStatus(companyId, id, dto) {
        return this.taskService.updateStatus(companyId, id, dto);
    }
    async assignTask(companyId, id, dto) {
        return this.taskService.assignTask(companyId, id, dto);
    }
};
__decorate([
    Get(),
    RequirePermissions(PermissionCode.TASK_VIEW),
    __param(0, CurrentUser('companyId')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, FilterTaskDto]),
    __metadata("design:returntype", Promise)
], ComplianceTaskController.prototype, "getTasks", null);
__decorate([
    Get('kanban'),
    RequirePermissions(PermissionCode.TASK_VIEW),
    __param(0, CurrentUser('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComplianceTaskController.prototype, "getKanbanBoard", null);
__decorate([
    Get(':id'),
    RequirePermissions(PermissionCode.TASK_VIEW),
    __param(0, CurrentUser('companyId')),
    __param(1, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ComplianceTaskController.prototype, "getTaskDetail", null);
__decorate([
    Patch(':id/status'),
    RequirePermissions(PermissionCode.TASK_UPDATE),
    __param(0, CurrentUser('companyId')),
    __param(1, Param('id', ParseIntPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, UpdateTaskStatusDto]),
    __metadata("design:returntype", Promise)
], ComplianceTaskController.prototype, "updateStatus", null);
__decorate([
    Patch(':id/assign'),
    RequirePermissions(PermissionCode.TASK_UPDATE),
    __param(0, CurrentUser('companyId')),
    __param(1, Param('id', ParseIntPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, AssignTaskDto]),
    __metadata("design:returntype", Promise)
], ComplianceTaskController.prototype, "assignTask", null);
ComplianceTaskController = __decorate([
    Controller('tasks'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [ComplianceTaskService])
], ComplianceTaskController);
export { ComplianceTaskController };
//# sourceMappingURL=compliance-task.controller.js.map