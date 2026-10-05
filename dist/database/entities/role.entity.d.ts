import { type Relation } from 'typeorm';
import { Permission } from './permission.entity.js';
import { User } from './user.entity.js';
export declare class Role {
    id: number;
    code: string;
    name: string;
    description: string | null;
    is_system: boolean;
    permissions: Relation<Permission[]>;
    permission_matrix: RolePermission[] | null;
    users: Relation<User[]>;
    created_at: Date;
}
export interface RolePermission {
    resource: string;
    actions: string[];
}
