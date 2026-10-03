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
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards, } from '@nestjs/common';
import { PermissionCode } from '../../configs/constants.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { UserService } from './user.service.js';
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async createEmployee(companyId, dto) {
        return this.userService.createEmployee(companyId, dto);
    }
    async getEmployees(companyId) {
        return this.userService.findAllByCompany(companyId);
    }
    async getEmployeeDetail(companyId, id) {
        return this.userService.findOneByCompany(companyId, id);
    }
    async updateEmployee(companyId, id, dto) {
        return this.userService.updateEmployee(companyId, id, dto);
    }
    async deleteEmployee(companyId, currentUserId, id) {
        return this.userService.deleteEmployee(companyId, id, currentUserId);
    }
};
__decorate([
    Post(),
    RequirePermissions(PermissionCode.EMPLOYEE_CREATE),
    HttpCode(HttpStatus.CREATED),
    __param(0, CurrentUser('companyId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createEmployee", null);
__decorate([
    Get(),
    RequirePermissions(PermissionCode.EMPLOYEE_VIEW),
    __param(0, CurrentUser('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getEmployees", null);
__decorate([
    Get(':id'),
    RequirePermissions(PermissionCode.EMPLOYEE_VIEW),
    __param(0, CurrentUser('companyId')),
    __param(1, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getEmployeeDetail", null);
__decorate([
    Patch(':id'),
    RequirePermissions(PermissionCode.EMPLOYEE_UPDATE),
    __param(0, CurrentUser('companyId')),
    __param(1, Param('id', ParseIntPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateEmployee", null);
__decorate([
    Delete(':id'),
    RequirePermissions(PermissionCode.EMPLOYEE_DELETE),
    __param(0, CurrentUser('companyId')),
    __param(1, CurrentUser('userId')),
    __param(2, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteEmployee", null);
UserController = __decorate([
    Controller('users'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [UserService])
], UserController);
export { UserController };
//# sourceMappingURL=user.controller.js.map