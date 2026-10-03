import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { RbacService } from './rbac.service.js';

@Controller('rbac')
@UseGuards(JwtAuthGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  /**
   * Lấy danh sách các vai trò để gán cho nhân viên
   */
  @Get('roles')
  async getAssignableRoles() {
    return this.rbacService.getAssignableRoles();
  }
}
