import { EvidenceVaultService } from './evidence-vault.service.js';
export declare class EvidenceVaultController {
    private readonly evidenceService;
    constructor(evidenceService: EvidenceVaultService);
    uploadTaskEvidence(companyId: number, userId: number, taskId: number, file: any): Promise<import("../../database/entities/task-evidence.entity.js").TaskEvidence>;
    getCompanyEvidences(companyId: number): Promise<import("../../database/entities/task-evidence.entity.js").TaskEvidence[]>;
    deleteEvidence(companyId: number, id: number): Promise<{
        success: boolean;
    }>;
}
