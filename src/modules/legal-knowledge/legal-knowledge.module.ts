import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalRegulation, LegalRequirement } from '../../database/entities/legal-knowledge.entity.js';
import { EmbeddingService } from './embedding.service.js';
import { LegalKnowledgeController } from './legal-knowledge.controller.js';
import { LegalKnowledgeService } from './legal-knowledge.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([LegalRegulation, LegalRequirement])],
  controllers: [LegalKnowledgeController],
  providers: [LegalKnowledgeService, EmbeddingService],
  exports: [LegalKnowledgeService, EmbeddingService],
})
export class LegalKnowledgeModule {}
