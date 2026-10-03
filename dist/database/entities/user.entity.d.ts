import { Company } from './company.entity.js';
import { Role } from './role.entity.js';
export declare class User {
    id: number;
    company_id: number | null;
    company: Company | null;
    username: string;
    email: string;
    password_hash: string;
    full_name: string;
    phone: string | null;
    status: string;
    roles: Role[];
    created_at: Date;
    updated_at: Date;
}
