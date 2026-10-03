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
var SeedService_1;
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionCode, RoleCode } from '../../configs/constants.js';
import { Permission } from '../entities/permission.entity.js';
import { Role } from '../entities/role.entity.js';
const SYSTEM_RESOURCES = [
    { resource: 'dashboard', label: 'Tổng quan Dashboard' },
    { resource: 'employees', label: 'Quản lý Nhân sự' },
    { resource: 'customers', label: 'Quản lý Khách hàng' },
    { resource: 'roles', label: 'Quản lý Vai trò & Phân quyền' },
    { resource: 'company', label: 'Thông tin Doanh nghiệp' },
];
const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE'];
let SeedService = SeedService_1 = class SeedService {
    roleRepo;
    permissionRepo;
    logger = new Logger(SeedService_1.name);
    constructor(roleRepo, permissionRepo) {
        this.roleRepo = roleRepo;
        this.permissionRepo = permissionRepo;
    }
    async onApplicationBootstrap() {
        try {
            await this.seedPermissionsAndRoles();
        }
        catch (error) {
            this.logger.error('Lỗi khi thực hiện seed dữ liệu khởi tạo:', error);
        }
    }
    async seedPermissionsAndRoles() {
        this.logger.log('Kiểm tra dữ liệu mẫu Roles & Permissions...');
        const defaultPermissions = [
            { code: PermissionCode.EMPLOYEE_VIEW, name: 'Xem danh sách nhân viên', module: 'Employee' },
            { code: PermissionCode.EMPLOYEE_CREATE, name: 'Thêm mới nhân viên', module: 'Employee' },
            { code: PermissionCode.EMPLOYEE_UPDATE, name: 'Cập nhật nhân viên', module: 'Employee' },
            { code: PermissionCode.EMPLOYEE_DELETE, name: 'Khóa/Xóa nhân viên', module: 'Employee' },
            { code: PermissionCode.CUSTOMER_VIEW, name: 'Xem danh sách khách hàng', module: 'Customer' },
            { code: PermissionCode.CUSTOMER_CREATE, name: 'Thêm mới khách hàng', module: 'Customer' },
            { code: PermissionCode.CUSTOMER_UPDATE, name: 'Cập nhật khách hàng', module: 'Customer' },
            { code: PermissionCode.COMPANY_VIEW, name: 'Xem thông tin doanh nghiệp', module: 'Company' },
            { code: PermissionCode.COMPANY_UPDATE, name: 'Cập nhật thông tin doanh nghiệp', module: 'Company' },
        ];
        const permissionMap = {};
        for (const p of defaultPermissions) {
            let permission = await this.permissionRepo.findOne({
                where: { code: p.code },
            });
            if (!permission) {
                permission = await this.permissionRepo.save(this.permissionRepo.create(p));
                this.logger.log(`+ Đã tạo Permission: ${p.code}`);
            }
            permissionMap[p.code] = permission;
        }
        const defaultRoles = [
            {
                code: RoleCode.SYSTEM_ADMIN,
                name: 'Quản trị viên Hệ thống',
                description: 'Toàn quyền quản trị nền tảng CELRA',
                permissions: Object.values(permissionMap),
                permissionMatrix: SYSTEM_RESOURCES.map((r) => ({
                    resource: r.resource,
                    actions: [...ALL_ACTIONS],
                })),
            },
            {
                code: RoleCode.COMPANY_ADMIN,
                name: 'Chủ Doanh nghiệp / Quản trị viên Doanh nghiệp',
                description: 'Toàn quyền quản lý nhân sự và thông tin doanh nghiệp',
                permissions: Object.values(permissionMap),
                permissionMatrix: SYSTEM_RESOURCES.map((r) => ({
                    resource: r.resource,
                    actions: [...ALL_ACTIONS],
                })),
            },
            {
                code: RoleCode.COMPANY_STAFF,
                name: 'Nhân viên Doanh nghiệp',
                description: 'Xem thông tin cơ bản của doanh nghiệp và nhân sự',
                permissions: [
                    permissionMap[PermissionCode.EMPLOYEE_VIEW],
                    permissionMap[PermissionCode.CUSTOMER_VIEW],
                    permissionMap[PermissionCode.COMPANY_VIEW],
                ].filter(Boolean),
                permissionMatrix: [
                    { resource: 'dashboard', actions: ['VIEW'] },
                    { resource: 'employees', actions: ['VIEW'] },
                    { resource: 'customers', actions: ['VIEW'] },
                    { resource: 'company', actions: ['VIEW'] },
                ],
            },
        ];
        for (const r of defaultRoles) {
            let role = await this.roleRepo.findOne({
                where: { code: r.code },
                relations: { permissions: true },
            });
            if (!role) {
                role = this.roleRepo.create({
                    code: r.code,
                    name: r.name,
                    description: r.description,
                    is_system: true,
                    permissions: r.permissions,
                    permission_matrix: r.permissionMatrix,
                });
                await this.roleRepo.save(role);
                this.logger.log(`+ Đã tạo Role: ${r.code}`);
            }
            else {
                if (!role.permission_matrix) {
                    role.permission_matrix = r.permissionMatrix;
                    await this.roleRepo.save(role);
                    this.logger.log(`+ Đã cập nhật permission_matrix cho Role: ${r.code}`);
                }
            }
        }
        this.logger.log('Khởi tạo Roles & Permissions hoàn tất thành công!');
    }
};
SeedService = SeedService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Role)),
    __param(1, InjectRepository(Permission)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], SeedService);
export { SeedService };
//# sourceMappingURL=seed.service.js.map