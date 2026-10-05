import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PermissionCode } from '../../configs/constants.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { ComplianceProfileService } from './compliance-profile.service.js';
import { UpdateComplianceProfileDto } from './dto/update-compliance-profile.dto.js';

@Controller('compliance/profile')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ComplianceProfileController {
  constructor(private readonly profileService: ComplianceProfileService) {}

  /**
   * 1. Lấy thông tin hồ sơ tuân thủ số của doanh nghiệp hiện tại
   */
  @Get()
  @RequirePermissions(PermissionCode.PROFILE_VIEW)
  async getProfile(@CurrentUser('companyId') companyId: number) {
    return this.profileService.getProfile(companyId);
  }

  /**
   * 2. Cập nhật thông tin khảo sát hồ sơ tuân thủ số
   */
  @Put()
  @RequirePermissions(PermissionCode.PROFILE_UPDATE)
  async updateProfile(
    @CurrentUser('companyId') companyId: number,
    @Body() dto: UpdateComplianceProfileDto,
  ) {
    return this.profileService.updateProfile(companyId, dto);
  }
}
