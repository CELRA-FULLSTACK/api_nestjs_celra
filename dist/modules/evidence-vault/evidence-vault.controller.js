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
import { BadRequestException, Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { PermissionCode } from '../../configs/constants.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { EvidenceVaultService } from './evidence-vault.service.js';
let EvidenceVaultController = class EvidenceVaultController {
    evidenceService;
    constructor(evidenceService) {
        this.evidenceService = evidenceService;
    }
    async uploadTaskEvidence(companyId, userId, taskId, file) {
        return this.evidenceService.uploadEvidence(companyId, taskId, userId, file);
    }
    async getCompanyEvidences(companyId) {
        return this.evidenceService.getCompanyEvidences(companyId);
    }
    async deleteEvidence(companyId, id) {
        return this.evidenceService.deleteEvidence(companyId, id);
    }
};
__decorate([
    Post('tasks/:taskId'),
    RequirePermissions(PermissionCode.EVIDENCE_UPLOAD),
    UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: path.resolve(process.cwd(), 'uploads', 'evidences'),
            filename: (_req, file, callback) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const ext = path.extname(file.originalname);
                callback(null, `${uniqueSuffix}${ext}`);
            },
        }),
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (_req, file, callback) => {
            const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.docx', '.xlsx'];
            const ext = path.extname(file.originalname).toLowerCase();
            if (!allowedExtensions.includes(ext)) {
                return callback(new BadRequestException(`Chỉ chấp nhận các định dạng file: ${allowedExtensions.join(', ')}`), false);
            }
            callback(null, true);
        },
    })),
    __param(0, CurrentUser('companyId')),
    __param(1, CurrentUser('userId')),
    __param(2, Param('taskId', ParseIntPipe)),
    __param(3, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], EvidenceVaultController.prototype, "uploadTaskEvidence", null);
__decorate([
    Get(),
    RequirePermissions(PermissionCode.EVIDENCE_VIEW),
    __param(0, CurrentUser('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EvidenceVaultController.prototype, "getCompanyEvidences", null);
__decorate([
    Delete(':id'),
    RequirePermissions(PermissionCode.EVIDENCE_UPLOAD),
    __param(0, CurrentUser('companyId')),
    __param(1, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], EvidenceVaultController.prototype, "deleteEvidence", null);
EvidenceVaultController = __decorate([
    Controller('evidences'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [EvidenceVaultService])
], EvidenceVaultController);
export { EvidenceVaultController };
//# sourceMappingURL=evidence-vault.controller.js.map