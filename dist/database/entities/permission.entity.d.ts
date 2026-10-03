import { Role } from './role.entity.js';
export declare class Permission {
    id: number;
    code: string;
    name: string;
    module: string;
    roles: Role[];
    created_at: Date;
}
