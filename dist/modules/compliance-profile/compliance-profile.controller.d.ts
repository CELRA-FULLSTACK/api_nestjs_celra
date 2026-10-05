import { ComplianceProfileService } from './compliance-profile.service.js';
import { UpdateComplianceProfileDto } from './dto/update-compliance-profile.dto.js';
export declare class ComplianceProfileController {
    private readonly profileService;
    constructor(profileService: ComplianceProfileService);
    getProfile(companyId: number): Promise<import("../../database/entities/compliance-profile.entity.js").ComplianceProfile>;
    updateProfile(companyId: number, dto: UpdateComplianceProfileDto): Promise<import("../../database/entities/compliance-profile.entity.js").ComplianceProfile>;
}
