import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { UserService } from './user.service.js';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createEmployee(companyId: number, dto: CreateEmployeeDto): Promise<{
        id: number;
        company_id: number | null;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        status: import("../../configs/constants.js").UserStatus;
        role: {
            id: number;
            code: string;
            name: string;
        };
        created_at: Date;
    }>;
    getEmployees(companyId: number): Promise<{
        id: number;
        company_id: number | null;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        status: import("../../configs/constants.js").UserStatus;
        roles: {
            id: number;
            code: string;
            name: string;
        }[];
        created_at: Date;
    }[]>;
    getEmployeeDetail(companyId: number, id: number): Promise<{
        id: number;
        company_id: number | null;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        status: import("../../configs/constants.js").UserStatus;
        roles: {
            id: number;
            code: string;
            name: string;
        }[];
        created_at: Date;
    }>;
    updateEmployee(companyId: number, id: number, dto: UpdateEmployeeDto): Promise<{
        id: number;
        company_id: number | null;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        status: import("../../configs/constants.js").UserStatus;
        roles: {
            id: number;
            code: string;
            name: string;
        }[];
        updated_at: Date;
    }>;
    deleteEmployee(companyId: number, currentUserId: number, id: number): Promise<{
        message: string;
    }>;
}
