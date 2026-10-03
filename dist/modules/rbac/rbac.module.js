var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../core/auth/auth.module.js';
import { Role } from '../../database/entities/role.entity.js';
import { RbacController } from './rbac.controller.js';
import { RbacService } from './rbac.service.js';
import { RoleController } from './role.controller.js';
import { RoleService } from './role.service.js';
let RbacModule = class RbacModule {
};
RbacModule = __decorate([
    Module({
        imports: [AuthModule, TypeOrmModule.forFeature([Role])],
        controllers: [RbacController, RoleController],
        providers: [RbacService, RoleService],
        exports: [RbacService, RoleService],
    })
], RbacModule);
export { RbacModule };
//# sourceMappingURL=rbac.module.js.map