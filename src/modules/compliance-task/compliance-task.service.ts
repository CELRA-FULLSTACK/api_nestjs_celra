import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatus } from '../../configs/constants.js';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { User } from '../../database/entities/user.entity.js';
import { AssignTaskDto } from './dto/assign-task.dto.js';
import { FilterTaskDto } from './dto/filter-task.dto.js';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto.js';

@Injectable()
export class ComplianceTaskService {
  private readonly logger = new Logger(ComplianceTaskService.name);

  constructor(
    @InjectRepository(ComplianceTask)
    private readonly taskRepo: Repository<ComplianceTask>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Lấy danh sách task phẳng có lọc
   */
  async getTasks(companyId: number, filter?: FilterTaskDto) {
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
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${filter.search}%` },
      );
    }

    return query.orderBy('task.created_at', 'DESC').getMany();
  }

  /**
   * Lấy dữ liệu gom nhóm 4 cột cho bảng Kanban
   */
  async getKanbanBoard(companyId: number) {
    const allTasks = await this.getTasks(companyId);

    return {
      TODO: allTasks.filter((t) => t.status === TaskStatus.TODO),
      IN_PROGRESS: allTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS),
      RESOLVE: allTasks.filter((t) => t.status === TaskStatus.RESOLVE),
      DONE: allTasks.filter((t) => t.status === TaskStatus.DONE),
    };
  }

  /**
   * Lấy chi tiết một task theo ID (Tenant Isolation)
   */
  async getTaskById(companyId: number, id: number): Promise<ComplianceTask> {
    const task = await this.taskRepo.findOne({
      where: { id, company_id: companyId },
      relations: ['assigned_to', 'evidences', 'evidences.uploaded_by', 'assessment_item'],
    });

    if (!task) {
      throw new NotFoundException(`Không tìm thấy công việc với ID: ${id}`);
    }

    return task;
  }

  /**
   * Cập nhật trạng thái Task theo State Machine (Kanban)
   */
  async updateStatus(
    companyId: number,
    id: number,
    dto: UpdateTaskStatusDto,
  ): Promise<ComplianceTask> {
    const task = await this.getTaskById(companyId, id);

    // Quy tắc linh hoạt: Khi chuyển sang DONE, phải có file bằng chứng HOẶC có ghi chú giải trình
    if (dto.status === TaskStatus.DONE) {
      const hasEvidences = Array.isArray(task.evidences) && task.evidences.length > 0;
      const hasNote =
        (dto.completion_note && dto.completion_note.trim() !== '') ||
        (task.completion_note && task.completion_note.trim() !== '');

      if (!hasEvidences && !hasNote) {
        throw new BadRequestException(
          'Để hoàn thành công việc (DONE), vui lòng tải lên ít nhất 1 tài liệu minh chứng hoặc nhập ghi chú giải trình lý do hoàn thành.',
        );
      }
      task.completed_at = new Date();
    } else {
      task.completed_at = null;
    }

    task.status = dto.status;
    if (dto.completion_note !== undefined) {
      task.completion_note = dto.completion_note;
    }

    return this.taskRepo.save(task);
  }

  /**
   * Phân công công việc cho nhân sự nội bộ (Tenant Check)
   */
  async assignTask(
    companyId: number,
    id: number,
    dto: AssignTaskDto,
  ): Promise<ComplianceTask> {
    const task = await this.getTaskById(companyId, id);

    // Kiểm tra nhân sự có thuộc cùng công ty không
    const user = await this.userRepo.findOne({
      where: { id: dto.user_id, company_id: companyId },
    });

    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy nhân viên ID ${dto.user_id} thuộc doanh nghiệp của bạn`,
      );
    }

    task.assigned_to_user_id = user.id;
    return this.taskRepo.save(task);
  }
}
