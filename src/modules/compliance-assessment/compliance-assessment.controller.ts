import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PermissionCode } from '../../configs/constants.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { ComplianceAssessmentService } from './compliance-assessment.service.js';

@Controller('compliance/assessments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ComplianceAssessmentController {
  constructor(private readonly assessmentService: ComplianceAssessmentService) {}

  /**
   * 1. Kích hoạt quét và chạy đánh giá tuân thủ tự động (AI Engine)
   */
  @Post('run')
  @RequirePermissions(PermissionCode.COMPLIANCE_ASSESS)
  async runAssessment(
    @CurrentUser('companyId') companyId: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.assessmentService.runAssessment(companyId, userId);
  }

  /**
   * 2. Lấy báo cáo đánh giá tuân thủ mới nhất của doanh nghiệp
   */
  @Get('latest')
  @RequirePermissions(PermissionCode.COMPLIANCE_VIEW)
  async getLatestAssessment(@CurrentUser('companyId') companyId: number) {
    return this.assessmentService.getLatestAssessment(companyId);
  }

  /**
   * 3. Lấy chi tiết phiên đánh giá theo ID
   */
  @Get(':id')
  @RequirePermissions(PermissionCode.COMPLIANCE_VIEW)
  async getAssessmentById(
    @CurrentUser('companyId') companyId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.assessmentService.getAssessmentById(companyId, id);
  }
}
