import { describe, expect, it } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../../configs/constants.js';
import { ComplianceTaskService } from './compliance-task.service.js';

describe('ComplianceTaskService - State Machine & Validation', () => {
  it('nên ném ngoại lệ nếu chuyển DONE mà không có bằng chứng hoặc ghi chú', async () => {
    const mockTaskRepo: any = {
      findOne: async () => ({
        id: 1,
        company_id: 10,
        status: TaskStatus.IN_PROGRESS,
        evidences: [],
        completion_note: null,
      }),
      save: async (task: any) => task,
    };
    const mockUserRepo: any = {};

    const service = new ComplianceTaskService(mockTaskRepo, mockUserRepo);

    await expect(
      service.updateStatus(10, 1, {
        status: TaskStatus.DONE,
        completion_note: '',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('nên cho phép chuyển DONE nếu có ghi chú giải trình lý do', async () => {
    const mockTask: any = {
      id: 2,
      company_id: 10,
      status: TaskStatus.IN_PROGRESS,
      evidences: [],
      completion_note: null,
    };
    const mockTaskRepo: any = {
      findOne: async () => mockTask,
      save: async (task: any) => task,
    };
    const mockUserRepo: any = {};

    const service = new ComplianceTaskService(mockTaskRepo, mockUserRepo);

    const updated = await service.updateStatus(10, 2, {
      status: TaskStatus.DONE,
      completion_note: 'Đã hoàn thành thủ tục theo công văn nội bộ số 12',
    });

    expect(updated.status).toBe(TaskStatus.DONE);
    expect(updated.completion_note).toContain('công văn nội bộ');
    expect(updated.completed_at).toBeDefined();
  });
});
