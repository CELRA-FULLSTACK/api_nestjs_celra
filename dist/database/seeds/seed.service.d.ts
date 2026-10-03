import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity.js';
import { Role } from '../entities/role.entity.js';
export declare class SeedService implements OnApplicationBootstrap {
    private readonly roleRepo;
    private readonly permissionRepo;
    private readonly logger;
    constructor(roleRepo: Repository<Role>, permissionRepo: Repository<Permission>);
    onApplicationBootstrap(): Promise<void>;
    seedPermissionsAndRoles(): Promise<void>;
}
