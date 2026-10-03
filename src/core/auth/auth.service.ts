import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { CompanyStatus, RoleCode, UserStatus } from '../../configs/constants.js';
import { Company } from '../../database/entities/company.entity.js';
import { PasswordReset } from '../../database/entities/password-reset.entity.js';
import { Role } from '../../database/entities/role.entity.js';
import { User } from '../../database/entities/user.entity.js';
import { MailerService } from '../../shared/mailer/mailer.service.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterCompanyDto } from './dto/register-company.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepo: Repository<PasswordReset>,
  ) {}

  /**
   * 1. Đăng ký tài khoản Doanh nghiệp tự phục vụ
   * Tạo Company + User (COMPANY_ADMIN) trong 1 Transaction duy nhất
   */
  async registerCompany(dto: RegisterCompanyDto) {
    // Kiểm tra trùng lặp thông tin công ty
    const existingCompany = await this.companyRepo.findOne({
      where: [{ tax_code: dto.tax_code }, { email: dto.company_email }],
    });
    if (existingCompany) {
      if (existingCompany.tax_code === dto.tax_code) {
        throw new ConflictException('Mã số thuế này đã được đăng ký');
      }
      throw new ConflictException('Email doanh nghiệp này đã được đăng ký');
    }

    // Kiểm tra trùng lặp thông tin tài khoản người đại diện
    const existingUser = await this.userRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (existingUser) {
      if (existingUser.username === dto.username) {
        throw new ConflictException('Tên đăng nhập đã tồn tại');
      }
      throw new ConflictException('Email người đại diện đã được sử dụng');
    }

    // Tìm role COMPANY_ADMIN
    const companyAdminRole = await this.roleRepo.findOne({
      where: { code: RoleCode.COMPANY_ADMIN },
    });
    if (!companyAdminRole) {
      throw new NotFoundException(
        'Hệ thống chưa khởi tạo vai trò COMPANY_ADMIN',
      );
    }

    // Thực hiện trong Database Transaction
    return this.dataSource.transaction(async (manager) => {
      // 1. Tạo doanh nghiệp mới
      const newCompany = manager.create(Company, {
        name: dto.company_name,
        tax_code: dto.tax_code,
        email: dto.company_email,
        phone: dto.company_phone || null,
        address: dto.address || null,
        status: CompanyStatus.ACTIVE,
      });
      const savedCompany = await manager.save(newCompany);

      // 2. Băm mật khẩu người đại diện
      const passwordHash = await bcrypt.hash(dto.password, 10);

      // 3. Tạo tài khoản chủ doanh nghiệp gắn company_id
      const newUser = manager.create(User, {
        company_id: savedCompany.id,
        username: dto.username,
        email: dto.email,
        password_hash: passwordHash,
        full_name: dto.full_name,
        phone: dto.phone || null,
        status: UserStatus.ACTIVE,
        roles: [companyAdminRole],
      });
      const savedUser = await manager.save(newUser);

      this.logger.log(
        `Đăng ký doanh nghiệp thành công: ${savedCompany.name} (MST: ${savedCompany.tax_code}) - Admin: ${savedUser.username}`,
      );

      return {
        company: {
          id: savedCompany.id,
          name: savedCompany.name,
          tax_code: savedCompany.tax_code,
          email: savedCompany.email,
        },
        user: {
          id: savedUser.id,
          username: savedUser.username,
          email: savedUser.email,
          full_name: savedUser.full_name,
          role: RoleCode.COMPANY_ADMIN,
        },
      };
    });
  }

  /**
   * 2. Đăng nhập hệ thống (hỗ trợ cả username hoặc email)
   */
  async login(dto: LoginDto) {
    // Tìm user kèm thông tin Công ty và các Vai trò + Quyền hạn
    const user = await this.userRepo.findOne({
      where: [
        { username: dto.usernameOrEmail },
        { email: dto.usernameOrEmail },
      ],
      relations: {
        company: true,
        roles: {
          permissions: true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Tên đăng nhập/email hoặc mật khẩu không chính xác',
      );
    }

    // Kiểm tra trạng thái tài khoản
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        'Tài khoản của bạn đã bị khóa hoặc ngừng hoạt động',
      );
    }

    // Nếu là nhân sự doanh nghiệp, kiểm tra trạng thái doanh nghiệp
    if (user.company && user.company.status !== CompanyStatus.ACTIVE) {
      throw new UnauthorizedException(
        'Doanh nghiệp của bạn đang bị khóa hoặc ngừng hoạt động',
      );
    }

    // So khớp mật khẩu
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Tên đăng nhập/email hoặc mật khẩu không chính xác',
      );
    }

    // Tổng hợp danh sách permissions từ tất cả vai trò
    const permissionsSet = new Set<string>();
    for (const role of user.roles || []) {
      for (const perm of role.permissions || []) {
        permissionsSet.add(perm.code);
      }
    }
    const permissions = Array.from(permissionsSet);
    const primaryRole = user.roles?.[0]?.code || RoleCode.COMPANY_STAFF;

    // Sinh JWT Access Token
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      companyId: user.company_id,
      roleCode: primaryRole,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: primaryRole,
        permissions,
      },
      company: user.company
        ? {
            id: user.company.id,
            name: user.company.name,
            tax_code: user.company.tax_code,
          }
        : null,
    };
  }

  /**
   * 3. Quên mật khẩu: Tạo token bảo mật 15 phút và gửi email
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (user) {
      // Sinh token bảo mật ngẫu nhiên 32 bytes hex
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

      const passwordReset = this.passwordResetRepo.create({
        email: user.email,
        token,
        expires_at: expiresAt,
        is_used: false,
      });
      await this.passwordResetRepo.save(passwordReset);

      // Gửi link qua mailer
      await this.mailerService.sendResetPasswordEmail(user.email, token);
    }

    // Luôn trả về thông báo chung để tránh user enumeration
    return {
      message:
        'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi đến hộp thư của bạn.',
    };
  }

  /**
   * 4. Đặt lại mật khẩu mới bằng Token
   */
  async resetPassword(dto: ResetPasswordDto) {
    const resetRecord = await this.passwordResetRepo.findOne({
      where: { token: dto.token, is_used: false },
    });

    if (!resetRecord || resetRecord.expires_at < new Date()) {
      throw new BadRequestException(
        'Đường link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn',
      );
    }

    const user = await this.userRepo.findOne({
      where: { email: resetRecord.email },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng cho yêu cầu này');
    }

    // Băm mật khẩu mới và lưu
    user.password_hash = await bcrypt.hash(dto.new_password, 10);
    await this.userRepo.save(user);

    // Đánh dấu token đã sử dụng
    resetRecord.is_used = true;
    await this.passwordResetRepo.save(resetRecord);

    this.logger.log(`Đặt lại mật khẩu thành công cho email: ${user.email}`);

    return {
      message:
        'Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.',
    };
  }

  /**
   * 5. Lấy hồ sơ tài khoản hiện tại từ User ID
   */
  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: {
        company: true,
        roles: {
          permissions: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin tài khoản');
    }

    const permissionsSet = new Set<string>();
    for (const role of user.roles || []) {
      for (const perm of role.permissions || []) {
        permissionsSet.add(perm.code);
      }
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      roles: user.roles.map((r) => r.code),
      permissions: Array.from(permissionsSet),
      company: user.company
        ? {
            id: user.company.id,
            name: user.company.name,
            tax_code: user.company.tax_code,
            email: user.company.email,
          }
        : null,
    };
  }
}
