import { Repository } from 'typeorm';
import { Role, RolePermission } from '../../database/entities/role.entity.js';
export declare const SYSTEM_RESOURCES: {
    resource: string;
    label: string;
}[];
export declare const ALL_ACTIONS: string[];
export declare class RoleService {
    private readonly roleRepo;
    private readonly logger;
    constructor(roleRepo: Repository<Role>);
    getAllRoles(): Promise<{
        roles: Role[];
        systemResources: {
            resource: string;
            label: string;
        }[];
    }>;
    getRoleById(id: number): Promise<Role>;
    createRole(data: {
        name: string;
        code: string;
        description?: string;
        permissions?: RolePermission[];
    }): Promise<Role>;
    updateRole(id: number, data: {
        name?: string;
        description?: string;
    }): Promise<Role>;
    updateRolePermissions(id: number, permissions: RolePermission[]): Promise<Role>;
    deleteRole(id: number): Promise<{
        message: string;
    }>;
    initDefaultRoles(): Promise<void>;
}
