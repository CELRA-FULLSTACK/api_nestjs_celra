import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CompanyStatus, PermissionCode, RoleCode, UserStatus } from '../../configs/constants.js';
import { Company } from '../entities/company.entity.js';
import { ComplianceProfile } from '../entities/compliance-profile.entity.js';
import { LegalRegulation, LegalRequirement } from '../entities/legal-knowledge.entity.js';
import { Permission } from '../entities/permission.entity.js';
import { Role, RolePermission } from '../entities/role.entity.js';
import { User } from '../entities/user.entity.js';
import { SEED_LEGAL_DATA } from './legal-knowledge.seed.js';

const SYSTEM_RESOURCES = [
  { resource: 'dashboard', label: 'Tổng quan Dashboard' },
  { resource: 'employees', label: 'Quản lý Nhân sự' },
  { resource: 'roles', label: 'Quản lý Vai trò & Phân quyền' },
  { resource: 'company', label: 'Thông tin Doanh nghiệp' },
  { resource: 'compliance', label: 'Quản trị Tuân thủ' },
  { resource: 'legal', label: 'Kho Tri thức Pháp lý' },
];

const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE'];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ComplianceProfile)
    private readonly profileRepo: Repository<ComplianceProfile>,
    @InjectRepository(LegalRegulation)
    private readonly regulationRepo: Repository<LegalRegulation>,
    @InjectRepository(LegalRequirement)
    private readonly requirementRepo: Repository<LegalRequirement>,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.seedPermissionsAndRoles();
      await this.seedLegalKnowledge();
      await this.seedDefaultAdminAndCompany();
    } catch (error) {
      this.logger.error('Lỗi khi thực hiện seed dữ liệu khởi tạo:', error);
    }
  }

  async seedPermissionsAndRoles(): Promise<Record<string, Permission>> {
    this.logger.log('Kiểm tra dữ liệu mẫu Roles & Permissions...');

    const defaultPermissions = [
      { code: PermissionCode.EMPLOYEE_VIEW, name: 'Xem danh sách nhân viên', module: 'Employee' },
      { code: PermissionCode.EMPLOYEE_CREATE, name: 'Thêm mới nhân viên', module: 'Employee' },
      { code: PermissionCode.EMPLOYEE_UPDATE, name: 'Cập nhật nhân viên', module: 'Employee' },
      { code: PermissionCode.EMPLOYEE_DELETE, name: 'Khóa/Xóa nhân viên', module: 'Employee' },
      { code: PermissionCode.COMPANY_VIEW, name: 'Xem thông tin doanh nghiệp', module: 'Company' },
      { code: PermissionCode.COMPANY_UPDATE, name: 'Cập nhật thông tin doanh nghiệp', module: 'Company' },
      { code: PermissionCode.COMPLIANCE_VIEW, name: 'Xem hồ sơ & báo cáo tuân thủ', module: 'Compliance' },
      { code: PermissionCode.COMPLIANCE_ASSESS, name: 'Chạy đánh giá tuân thủ AI', module: 'Compliance' },
      { code: PermissionCode.COMPLIANCE_TASK_UPDATE, name: 'Cập nhật tiến độ task tuân thủ', module: 'Compliance' },
      { code: PermissionCode.LEGAL_VIEW, name: 'Tra cứu kho tri thức pháp lý', module: 'Legal' },
      { code: PermissionCode.LEGAL_MANAGE, name: 'Quản lý văn bản & quy định pháp luật', module: 'Legal' },
    ];

    const permissionMap: Record<string, Permission> = {};

    for (const p of defaultPermissions) {
      let permission = await this.permissionRepo.findOne({
        where: { code: p.code },
      });
      if (!permission) {
        permission = await this.permissionRepo.save(
          this.permissionRepo.create(p),
        );
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
        })) as RolePermission[],
      },
      {
        code: RoleCode.COMPANY_ADMIN,
        name: 'Chủ Doanh nghiệp / Quản trị viên Doanh nghiệp',
        description: 'Toàn quyền quản lý nhân sự và thông tin doanh nghiệp',
        permissions: Object.values(permissionMap),
        permissionMatrix: SYSTEM_RESOURCES.map((r) => ({
          resource: r.resource,
          actions: [...ALL_ACTIONS],
        })) as RolePermission[],
      },
      {
        code: RoleCode.COMPANY_STAFF,
        name: 'Nhân viên Doanh nghiệp',
        description: 'Xem thông tin cơ bản của doanh nghiệp, tra cứu luật và cập nhật task tuân thủ',
        permissions: [
          permissionMap[PermissionCode.EMPLOYEE_VIEW],
          permissionMap[PermissionCode.COMPANY_VIEW],
          permissionMap[PermissionCode.COMPLIANCE_VIEW],
          permissionMap[PermissionCode.COMPLIANCE_TASK_UPDATE],
          permissionMap[PermissionCode.LEGAL_VIEW],
        ].filter(Boolean),
        permissionMatrix: [
          { resource: 'dashboard', actions: ['VIEW'] },
          { resource: 'employees', actions: ['VIEW'] },
          { resource: 'company', actions: ['VIEW'] },
          { resource: 'compliance', actions: ['VIEW', 'UPDATE'] },
          { resource: 'legal', actions: ['VIEW'] },
        ] as RolePermission[],
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
      } else if (!role.permission_matrix) {
        role.permission_matrix = r.permissionMatrix;
        await this.roleRepo.save(role);
        this.logger.log(`+ Đã cập nhật permission_matrix cho Role: ${r.code}`);
      }
    }

    return permissionMap;
  }

  async seedLegalKnowledge(): Promise<void> {
    this.logger.log('Kiểm tra dữ liệu mẫu Kho tri thức pháp lý...');

    for (const regData of SEED_LEGAL_DATA) {
      let regulation = await this.regulationRepo.findOne({
        where: { code: regData.code },
      });

      if (!regulation) {
        regulation = this.regulationRepo.create({
          code: regData.code,
          title: regData.title,
          category: regData.category,
          description: regData.description,
          issuing_authority: regData.issuing_authority,
          effective_date: regData.effective_date,
        });
        regulation = await this.regulationRepo.save(regulation);
        this.logger.log(`+ Đã tạo Văn bản luật: ${regulation.code}`);
      }

      for (const reqData of regData.requirements) {
        const existingReq = await this.requirementRepo.findOne({
          where: { requirement_code: reqData.requirement_code },
        });

        if (!existingReq) {
          const newReq = this.requirementRepo.create({
            regulation_id: regulation.id,
            requirement_code: reqData.requirement_code,
            title: reqData.title,
            description: reqData.description,
            legal_reference: reqData.legal_reference,
            severity: reqData.severity,
            cycle: reqData.cycle,
            trigger_conditions: reqData.trigger_conditions,
            penalty_summary: reqData.penalty_summary,
            action_guide: reqData.action_guide,
            required_evidence_type: reqData.required_evidence_type,
          });
          await this.requirementRepo.save(newReq);
          this.logger.log(`  + Đã tạo Điều khoản: ${reqData.requirement_code}`);
        }
      }
    }
  }

  async seedDefaultAdminAndCompany(): Promise<void> {
    this.logger.log('Kiểm tra tài khoản mặc định và công ty mẫu...');

    // 1. Tạo công ty mẫu nếu chưa có
    let demoCompany = await this.companyRepo.findOne({
      where: { tax_code: '0109999999' },
    });

    if (!demoCompany) {
      demoCompany = this.companyRepo.create({
        name: 'Công ty TNHH Giải Pháp CELRA Việt Nam',
        tax_code: '0109999999',
        email: 'contact@celra.vn',
        phone: '0901234567',
        address: 'Tòa nhà FPT Tower, Cầu Giấy, Hà Nội',
        status: CompanyStatus.ACTIVE,
      });
      demoCompany = await this.companyRepo.save(demoCompany);
      this.logger.log(`+ Đã tạo Công ty mẫu: ${demoCompany.name}`);
    }

    // 2. Tạo Hồ sơ tuân thủ mẫu cho công ty
    let profile = await this.profileRepo.findOne({
      where: { company_id: demoCompany.id },
    });

    if (!profile) {
      profile = this.profileRepo.create({
        company_id: demoCompany.id,
        total_employees: 15,
        probation_employees: 2,
        official_employees: 13,
        has_internal_labor_rules: true,
        has_registered_labor_rules: false,
        has_signed_all_labor_contracts: true,
        has_social_insurance_registration: true,
        tax_declaration_cycle: 'QUARTERLY',
        accounting_standard: 'CIRCULAR_133',
        has_electronic_invoices: true,
        has_digital_signature: true,
        completeness_score: 75,
      });
      await this.profileRepo.save(profile);
      this.logger.log(`+ Đã tạo Hồ sơ tuân thủ mẫu cho công ty ${demoCompany.name}`);
    }

    // 3. Lấy roles
    const adminRole = await this.roleRepo.findOne({ where: { code: RoleCode.SYSTEM_ADMIN } });
    const companyAdminRole = await this.roleRepo.findOne({ where: { code: RoleCode.COMPANY_ADMIN } });
    const staffRole = await this.roleRepo.findOne({ where: { code: RoleCode.COMPANY_STAFF } });

    // 4. Tạo hoặc Cập nhật Admin User: admin / Admin123
    let adminUser = await this.userRepo.findOne({
      where: [{ username: 'admin' }, { email: 'admin@celra.vn' }, { username: 'celra_admin' }],
      relations: { roles: true },
    });

    const adminPasswordHash = await bcrypt.hash('Admin123', 10);

    if (!adminUser) {
      adminUser = this.userRepo.create({
        company_id: demoCompany.id,
        username: 'admin',
        email: 'admin@celra.vn',
        full_name: 'Quản trị viên Hệ thống CELRA',
        password_hash: adminPasswordHash,
        phone: '0901234567',
        status: UserStatus.ACTIVE,
        roles: [adminRole, companyAdminRole].filter(Boolean) as Role[],
      });
      await this.userRepo.save(adminUser);
      this.logger.log(`+ Đã tạo Admin User: admin (Mật khẩu: Admin123)`);
    } else {
      adminUser.username = 'admin';
      adminUser.password_hash = adminPasswordHash;
      adminUser.roles = [adminRole, companyAdminRole].filter(Boolean) as Role[];
      await this.userRepo.save(adminUser);
      this.logger.log(`+ Đã cập nhật Admin User: admin (Mật khẩu: Admin123)`);
    }

    // 5. Tạo hoặc Cập nhật Staff User: celra_staff / Celra!Staff2026#
    let staffUser = await this.userRepo.findOne({
      where: [{ username: 'celra_staff' }, { email: 'staff@celra.vn' }],
    });

    if (!staffUser) {
      const passwordHash = await bcrypt.hash('Celra!Staff2026#', 10);
      staffUser = this.userRepo.create({
        company_id: demoCompany.id,
        username: 'celra_staff',
        email: 'staff@celra.vn',
        full_name: 'Nhân viên Pháp chế CELRA',
        password_hash: passwordHash,
        phone: '0907654321',
        status: UserStatus.ACTIVE,
        roles: staffRole ? [staffRole] : [],
      });
      await this.userRepo.save(staffUser);
      this.logger.log(`+ Đã tạo Staff User: celra_staff (Mật khẩu: Celra!Staff2026#)`);
    }

    this.logger.log('Dữ liệu khởi tạo hệ thống (Seed Data) đã sẵn sàng 100%!');
  }
}
