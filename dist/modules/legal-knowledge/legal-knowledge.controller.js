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
import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards, } from '@nestjs/common';
import { PermissionCode } from '../../configs/constants.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { CreateRequirementDto } from './dto/create-requirement.dto.js';
import { LegalSearchDto } from './dto/legal-search.dto.js';
import { LegalKnowledgeService } from './legal-knowledge.service.js';
let LegalKnowledgeController = class LegalKnowledgeController {
    legalService;
    constructor(legalService) {
        this.legalService = legalService;
    }
    async getRegulations() {
        return this.legalService.getAllRegulations();
    }
    async getRegulationDetail(id) {
        return this.legalService.getRegulationById(id);
    }
    async getRequirements(category) {
        return this.legalService.getAllRequirements(category);
    }
    async searchRequirements(dto) {
        return this.legalService.searchSimilarRequirements(dto);
    }
    async createRequirement(dto) {
        return this.legalService.createRequirement(dto);
    }
    async seedLegalData() {
        await this.legalService.seedLegalData();
        return { message: 'Đã nạp thành công kho tri thức pháp lý mẫu.' };
    }
};
__decorate([
    Get('regulations'),
    RequirePermissions(PermissionCode.LEGAL_VIEW),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LegalKnowledgeController.prototype, "getRegulations", null);
__decorate([
    Get('regulations/:id'),
    RequirePermissions(PermissionCode.LEGAL_VIEW),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LegalKnowledgeController.prototype, "getRegulationDetail", null);
__decorate([
    Get('requirements'),
    RequirePermissions(PermissionCode.LEGAL_VIEW),
    __param(0, Query('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LegalKnowledgeController.prototype, "getRequirements", null);
__decorate([
    Post('search'),
    RequirePermissions(PermissionCode.LEGAL_VIEW),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LegalSearchDto]),
    __metadata("design:returntype", Promise)
], LegalKnowledgeController.prototype, "searchRequirements", null);
__decorate([
    Post('requirements'),
    RequirePermissions(PermissionCode.LEGAL_MANAGE),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRequirementDto]),
    __metadata("design:returntype", Promise)
], LegalKnowledgeController.prototype, "createRequirement", null);
__decorate([
    Post('seed'),
    RequirePermissions(PermissionCode.LEGAL_MANAGE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LegalKnowledgeController.prototype, "seedLegalData", null);
LegalKnowledgeController = __decorate([
    Controller('legal'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [LegalKnowledgeService])
], LegalKnowledgeController);
export { LegalKnowledgeController };
//# sourceMappingURL=legal-knowledge.controller.js.map