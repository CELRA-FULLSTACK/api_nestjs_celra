import { Repository } from 'typeorm';
import { Role } from '../../database/entities/role.entity.js';
export declare class RbacService {
    private readonly roleRepo;
    constructor(roleRepo: Repository<Role>);
    getAssignableRoles(): Promise<Role[]>;
}
