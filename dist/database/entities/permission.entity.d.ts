import { type Relation } from 'typeorm';
import { Role } from './role.entity.js';
export declare class Permission {
    id: number;
    code: string;
    name: string;
    module: string;
    roles: Relation<Role[]>;
    created_at: Date;
}
