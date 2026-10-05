import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity.js';
import { User } from './entities/user.entity.js';
import { Role } from './entities/role.entity.js';
import { Permission } from './entities/permission.entity.js';
import { PasswordReset } from './entities/password-reset.entity.js';
import { Customer } from './entities/customer.entity.js';
import { ComplianceProfile } from './entities/compliance-profile.entity.js';
import { LegalRegulation, LegalRequirement } from './entities/legal-knowledge.entity.js';
import { ComplianceAssessment, AssessmentItem } from './entities/compliance-assessment.entity.js';
import { ComplianceTask } from './entities/compliance-task.entity.js';
import { TaskEvidence } from './entities/task-evidence.entity.js';
import { SeedService } from './seeds/seed.service.js';

const entities = [
  Company,
  User,
  Role,
  Permission,
  PasswordReset,
  Customer,
  ComplianceProfile,
  LegalRegulation,
  LegalRequirement,
  ComplianceAssessment,
  AssessmentItem,
  ComplianceTask,
  TaskEvidence,
];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [SeedService],
  exports: [TypeOrmModule, SeedService],
})
export class DatabaseModule {}

