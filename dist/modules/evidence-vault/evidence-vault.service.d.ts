import { Repository } from 'typeorm';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { TaskEvidence } from '../../database/entities/task-evidence.entity.js';
export declare class EvidenceVaultService {
    private readonly evidenceRepo;
    private readonly taskRepo;
    private readonly logger;
    private readonly uploadDir;
    constructor(evidenceRepo: Repository<TaskEvidence>, taskRepo: Repository<ComplianceTask>);
    uploadEvidence(companyId: number, taskId: number, userId: number, file: {
        originalname: string;
        filename?: string;
        mimetype: string;
        size: number;
    }): Promise<TaskEvidence>;
    getCompanyEvidences(companyId: number): Promise<TaskEvidence[]>;
    deleteEvidence(companyId: number, evidenceId: number): Promise<{
        success: boolean;
    }>;
}
