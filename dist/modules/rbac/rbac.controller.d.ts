import { RbacService } from './rbac.service.js';
export declare class RbacController {
    private readonly rbacService;
    constructor(rbacService: RbacService);
    getAssignableRoles(): Promise<import("../../database/entities/role.entity.js").Role[]>;
}
