import { AuthService } from './auth.service.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterCompanyDto } from './dto/register-company.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
            role: import("../../configs/constants.js").RoleCode;
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
}
