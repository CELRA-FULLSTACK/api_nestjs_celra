import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { User } from '../../database/entities/user.entity.js';
import { ComplianceTaskController } from './compliance-task.controller.js';
import { ComplianceTaskService } from './compliance-task.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceTask, User])],
  controllers: [ComplianceTaskController],
  providers: [ComplianceTaskService],
  exports: [ComplianceTaskService],
})
export class ComplianceTaskModule {}
