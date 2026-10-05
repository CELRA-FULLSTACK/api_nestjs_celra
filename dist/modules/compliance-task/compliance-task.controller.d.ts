import { ComplianceTaskService } from './compliance-task.service.js';
import { AssignTaskDto } from './dto/assign-task.dto.js';
import { FilterTaskDto } from './dto/filter-task.dto.js';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto.js';
export declare class ComplianceTaskController {
    private readonly taskService;
    constructor(taskService: ComplianceTaskService);
    getTasks(companyId: number, filter: FilterTaskDto): Promise<import("../../database/entities/compliance-task.entity.js").ComplianceTask[]>;
    getKanbanBoard(companyId: number): Promise<{
        TODO: import("../../database/entities/compliance-task.entity.js").ComplianceTask[];
        IN_PROGRESS: import("../../database/entities/compliance-task.entity.js").ComplianceTask[];
        RESOLVE: import("../../database/entities/compliance-task.entity.js").ComplianceTask[];
        DONE: import("../../database/entities/compliance-task.entity.js").ComplianceTask[];
    }>;
    getTaskDetail(companyId: number, id: number): Promise<import("../../database/entities/compliance-task.entity.js").ComplianceTask>;
    updateStatus(companyId: number, id: number, dto: UpdateTaskStatusDto): Promise<import("../../database/entities/compliance-task.entity.js").ComplianceTask>;
    assignTask(companyId: number, id: number, dto: AssignTaskDto): Promise<import("../../database/entities/compliance-task.entity.js").ComplianceTask>;
}
