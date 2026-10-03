import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RolePermission } from '../../database/entities/role.entity.js';

export const SYSTEM_RESOURCES = [
  { resource: 'dashboard', label: 'Tổng quan Dashboard' },
  { resource: 'employees', label: 'Quản lý Nhân sự' },
  { resource: 'customers', label: 'Quản lý Khách hàng' },
  { resource: 'roles', label: 'Quản lý Vai trò & Phân quyền' },
  { resource: 'company', label: 'Thông tin Doanh nghiệp' },
];

export const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE'];

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async getAllRoles() {
    const roles = await this.roleRepo.find({
      order: { created_at: 'ASC' },
    });
    return { roles, systemResources: SYSTEM_RESOURCES };
  }

  async getRoleById(id: number) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò.');
    return role;
  }

  async createRole(data: {
    name: string;
    code: string;
    description?: string;
    permissions?: RolePermission[];
  }) {
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

  async updateRole(
    id: number,
    data: { name?: string; description?: string },
  ) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò.');

    if (data.name) role.name = data.name;
    if (data.description !== undefined) role.description = data.description;

    return this.roleRepo.save(role);
  }

  async updateRolePermissions(id: number, permissions: RolePermission[]) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò.');

    role.permission_matrix = permissions;
    return this.roleRepo.save(role);
  }

  async deleteRole(id: number) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò.');
    if (role.is_system) {
      throw new ConflictException('Không thể xóa vai trò hệ thống.');
    }

    await this.roleRepo.remove(role);
    return { message: 'Đã xóa vai trò thành công.' };
  }

  async initDefaultRoles() {
    // SYSTEM_ADMIN: full permissions
    const adminPerms = SYSTEM_RESOURCES.map((r) => ({
      resource: r.resource,
      actions: [...ALL_ACTIONS],
    }));

    await this.roleRepo.save(
      this.roleRepo.create({
        code: 'SYSTEM_ADMIN',
        name: 'Quản trị viên Hệ thống',
        description: 'Toàn quyền quản trị nền tảng CELRA',
        is_system: true,
        permission_matrix: adminPerms,
      }),
    );

    // COMPANY_ADMIN: full company management permissions
    const companyAdminPerms = SYSTEM_RESOURCES.map((r) => ({
      resource: r.resource,
      actions: [...ALL_ACTIONS],
    }));

    await this.roleRepo.save(
      this.roleRepo.create({
        code: 'COMPANY_ADMIN',
        name: 'Chủ Doanh nghiệp / Quản trị viên Doanh nghiệp',
        description: 'Toàn quyền quản lý nhân sự và thông tin doanh nghiệp',
        is_system: true,
        permission_matrix: companyAdminPerms,
      }),
    );

    // COMPANY_STAFF: view-only permissions
    const staffPerms = [
      { resource: 'dashboard', actions: ['VIEW'] },
      { resource: 'employees', actions: ['VIEW'] },
      { resource: 'customers', actions: ['VIEW'] },
      { resource: 'company', actions: ['VIEW'] },
    ];

    await this.roleRepo.save(
      this.roleRepo.create({
        code: 'COMPANY_STAFF',
        name: 'Nhân viên Doanh nghiệp',
        description: 'Xem thông tin cơ bản của doanh nghiệp và nhân sự',
        is_system: true,
        permission_matrix: staffPerms,
      }),
    );

    this.logger.log('Default roles with permission matrix initialized.');
  }
}
