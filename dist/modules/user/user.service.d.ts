import { Repository } from 'typeorm';
import { UserStatus } from '../../configs/constants.js';
import { Role } from '../../database/entities/role.entity.js';
import { User } from '../../database/entities/user.entity.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
export declare class UserService {
    private readonly userRepo;
    private readonly roleRepo;
    private readonly logger;
    constructor(userRepo: Repository<User>, roleRepo: Repository<Role>);
    createEmployee(companyId: number, dto: CreateEmployeeDto): Promise<{
        id: number;
        company_id: number | null;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        status: UserStatus;
        role: {
            id: number;
            code: string;
            name: string;
        };
        created_at: Date;
    }>;
    findAllByCompany(companyId: number): Promise<{
        id: number;
        company_id: number | null;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        status: UserStatus;
        roles: {
            id: number;
            code: string;
            name: string;
        }[];
        created_at: Date;
    }[]>;
    findOneByCompany(companyId: number, id: number): Promise<{
        id: number;
        company_id: number | null;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        status: UserStatus;
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
        status: UserStatus;
        roles: {
            id: number;
            code: string;
            name: string;
        }[];
        updated_at: Date;
    }>;
    deleteEmployee(companyId: number, id: number, currentUserId: number): Promise<{
        message: string;
    }>;
}
