import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { RoleCode } from '../../configs/constants.js';
import { Company } from '../../database/entities/company.entity.js';
import { PasswordReset } from '../../database/entities/password-reset.entity.js';
import { Role } from '../../database/entities/role.entity.js';
import { User } from '../../database/entities/user.entity.js';
import { MailerService } from '../../shared/mailer/mailer.service.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterCompanyDto } from './dto/register-company.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
export declare class AuthService {
    private readonly dataSource;
    private readonly jwtService;
    private readonly mailerService;
    private readonly companyRepo;
    private readonly userRepo;
    private readonly roleRepo;
    private readonly passwordResetRepo;
    private readonly logger;
    constructor(dataSource: DataSource, jwtService: JwtService, mailerService: MailerService, companyRepo: Repository<Company>, userRepo: Repository<User>, roleRepo: Repository<Role>, passwordResetRepo: Repository<PasswordReset>);
    registerCompany(dto: RegisterCompanyDto): Promise<{
        company: {
            id: number;
            name: string;
            tax_code: string;
            email: string;
        };
        user: {
            id: number;
            username: string;
            email: string;
            full_name: string;
            role: RoleCode;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            username: string;
            email: string;
            full_name: string;
            role: string;
            permissions: string[];
        };
        company: {
            id: number;
            name: string;
            tax_code: string;
        } | null;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        roles: string[];
        permissions: string[];
        company: {
            id: number;
            name: string;
            tax_code: string;
            email: string;
        } | null;
    }>;
}
