import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionCode } from '../../configs/constants.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { CreateRequirementDto } from './dto/create-requirement.dto.js';
import { LegalSearchDto } from './dto/legal-search.dto.js';
import { LegalKnowledgeService } from './legal-knowledge.service.js';

@Controller('legal')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LegalKnowledgeController {
  constructor(private readonly legalService: LegalKnowledgeService) {}

  /**
   * 1. Lấy danh sách văn bản luật
   */
  @Get('regulations')
  @RequirePermissions(PermissionCode.LEGAL_VIEW)
  async getRegulations() {
    return this.legalService.getAllRegulations();
  }

  /**
   * 2. Lấy chi tiết văn bản luật kèm các điều khoản
   */
  @Get('regulations/:id')
  @RequirePermissions(PermissionCode.LEGAL_VIEW)
  async getRegulationDetail(@Param('id', ParseIntPipe) id: number) {
    return this.legalService.getRegulationById(id);
  }

  /**
   * 3. Lấy danh sách các điều khoản nghĩa vụ (hỗ trợ lọc theo category)
   */
  @Get('requirements')
  @RequirePermissions(PermissionCode.LEGAL_VIEW)
  async getRequirements(@Query('category') category?: string) {
    return this.legalService.getAllRequirements(category);
  }

  /**
   * 4. Tìm kiếm ngữ nghĩa quy định pháp lý (RAG Semantic Search)
   */
  @Post('search')
  @RequirePermissions(PermissionCode.LEGAL_VIEW)
  async searchRequirements(@Body() dto: LegalSearchDto) {
    return this.legalService.searchSimilarRequirements(dto);
  }

  /**
   * 5. Tạo mới điều khoản nghĩa vụ (Chỉ dành cho Admin hệ thống)
   */
  @Post('requirements')
  @RequirePermissions(PermissionCode.LEGAL_MANAGE)
  async createRequirement(@Body() dto: CreateRequirementDto) {
    return this.legalService.createRequirement(dto);
  }

  /**
   * 6. Kích hoạt nạp dữ liệu kho luật mẫu
   */
  @Post('seed')
  @RequirePermissions(PermissionCode.LEGAL_MANAGE)
  async seedLegalData() {
    await this.legalService.seedLegalData();
    return { message: 'Đã nạp thành công kho tri thức pháp lý mẫu.' };
  }
}
