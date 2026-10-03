import { RolePermission } from '../../database/entities/role.entity.js';
import { RoleService } from './role.service.js';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    getRoles(): Promise<{
        roles: import("../../database/entities/role.entity.js").Role[];
        systemResources: {
            resource: string;
            label: string;
        }[];
    }>;
    getRoleById(id: number): Promise<import("../../database/entities/role.entity.js").Role>;
    createRole(data: {
        name: string;
        code: string;
        description?: string;
        permissions?: RolePermission[];
    }): Promise<import("../../database/entities/role.entity.js").Role>;
    updateRole(id: number, data: {
        name?: string;
        description?: string;
    }): Promise<import("../../database/entities/role.entity.js").Role>;
    updateRolePermissions(id: number, data: {
        permissions: RolePermission[];
    }): Promise<import("../../database/entities/role.entity.js").Role>;
    deleteRole(id: number): Promise<{
        message: string;
    }>;
}
