import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolePermission } from '../../database/entities/role.entity.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { RoleService } from './role.service.js';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getRoles() {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  async getRoleById(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.getRoleById(id);
  }

  @Post()
  async createRole(
    @Body()
    data: {
      name: string;
      code: string;
      description?: string;
      permissions?: RolePermission[];
    },
  ) {
    return this.roleService.createRole(data);
  }

  @Put(':id')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { name?: string; description?: string },
  ) {
    return this.roleService.updateRole(id, data);
  }

  @Put(':id/permissions')
  async updateRolePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { permissions: RolePermission[] },
  ) {
    return this.roleService.updateRolePermissions(id, data.permissions);
  }

  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.deleteRole(id);
  }
}
