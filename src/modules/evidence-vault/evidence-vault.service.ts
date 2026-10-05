import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { EvidenceVerificationStatus, TaskStatus } from '../../configs/constants.js';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { TaskEvidence } from '../../database/entities/task-evidence.entity.js';

@Injectable()
export class EvidenceVaultService {
  private readonly logger = new Logger(EvidenceVaultService.name);
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads', 'evidences');

  constructor(
    @InjectRepository(TaskEvidence)
    private readonly evidenceRepo: Repository<TaskEvidence>,
    @InjectRepository(ComplianceTask)
    private readonly taskRepo: Repository<ComplianceTask>,
  ) {
    // Đảm bảo thư mục lưu trữ file tồn tại
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Tải lên và lưu trữ hồ sơ minh chứng cho Task tuân thủ
   */
  async uploadEvidence(
    companyId: number,
    taskId: number,
    userId: number,
    file: { originalname: string; filename?: string; mimetype: string; size: number },
  ): Promise<TaskEvidence> {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file bằng chứng đính kèm');
    }

    // 1. Kiểm tra quyền sở hữu task (Tenant isolation)
    const task = await this.taskRepo.findOne({
      where: { id: taskId, company_id: companyId },
    });
    if (!task) {
      throw new NotFoundException(`Không tìm thấy công việc với ID: ${taskId}`);
    }

    // 2. Tạo bản ghi TaskEvidence
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

    // 3. Tự động chuyển trạng thái task sang RESOLVE nếu đang TODO hoặc IN_PROGRESS
    if (task.status === TaskStatus.TODO || task.status === TaskStatus.IN_PROGRESS) {
      task.status = TaskStatus.RESOLVE;
      await this.taskRepo.save(task);
      this.logger.log(`Tự động chuyển Task #${task.id} sang RESOLVE sau khi nộp bằng chứng.`);
    }

    return savedEvidence;
  }

  /**
   * Lấy toàn bộ kho tài liệu số của doanh nghiệp
   */
  async getCompanyEvidences(companyId: number): Promise<TaskEvidence[]> {
    return this.evidenceRepo
      .createQueryBuilder('evidence')
      .innerJoinAndSelect('evidence.task', 'task')
      .leftJoinAndSelect('evidence.uploaded_by', 'uploaded_by')
      .where('task.company_id = :companyId', { companyId })
      .orderBy('evidence.created_at', 'DESC')
      .getMany();
  }

  /**
   * Xóa file bằng chứng
   */
  async deleteEvidence(companyId: number, evidenceId: number): Promise<{ success: boolean }> {
    const evidence = await this.evidenceRepo
      .createQueryBuilder('evidence')
      .innerJoinAndSelect('evidence.task', 'task')
      .where('evidence.id = :evidenceId', { evidenceId })
      .andWhere('task.company_id = :companyId', { companyId })
      .getOne();

    if (!evidence) {
      throw new NotFoundException(`Không tìm thấy tài liệu bằng chứng ID: ${evidenceId}`);
    }

    // Xóa file vật lý trên đĩa nếu tồn tại
    const diskPath = path.resolve(process.cwd(), evidence.file_url.replace(/^\//, ''));
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (err: any) {
        this.logger.warn(`Không thể xóa file vật lý: ${diskPath} (${err.message})`);
      }
    }

    await this.evidenceRepo.remove(evidence);
    return { success: true };
  }
}
