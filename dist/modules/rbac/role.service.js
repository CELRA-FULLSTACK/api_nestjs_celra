var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RoleService_1;
import { ConflictException, Injectable, Logger, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../database/entities/role.entity.js';
export const SYSTEM_RESOURCES = [
    { resource: 'dashboard', label: 'Tổng quan Dashboard' },
    { resource: 'employees', label: 'Quản lý Nhân sự' },
    { resource: 'customers', label: 'Quản lý Khách hàng' },
    { resource: 'roles', label: 'Quản lý Vai trò & Phân quyền' },
    { resource: 'company', label: 'Thông tin Doanh nghiệp' },
];
export const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE'];
let RoleService = RoleService_1 = class RoleService {
    roleRepo;
    logger = new Logger(RoleService_1.name);
    constructor(roleRepo) {
        this.roleRepo = roleRepo;
    }
    async getAllRoles() {
        const roles = await this.roleRepo.find({
            order: { created_at: 'ASC' },
        });
        return { roles, systemResources: SYSTEM_RESOURCES };
    }
    async getRoleById(id) {
        const role = await this.roleRepo.findOne({ where: { id } });
        if (!role)
            throw new NotFoundException('Không tìm thấy vai trò.');
        return role;
    }
    async createRole(data) {
        const existing = await this.roleRepo.findOne({
            where: { code: data.code.toUpperCase() },
        });
        if (existing) {
            throw new ConflictException('Mã vai trò này đã tồn tại.');
        }
        const role = this.roleRepo.create({
            name: data.name,
            code: data.code.toUpperCase(),
            description: data.description || '',
            is_system: false,
            permission_matrix: data.permissions || [],
        });
        return this.roleRepo.save(role);
    }
    async updateRole(id, data) {
        const role = await this.roleRepo.findOne({ where: { id } });
        if (!role)
            throw new NotFoundException('Không tìm thấy vai trò.');
        if (data.name)
            role.name = data.name;
        if (data.description !== undefined)
            role.description = data.description;
        return this.roleRepo.save(role);
    }
    async updateRolePermissions(id, permissions) {
        const role = await this.roleRepo.findOne({ where: { id } });
        if (!role)
            throw new NotFoundException('Không tìm thấy vai trò.');
        role.permission_matrix = permissions;
        return this.roleRepo.save(role);
    }
    async deleteRole(id) {
        const role = await this.roleRepo.findOne({ where: { id } });
        if (!role)
            throw new NotFoundException('Không tìm thấy vai trò.');
        if (role.is_system) {
            throw new ConflictException('Không thể xóa vai trò hệ thống.');
        }
        await this.roleRepo.remove(role);
        return { message: 'Đã xóa vai trò thành công.' };
    }
    async initDefaultRoles() {
        const adminPerms = SYSTEM_RESOURCES.map((r) => ({
            resource: r.resource,
            actions: [...ALL_ACTIONS],
        }));
        await this.roleRepo.save(this.roleRepo.create({
            code: 'SYSTEM_ADMIN',
            name: 'Quản trị viên Hệ thống',
            description: 'Toàn quyền quản trị nền tảng CELRA',
            is_system: true,
            permission_matrix: adminPerms,
        }));
        const companyAdminPerms = SYSTEM_RESOURCES.map((r) => ({
            resource: r.resource,
            actions: [...ALL_ACTIONS],
        }));
        await this.roleRepo.save(this.roleRepo.create({
            code: 'COMPANY_ADMIN',
            name: 'Chủ Doanh nghiệp / Quản trị viên Doanh nghiệp',
            description: 'Toàn quyền quản lý nhân sự và thông tin doanh nghiệp',
            is_system: true,
            permission_matrix: companyAdminPerms,
        }));
        const staffPerms = [
            { resource: 'dashboard', actions: ['VIEW'] },
            { resource: 'employees', actions: ['VIEW'] },
            { resource: 'customers', actions: ['VIEW'] },
            { resource: 'company', actions: ['VIEW'] },
        ];
        await this.roleRepo.save(this.roleRepo.create({
            code: 'COMPANY_STAFF',
            name: 'Nhân viên Doanh nghiệp',
            description: 'Xem thông tin cơ bản của doanh nghiệp và nhân sự',
            is_system: true,
            permission_matrix: staffPerms,
        }));
        this.logger.log('Default roles with permission matrix initialized.');
    }
};
RoleService = RoleService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Role)),
    __metadata("design:paramtypes", [Repository])
], RoleService);
export { RoleService };
//# sourceMappingURL=role.service.js.map