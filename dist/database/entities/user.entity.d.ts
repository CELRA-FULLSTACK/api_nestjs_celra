import { type Relation } from 'typeorm';
import { Company } from './company.entity.js';
import { Role } from './role.entity.js';
export declare class User {
    id: number;
    company_id: number | null;
    company: Relation<Company> | null;
    username: string;
    email: string;
    password_hash: string;
    full_name: string;
    phone: string | null;
    status: string;
    roles: Relation<Role[]>;
    created_at: Date;
    updated_at: Date;
}
