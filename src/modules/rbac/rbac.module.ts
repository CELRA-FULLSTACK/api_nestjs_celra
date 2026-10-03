import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../core/auth/auth.module.js';
import { Role } from '../../database/entities/role.entity.js';
import { RbacController } from './rbac.controller.js';
import { RbacService } from './rbac.service.js';
import { RoleController } from './role.controller.js';
import { RoleService } from './role.service.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Role])],
  controllers: [RbacController, RoleController],
  providers: [RbacService, RoleService],
  exports: [RbacService, RoleService],
})
export class RbacModule {}
