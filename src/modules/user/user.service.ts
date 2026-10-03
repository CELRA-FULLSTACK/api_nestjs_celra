import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RoleCode, UserStatus } from '../../configs/constants.js';
import { Role } from '../../database/entities/role.entity.js';
import { User } from '../../database/entities/user.entity.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  /**
   * 1. Doanh nghiệp tạo tài khoản nhân viên mới
   * BẮT BUỘC: Gắn company_id từ tài khoản đang đăng nhập, nhân viên không được tự đăng ký
   */
  async createEmployee(companyId: number, dto: CreateEmployeeDto) {
    if (!companyId) {
      throw new BadRequestException(
        'Tài khoản của bạn không gắn với doanh nghiệp nào để tạo nhân viên',
      );
    }

    // Kiểm tra trùng lặp username hoặc email
    const existing = await this.userRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (existing) {
      if (existing.username === dto.username) {
        throw new ConflictException('Tên đăng nhập nhân viên đã tồn tại');
      }
      throw new ConflictException('Email nhân viên đã tồn tại trên hệ thống');
    }

    // Kiểm tra vai trò gán cho nhân viên (chặn gán quyền SYSTEM_ADMIN)
    const role = await this.roleRepo.findOne({
      where: { id: dto.role_id },
    });
    if (!role || role.code === RoleCode.SYSTEM_ADMIN) {
      throw new BadRequestException(
        'Vai trò không hợp lệ để gán cho nhân sự doanh nghiệp',
      );
    }

    // Băm mật khẩu khởi tạo ban đầu do doanh nghiệp cấp
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const newEmployee = this.userRepo.create({
      company_id: companyId,
      username: dto.username,
      email: dto.email,
      password_hash: passwordHash,
      full_name: dto.full_name,
      phone: dto.phone || null,
      status: UserStatus.ACTIVE,
      roles: [role],
    });

    const saved = await this.userRepo.save(newEmployee);
    this.logger.log(
      `Tạo nhân viên thành công: ${saved.username} (${saved.email}) - Thuộc Company ID: ${companyId}`,
    );

    return {
      id: saved.id,
      company_id: saved.company_id,
      username: saved.username,
      email: saved.email,
      full_name: saved.full_name,
      phone: saved.phone,
      status: saved.status,
      role: {
        id: role.id,
        code: role.code,
        name: role.name,
      },
      created_at: saved.created_at,
    };
  }

  /**
   * 2. Lấy danh sách nhân viên của doanh nghiệp
   * BẮT BUỘC: Cô lập dữ liệu, chỉ lấy nhân viên có company_id = companyId của người gọi
   */
  async findAllByCompany(companyId: number) {
    if (!companyId) {
      return [];
    }

    const users = await this.userRepo.find({
      where: { company_id: companyId },
      relations: { roles: true },
      select: {
        id: true,
        company_id: true,
        username: true,
        email: true,
        full_name: true,
        phone: true,
        status: true,
        created_at: true,
        roles: {
          id: true,
          code: true,
          name: true,
        },
      },
      order: { created_at: 'DESC' },
    });

    return users.map((u) => ({
      id: u.id,
      company_id: u.company_id,
      username: u.username,
      email: u.email,
      full_name: u.full_name,
      phone: u.phone,
      status: u.status,
      roles: u.roles.map((r) => ({ id: r.id, code: r.code, name: r.name })),
      created_at: u.created_at,
    }));
  }

  /**
   * 3. Lấy thông tin 1 nhân viên trong cùng doanh nghiệp
   */
  async findOneByCompany(companyId: number, id: number) {
    const user = await this.userRepo.findOne({
      where: { id, company_id: companyId },
      relations: { roles: true },
    });

    if (!user) {
      throw new NotFoundException(
        'Không tìm thấy nhân viên trong doanh nghiệp của bạn',
      );
    }

    return {
      id: user.id,
      company_id: user.company_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      status: user.status,
      roles: user.roles.map((r) => ({ id: r.id, code: r.code, name: r.name })),
      created_at: user.created_at,
    };
  }

  /**
   * 4. Cập nhật thông tin nhân viên
   */
  async updateEmployee(
    companyId: number,
    id: number,
    dto: UpdateEmployeeDto,
  ) {
    const user = await this.userRepo.findOne({
      where: { id, company_id: companyId },
      relations: { roles: true },
    });

    if (!user) {
      throw new NotFoundException(
        'Không tìm thấy nhân viên trong doanh nghiệp của bạn',
      );
    }

    if (dto.full_name) user.full_name = dto.full_name;
    if (dto.phone !== undefined) user.phone = dto.phone || null;
    if (dto.status) user.status = dto.status;

    // Cập nhật mật khẩu nếu có
    if (dto.new_password) {
      user.password_hash = await bcrypt.hash(dto.new_password, 10);
    }

    // Cập nhật vai trò nếu có
    if (dto.role_id) {
      const role = await this.roleRepo.findOne({
        where: { id: dto.role_id },
      });
      if (!role || role.code === RoleCode.SYSTEM_ADMIN) {
        throw new BadRequestException('Vai trò không hợp lệ');
      }
      user.roles = [role];
    }

    const updated = await this.userRepo.save(user);
    return {
      id: updated.id,
      company_id: updated.company_id,
      username: updated.username,
      email: updated.email,
      full_name: updated.full_name,
      phone: updated.phone,
      status: updated.status,
      roles: updated.roles.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
      })),
      updated_at: updated.updated_at,
    };
  }

  /**
   * 5. Khóa hoặc Xóa nhân viên khỏi doanh nghiệp
   */
  async deleteEmployee(
    companyId: number,
    id: number,
    currentUserId: number,
  ) {
    if (id === currentUserId) {
      throw new BadRequestException(
        'Bạn không thể tự khóa tài khoản của chính mình',
      );
    }

    const user = await this.userRepo.findOne({
      where: { id, company_id: companyId },
    });

    if (!user) {
      throw new NotFoundException(
        'Không tìm thấy nhân viên trong doanh nghiệp của bạn',
      );
    }

    user.status = UserStatus.INACTIVE;
    await this.userRepo.save(user);

    return {
      message: 'Đã khóa tài khoản nhân viên thành công',
    };
  }
}
