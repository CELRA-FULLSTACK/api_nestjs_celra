import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionCode } from '../../configs/constants.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { CustomerStatus } from '../../database/entities/customer.entity.js';
import { CustomerService } from './customer.service.js';
import {
  CreateCustomerDto,
  ToggleCustomerStatusDto,
  UpdateCustomerDto,
} from './dto/customer.dto.js';

@Controller('customers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @RequirePermissions(PermissionCode.CUSTOMER_VIEW)
  async listCustomers(
    @Query('search') search?: string,
    @Query('status') status?: CustomerStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.customerService.listCustomers({
      search,
      status,
      page: page || 1,
      limit: limit || 10,
    });
  }

  @Post()
  @RequirePermissions(PermissionCode.CUSTOMER_CREATE)
  async createCustomer(
    @Body() dto: CreateCustomerDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.customerService.createCustomer(dto, userId);
  }

  @Patch(':id')
  @RequirePermissions(PermissionCode.CUSTOMER_UPDATE)
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, dto);
  }

  @Patch(':id/status')
  @RequirePermissions(PermissionCode.CUSTOMER_UPDATE)
  async toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ToggleCustomerStatusDto,
  ) {
    return this.customerService.toggleStatus(id, dto.status);
  }
}
