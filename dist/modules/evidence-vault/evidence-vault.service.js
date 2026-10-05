var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EvidenceVaultService_1;
import { BadRequestException, Injectable, Logger, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { EvidenceVerificationStatus, TaskStatus } from '../../configs/constants.js';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { TaskEvidence } from '../../database/entities/task-evidence.entity.js';
let EvidenceVaultService = EvidenceVaultService_1 = class EvidenceVaultService {
    evidenceRepo;
    taskRepo;
    logger = new Logger(EvidenceVaultService_1.name);
    uploadDir = path.resolve(process.cwd(), 'uploads', 'evidences');
    constructor(evidenceRepo, taskRepo) {
        this.evidenceRepo = evidenceRepo;
        this.taskRepo = taskRepo;
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async uploadEvidence(companyId, taskId, userId, file) {
        if (!file) {
            throw new BadRequestException('Vui lòng chọn file bằng chứng đính kèm');
        }
        const task = await this.taskRepo.findOne({
            where: { id: taskId, company_id: companyId },
        });
        if (!task) {
            throw new NotFoundException(`Không tìm thấy công việc với ID: ${taskId}`);
        }
        const fileUrl = `/uploads/evidences/${file.filename || file.originalname}`;
        const evidence = this.evidenceRepo.create({
            task_id: task.id,
            file_name: file.originalname,
            file_url: fileUrl,
            file_type: file.mimetype,
            file_size: file.size,
            verified_status: EvidenceVerificationStatus.PENDING,
            uploaded_by_user_id: userId,
        });
        const savedEvidence = await this.evidenceRepo.save(evidence);
        if (task.status === TaskStatus.TODO || task.status === TaskStatus.IN_PROGRESS) {
            task.status = TaskStatus.RESOLVE;
            await this.taskRepo.save(task);
            this.logger.log(`Tự động chuyển Task #${task.id} sang RESOLVE sau khi nộp bằng chứng.`);
        }
        return savedEvidence;
    }
    async getCompanyEvidences(companyId) {
        return this.evidenceRepo
            .createQueryBuilder('evidence')
            .innerJoinAndSelect('evidence.task', 'task')
            .leftJoinAndSelect('evidence.uploaded_by', 'uploaded_by')
            .where('task.company_id = :companyId', { companyId })
            .orderBy('evidence.created_at', 'DESC')
            .getMany();
    }
    async deleteEvidence(companyId, evidenceId) {
        const evidence = await this.evidenceRepo
            .createQueryBuilder('evidence')
            .innerJoinAndSelect('evidence.task', 'task')
            .where('evidence.id = :evidenceId', { evidenceId })
            .andWhere('task.company_id = :companyId', { companyId })
            .getOne();
        if (!evidence) {
            throw new NotFoundException(`Không tìm thấy tài liệu bằng chứng ID: ${evidenceId}`);
        }
        const diskPath = path.resolve(process.cwd(), evidence.file_url.replace(/^\//, ''));
        if (fs.existsSync(diskPath)) {
            try {
                fs.unlinkSync(diskPath);
            }
            catch (err) {
                this.logger.warn(`Không thể xóa file vật lý: ${diskPath} (${err.message})`);
            }
        }
        await this.evidenceRepo.remove(evidence);
        return { success: true };
    }
};
EvidenceVaultService = EvidenceVaultService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(TaskEvidence)),
    __param(1, InjectRepository(ComplianceTask)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], EvidenceVaultService);
export { EvidenceVaultService };
//# sourceMappingURL=evidence-vault.service.js.map