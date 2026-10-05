import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionCode } from '../../configs/constants.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../core/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../core/guards/permissions.guard.js';
import { ComplianceTaskService } from './compliance-task.service.js';
import { AssignTaskDto } from './dto/assign-task.dto.js';
import { FilterTaskDto } from './dto/filter-task.dto.js';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto.js';

@Controller('tasks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ComplianceTaskController {
  constructor(private readonly taskService: ComplianceTaskService) {}

  /**
   * 1. Lấy danh sách toàn bộ task (hỗ trợ lọc & tìm kiếm)
   */
  @Get()
  @RequirePermissions(PermissionCode.TASK_VIEW)
  async getTasks(
    @CurrentUser('companyId') companyId: number,
    @Query() filter: FilterTaskDto,
  ) {
    return this.taskService.getTasks(companyId, filter);
  }

  /**
   * 2. Lấy dữ liệu 4 cột bảng Kanban
   */
  @Get('kanban')
  @RequirePermissions(PermissionCode.TASK_VIEW)
  async getKanbanBoard(@CurrentUser('companyId') companyId: number) {
    return this.taskService.getKanbanBoard(companyId);
  }

  /**
   * 3. Lấy chi tiết một task
   */
  @Get(':id')
  @RequirePermissions(PermissionCode.TASK_VIEW)
  async getTaskDetail(
    @CurrentUser('companyId') companyId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.taskService.getTaskById(companyId, id);
  }

  /**
   * 4. Cập nhật trạng thái Task theo Kanban State Machine
   */
  @Patch(':id/status')
  @RequirePermissions(PermissionCode.TASK_UPDATE)
  async updateStatus(
    @CurrentUser('companyId') companyId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.taskService.updateStatus(companyId, id, dto);
  }

  /**
   * 5. Phân công người phụ trách xử lý Task
   */
  @Patch(':id/assign')
  @RequirePermissions(PermissionCode.TASK_UPDATE)
  async assignTask(
    @CurrentUser('companyId') companyId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignTaskDto,
  ) {
    return this.taskService.assignTask(companyId, id, dto);
  }
}
