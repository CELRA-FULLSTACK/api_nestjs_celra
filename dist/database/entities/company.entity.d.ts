import { User } from './user.entity.js';
export declare class Company {
    id: number;
    name: string;
    tax_code: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: string;
    users: User[];
    created_at: Date;
    updated_at: Date;
}
