import { Repository } from 'typeorm';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { User } from '../../database/entities/user.entity.js';
import { AssignTaskDto } from './dto/assign-task.dto.js';
import { FilterTaskDto } from './dto/filter-task.dto.js';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto.js';
export declare class ComplianceTaskService {
    private readonly taskRepo;
    private readonly userRepo;
    private readonly logger;
    constructor(taskRepo: Repository<ComplianceTask>, userRepo: Repository<User>);
    getTasks(companyId: number, filter?: FilterTaskDto): Promise<ComplianceTask[]>;
    getKanbanBoard(companyId: number): Promise<{
        TODO: ComplianceTask[];
        IN_PROGRESS: ComplianceTask[];
        RESOLVE: ComplianceTask[];
        DONE: ComplianceTask[];
    }>;
    getTaskById(companyId: number, id: number): Promise<ComplianceTask>;
    updateStatus(companyId: number, id: number, dto: UpdateTaskStatusDto): Promise<ComplianceTask>;
    assignTask(companyId: number, id: number, dto: AssignTaskDto): Promise<ComplianceTask>;
}
