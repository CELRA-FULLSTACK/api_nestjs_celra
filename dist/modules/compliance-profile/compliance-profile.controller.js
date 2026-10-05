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
import { Body, Controller, Get, Put, UseGuards, } from '@nestjs/common';
import { PermissionCode } from '../../configs/constants.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { ComplianceProfileService } from './compliance-profile.service.js';
import { UpdateComplianceProfileDto } from './dto/update-compliance-profile.dto.js';
let ComplianceProfileController = class ComplianceProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    async getProfile(companyId) {
        return this.profileService.getProfile(companyId);
    }
    async updateProfile(companyId, dto) {
        return this.profileService.updateProfile(companyId, dto);
    }
};
__decorate([
    Get(),
    RequirePermissions(PermissionCode.PROFILE_VIEW),
    __param(0, CurrentUser('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComplianceProfileController.prototype, "getProfile", null);
__decorate([
    Put(),
    RequirePermissions(PermissionCode.PROFILE_UPDATE),
    __param(0, CurrentUser('companyId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateComplianceProfileDto]),
    __metadata("design:returntype", Promise)
], ComplianceProfileController.prototype, "updateProfile", null);
ComplianceProfileController = __decorate([
    Controller('compliance/profile'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [ComplianceProfileService])
], ComplianceProfileController);
export { ComplianceProfileController };
//# sourceMappingURL=compliance-profile.controller.js.map