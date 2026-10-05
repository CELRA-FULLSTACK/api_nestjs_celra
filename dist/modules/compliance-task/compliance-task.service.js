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
var ComplianceTaskService_1;
import { BadRequestException, Injectable, Logger, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatus } from '../../configs/constants.js';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { User } from '../../database/entities/user.entity.js';
let ComplianceTaskService = ComplianceTaskService_1 = class ComplianceTaskService {
    taskRepo;
    userRepo;
    logger = new Logger(ComplianceTaskService_1.name);
    constructor(taskRepo, userRepo) {
        this.taskRepo = taskRepo;
        this.userRepo = userRepo;
    }
    async getTasks(companyId, filter) {
        const query = this.taskRepo
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.assigned_to', 'assigned_to')
            .leftJoinAndSelect('task.evidences', 'evidences')
            .where('task.company_id = :companyId', { companyId });
        if (filter?.status) {
            query.andWhere('task.status = :status', { status: filter.status });
        }
        if (filter?.severity) {
            query.andWhere('task.severity = :severity', { severity: filter.severity });
        }
        if (filter?.assigned_to) {
            query.andWhere('task.assigned_to_user_id = :assignedTo', {
                assignedTo: filter.assigned_to,
            });
        }
        if (filter?.search) {
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${filter.search}%` });
        }
        return query.orderBy('task.created_at', 'DESC').getMany();
    }
    async getKanbanBoard(companyId) {
        const allTasks = await this.getTasks(companyId);
        return {
            TODO: allTasks.filter((t) => t.status === TaskStatus.TODO),
            IN_PROGRESS: allTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS),
            RESOLVE: allTasks.filter((t) => t.status === TaskStatus.RESOLVE),
            DONE: allTasks.filter((t) => t.status === TaskStatus.DONE),
        };
    }
    async getTaskById(companyId, id) {
        const task = await this.taskRepo.findOne({
            where: { id, company_id: companyId },
            relations: ['assigned_to', 'evidences', 'evidences.uploaded_by', 'assessment_item'],
        });
        if (!task) {
            throw new NotFoundException(`Không tìm thấy công việc với ID: ${id}`);
        }
        return task;
    }
    async updateStatus(companyId, id, dto) {
        const task = await this.getTaskById(companyId, id);
        if (dto.status === TaskStatus.DONE) {
            const hasEvidences = Array.isArray(task.evidences) && task.evidences.length > 0;
            const hasNote = (dto.completion_note && dto.completion_note.trim() !== '') ||
                (task.completion_note && task.completion_note.trim() !== '');
            if (!hasEvidences && !hasNote) {
                throw new BadRequestException('Để hoàn thành công việc (DONE), vui lòng tải lên ít nhất 1 tài liệu minh chứng hoặc nhập ghi chú giải trình lý do hoàn thành.');
            }
            task.completed_at = new Date();
        }
        else {
            task.completed_at = null;
        }
        task.status = dto.status;
        if (dto.completion_note !== undefined) {
            task.completion_note = dto.completion_note;
        }
        return this.taskRepo.save(task);
    }
    async assignTask(companyId, id, dto) {
        const task = await this.getTaskById(companyId, id);
        const user = await this.userRepo.findOne({
            where: { id: dto.user_id, company_id: companyId },
        });
        if (!user) {
            throw new NotFoundException(`Không tìm thấy nhân viên ID ${dto.user_id} thuộc doanh nghiệp của bạn`);
        }
        task.assigned_to_user_id = user.id;
        return this.taskRepo.save(task);
    }
};
ComplianceTaskService = ComplianceTaskService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(ComplianceTask)),
    __param(1, InjectRepository(User)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], ComplianceTaskService);
export { ComplianceTaskService };
//# sourceMappingURL=compliance-task.service.js.map