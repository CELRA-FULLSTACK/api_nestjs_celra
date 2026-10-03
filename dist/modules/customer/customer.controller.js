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
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, } from '@nestjs/common';
import { PermissionCode } from '../../configs/constants.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { CustomerStatus } from '../../database/entities/customer.entity.js';
import { CustomerService } from './customer.service.js';
import { CreateCustomerDto, ToggleCustomerStatusDto, UpdateCustomerDto, } from './dto/customer.dto.js';
let CustomerController = class CustomerController {
    customerService;
    constructor(customerService) {
        this.customerService = customerService;
    }
    async listCustomers(search, status, page, limit) {
        return this.customerService.listCustomers({
            search,
            status,
            page: page || 1,
            limit: limit || 10,
        });
    }
    async createCustomer(dto, userId) {
        return this.customerService.createCustomer(dto, userId);
    }
    async updateCustomer(id, dto) {
        return this.customerService.updateCustomer(id, dto);
    }
    async toggleStatus(id, dto) {
        return this.customerService.toggleStatus(id, dto.status);
    }
};
__decorate([
    Get(),
    RequirePermissions(PermissionCode.CUSTOMER_VIEW),
    __param(0, Query('search')),
    __param(1, Query('status')),
    __param(2, Query('page')),
    __param(3, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "listCustomers", null);
__decorate([
    Post(),
    RequirePermissions(PermissionCode.CUSTOMER_CREATE),
    __param(0, Body()),
    __param(1, CurrentUser('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCustomerDto, Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "createCustomer", null);
__decorate([
    Patch(':id'),
    RequirePermissions(PermissionCode.CUSTOMER_UPDATE),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateCustomer", null);
__decorate([
    Patch(':id/status'),
    RequirePermissions(PermissionCode.CUSTOMER_UPDATE),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ToggleCustomerStatusDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "toggleStatus", null);
CustomerController = __decorate([
    Controller('customers'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [CustomerService])
], CustomerController);
export { CustomerController };
//# sourceMappingURL=customer.controller.js.map