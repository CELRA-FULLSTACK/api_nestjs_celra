import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity.js';
import { ComplianceProfile } from '../entities/compliance-profile.entity.js';
import { LegalRegulation, LegalRequirement } from '../entities/legal-knowledge.entity.js';
import { Permission } from '../entities/permission.entity.js';
import { Role } from '../entities/role.entity.js';
import { User } from '../entities/user.entity.js';
export declare class SeedService implements OnApplicationBootstrap {
    private readonly roleRepo;
    private readonly permissionRepo;
    private readonly companyRepo;
    private readonly userRepo;
    private readonly profileRepo;
    private readonly regulationRepo;
    private readonly requirementRepo;
    private readonly logger;
    constructor(roleRepo: Repository<Role>, permissionRepo: Repository<Permission>, companyRepo: Repository<Company>, userRepo: Repository<User>, profileRepo: Repository<ComplianceProfile>, regulationRepo: Repository<LegalRegulation>, requirementRepo: Repository<LegalRequirement>);
    onApplicationBootstrap(): Promise<void>;
    seedPermissionsAndRoles(): Promise<Record<string, Permission>>;
    seedLegalKnowledge(): Promise<void>;
    seedDefaultAdminAndCompany(): Promise<void>;
}
