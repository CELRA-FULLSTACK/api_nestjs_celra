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
var AuthService_1;
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException, } from '@nestjs/common';
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
let AuthService = AuthService_1 = class AuthService {
    dataSource;
    jwtService;
    mailerService;
    companyRepo;
    userRepo;
    roleRepo;
    passwordResetRepo;
    logger = new Logger(AuthService_1.name);
    constructor(dataSource, jwtService, mailerService, companyRepo, userRepo, roleRepo, passwordResetRepo) {
        this.dataSource = dataSource;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
        this.companyRepo = companyRepo;
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordResetRepo = passwordResetRepo;
    }
    async registerCompany(dto) {
        const existingCompany = await this.companyRepo.findOne({
            where: [{ tax_code: dto.tax_code }, { email: dto.company_email }],
        });
        if (existingCompany) {
            if (existingCompany.tax_code === dto.tax_code) {
                throw new ConflictException('Mã số thuế này đã được đăng ký');
            }
            throw new ConflictException('Email doanh nghiệp này đã được đăng ký');
        }
        const existingUser = await this.userRepo.findOne({
            where: [{ username: dto.username }, { email: dto.email }],
        });
        if (existingUser) {
            if (existingUser.username === dto.username) {
                throw new ConflictException('Tên đăng nhập đã tồn tại');
            }
            throw new ConflictException('Email người đại diện đã được sử dụng');
        }
        const companyAdminRole = await this.roleRepo.findOne({
            where: { code: RoleCode.COMPANY_ADMIN },
        });
        if (!companyAdminRole) {
            throw new NotFoundException('Hệ thống chưa khởi tạo vai trò COMPANY_ADMIN');
        }
        return this.dataSource.transaction(async (manager) => {
            const newCompany = manager.create(Company, {
                name: dto.company_name,
                tax_code: dto.tax_code,
                email: dto.company_email,
                phone: dto.company_phone || null,
                address: dto.address || null,
                status: CompanyStatus.ACTIVE,
            });
            const savedCompany = await manager.save(newCompany);
            const passwordHash = await bcrypt.hash(dto.password, 10);
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
            this.logger.log(`Đăng ký doanh nghiệp thành công: ${savedCompany.name} (MST: ${savedCompany.tax_code}) - Admin: ${savedUser.username}`);
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
    async login(dto) {
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
            throw new UnauthorizedException('Tên đăng nhập/email hoặc mật khẩu không chính xác');
        }
        if (user.status !== UserStatus.ACTIVE) {
            throw new UnauthorizedException('Tài khoản của bạn đã bị khóa hoặc ngừng hoạt động');
        }
        if (user.company && user.company.status !== CompanyStatus.ACTIVE) {
            throw new UnauthorizedException('Doanh nghiệp của bạn đang bị khóa hoặc ngừng hoạt động');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Tên đăng nhập/email hoặc mật khẩu không chính xác');
        }
        const permissionsSet = new Set();
        for (const role of user.roles || []) {
            for (const perm of role.permissions || []) {
                permissionsSet.add(perm.code);
            }
        }
        const permissions = Array.from(permissionsSet);
        const primaryRole = user.roles?.[0]?.code || RoleCode.COMPANY_STAFF;
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
    async forgotPassword(dto) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email },
        });
        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
            const passwordReset = this.passwordResetRepo.create({
                email: user.email,
                token,
                expires_at: expiresAt,
                is_used: false,
            });
            await this.passwordResetRepo.save(passwordReset);
            await this.mailerService.sendResetPasswordEmail(user.email, token);
        }
        return {
            message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi đến hộp thư của bạn.',
        };
    }
    async resetPassword(dto) {
        const resetRecord = await this.passwordResetRepo.findOne({
            where: { token: dto.token, is_used: false },
        });
        if (!resetRecord || resetRecord.expires_at < new Date()) {
            throw new BadRequestException('Đường link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
        }
        const user = await this.userRepo.findOne({
            where: { email: resetRecord.email },
        });
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng cho yêu cầu này');
        }
        user.password_hash = await bcrypt.hash(dto.new_password, 10);
        await this.userRepo.save(user);
        resetRecord.is_used = true;
        await this.passwordResetRepo.save(resetRecord);
        this.logger.log(`Đặt lại mật khẩu thành công cho email: ${user.email}`);
        return {
            message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.',
        };
    }
    async getProfile(userId) {
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
        const permissionsSet = new Set();
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
};
AuthService = AuthService_1 = __decorate([
    Injectable(),
    __param(3, InjectRepository(Company)),
    __param(4, InjectRepository(User)),
    __param(5, InjectRepository(Role)),
    __param(6, InjectRepository(PasswordReset)),
    __metadata("design:paramtypes", [DataSource,
        JwtService,
        MailerService,
        Repository,
        Repository,
        Repository,
        Repository])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map