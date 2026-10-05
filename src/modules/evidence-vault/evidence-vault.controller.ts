import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { PermissionCode } from '../../configs/constants.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { EvidenceVaultService } from './evidence-vault.service.js';

@Controller('evidences')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EvidenceVaultController {
  constructor(private readonly evidenceService: EvidenceVaultService) {}

  /**
   * 1. Upload hồ sơ minh chứng cho Task tuân thủ
   */
  @Post('tasks/:taskId')
  @RequirePermissions(PermissionCode.EVIDENCE_UPLOAD)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.resolve(process.cwd(), 'uploads', 'evidences'),
        filename: (_req: any, file: any, callback: (error: Error | null, filename: string) => void) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (_req: any, file: any, callback: (error: Error | null, acceptFile: boolean) => void) => {
        const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.docx', '.xlsx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
          return callback(
            new BadRequestException(
              `Chỉ chấp nhận các định dạng file: ${allowedExtensions.join(', ')}`,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadTaskEvidence(
    @CurrentUser('companyId') companyId: number,
    @CurrentUser('userId') userId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @UploadedFile() file: any,
  ) {
    return this.evidenceService.uploadEvidence(companyId, taskId, userId, file);
  }

  /**
   * 2. Lấy toàn bộ danh sách hồ sơ minh chứng của doanh nghiệp (Document Vault)
   */
  @Get()
  @RequirePermissions(PermissionCode.EVIDENCE_VIEW)
  async getCompanyEvidences(@CurrentUser('companyId') companyId: number) {
    return this.evidenceService.getCompanyEvidences(companyId);
  }

  /**
   * 3. Xóa một file minh chứng
   */
  @Delete(':id')
  @RequirePermissions(PermissionCode.EVIDENCE_UPLOAD)
  async deleteEvidence(
    @CurrentUser('companyId') companyId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.evidenceService.deleteEvidence(companyId, id);
  }
}
