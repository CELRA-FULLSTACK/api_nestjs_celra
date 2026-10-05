import { Repository } from 'typeorm';
import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { Company } from '../../database/entities/company.entity.js';
import { UpdateComplianceProfileDto } from './dto/update-compliance-profile.dto.js';
export declare class ComplianceProfileService {
    private readonly profileRepo;
    private readonly companyRepo;
    private readonly logger;
    constructor(profileRepo: Repository<ComplianceProfile>, companyRepo: Repository<Company>);
    getProfile(companyId: number): Promise<ComplianceProfile>;
    updateProfile(companyId: number, dto: UpdateComplianceProfileDto): Promise<ComplianceProfile>;
    calculateCompleteness(profile: Partial<ComplianceProfile>): number;
}
