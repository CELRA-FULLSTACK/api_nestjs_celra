import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { TaskEvidence } from '../../database/entities/task-evidence.entity.js';
import { EvidenceVaultController } from './evidence-vault.controller.js';
import { EvidenceVaultService } from './evidence-vault.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEvidence, ComplianceTask])],
  controllers: [EvidenceVaultController],
  providers: [EvidenceVaultService],
  exports: [EvidenceVaultService],
})
export class EvidenceVaultModule {}
