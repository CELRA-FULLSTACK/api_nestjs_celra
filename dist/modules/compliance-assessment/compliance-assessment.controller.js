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
import { Controller, Get, Param, ParseIntPipe, Post, UseGuards, } from '@nestjs/common';
import { PermissionCode } from '../../configs/constants.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { ComplianceAssessmentService } from './compliance-assessment.service.js';
let ComplianceAssessmentController = class ComplianceAssessmentController {
    assessmentService;
    constructor(assessmentService) {
        this.assessmentService = assessmentService;
    }
    async runAssessment(companyId, userId) {
        return this.assessmentService.runAssessment(companyId, userId);
    }
    async getLatestAssessment(companyId) {
        return this.assessmentService.getLatestAssessment(companyId);
    }
    async getAssessmentById(companyId, id) {
        return this.assessmentService.getAssessmentById(companyId, id);
    }
};
__decorate([
    Post('run'),
    RequirePermissions(PermissionCode.COMPLIANCE_ASSESS),
    __param(0, CurrentUser('companyId')),
    __param(1, CurrentUser('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "runAssessment", null);
__decorate([
    Get('latest'),
    RequirePermissions(PermissionCode.COMPLIANCE_VIEW),
    __param(0, CurrentUser('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "getLatestAssessment", null);
__decorate([
    Get(':id'),
    RequirePermissions(PermissionCode.COMPLIANCE_VIEW),
    __param(0, CurrentUser('companyId')),
    __param(1, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ComplianceAssessmentController.prototype, "getAssessmentById", null);
ComplianceAssessmentController = __decorate([
    Controller('compliance/assessments'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [ComplianceAssessmentService])
], ComplianceAssessmentController);
export { ComplianceAssessmentController };
//# sourceMappingURL=compliance-assessment.controller.js.map