import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../../database/entities/company.entity.js';
import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { ComplianceProfileController } from './compliance-profile.controller.js';
import { ComplianceProfileService } from './compliance-profile.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceProfile, Company])],
  controllers: [ComplianceProfileController],
  providers: [ComplianceProfileService],
  exports: [ComplianceProfileService],
})
export class ComplianceProfileModule {}
