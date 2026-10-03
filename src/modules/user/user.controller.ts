import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PermissionCode } from '../../configs/constants.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { UserService } from './user.service.js';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 1. Tạo tài khoản nhân viên mới cho doanh nghiệp
   */
  @Post()
  @RequirePermissions(PermissionCode.EMPLOYEE_CREATE)
  @HttpCode(HttpStatus.CREATED)
  async createEmployee(
    @CurrentUser('companyId') companyId: number,
    @Body() dto: CreateEmployeeDto,
  ) {
    return this.userService.createEmployee(companyId, dto);
  }

  /**
   * 2. Lấy danh sách nhân viên của doanh nghiệp
   */
  @Get()
  @RequirePermissions(PermissionCode.EMPLOYEE_VIEW)
  async getEmployees(@CurrentUser('companyId') companyId: number) {
    return this.userService.findAllByCompany(companyId);
  }

  /**
   * 3. Lấy chi tiết một nhân viên
   */
  @Get(':id')
  @RequirePermissions(PermissionCode.EMPLOYEE_VIEW)
  async getEmployeeDetail(
    @CurrentUser('companyId') companyId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.findOneByCompany(companyId, id);
  }

  /**
   * 4. Cập nhật thông tin nhân viên
   */
  @Patch(':id')
  @RequirePermissions(PermissionCode.EMPLOYEE_UPDATE)
  async updateEmployee(
    @CurrentUser('companyId') companyId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.userService.updateEmployee(companyId, id, dto);
  }

  /**
   * 5. Khóa nhân viên
   */
  @Delete(':id')
  @RequirePermissions(PermissionCode.EMPLOYEE_DELETE)
  async deleteEmployee(
    @CurrentUser('companyId') companyId: number,
    @CurrentUser('userId') currentUserId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.deleteEmployee(companyId, id, currentUserId);
  }
}
