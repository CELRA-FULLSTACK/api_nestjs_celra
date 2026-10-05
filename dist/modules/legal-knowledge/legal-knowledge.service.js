var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LegalKnowledgeService_1;
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegalRegulation, LegalRequirement } from '../../database/entities/legal-knowledge.entity.js';
import { SEED_LEGAL_DATA } from '../../database/seeds/legal-knowledge.seed.js';
import { EmbeddingService } from './embedding.service.js';
let LegalKnowledgeService = LegalKnowledgeService_1 = class LegalKnowledgeService {
    regulationRepo;
    requirementRepo;
    embeddingService;
    logger = new Logger(LegalKnowledgeService_1.name);
    constructor(regulationRepo, requirementRepo, embeddingService) {
        this.regulationRepo = regulationRepo;
        this.requirementRepo = requirementRepo;
        this.embeddingService = embeddingService;
    }
    async seedLegalData() {
        const existingCount = await this.regulationRepo.count();
        if (existingCount > 0) {
            this.logger.log('Kho tri thức pháp lý đã có dữ liệu, bỏ qua bước seed.');
            return;
        }
        this.logger.log('Bắt đầu nạp 10 điều khoản tri thức mẫu và sinh Vector Embeddings...');
        for (const regData of SEED_LEGAL_DATA) {
            const reg = this.regulationRepo.create({
                code: regData.code,
                title: regData.title,
                category: regData.category,
                description: regData.description,
                issuing_authority: regData.issuing_authority,
                effective_date: regData.effective_date,
            });
            const savedReg = await this.regulationRepo.save(reg);
            for (const reqData of regData.requirements) {
                const textToEmbed = `${reqData.title}. ${reqData.description}. Căn cứ: ${reqData.legal_reference}. Hướng dẫn: ${reqData.action_guide}`;
                const embedding = await this.embeddingService.generateEmbedding(textToEmbed);
                const req = this.requirementRepo.create({
                    regulation_id: savedReg.id,
                    requirement_code: reqData.requirement_code,
                    title: reqData.title,
                    description: reqData.description,
                    legal_reference: reqData.legal_reference,
                    severity: reqData.severity,
                    cycle: reqData.cycle,
                    trigger_conditions: reqData.trigger_conditions,
                    penalty_summary: reqData.penalty_summary,
                    action_guide: reqData.action_guide,
                    required_evidence_type: reqData.required_evidence_type,
                    embedding: JSON.stringify(embedding),
                });
                await this.requirementRepo.save(req);
            }
        }
        this.logger.log('✅ Đã nạp thành công kho tri thức pháp lý mẫu kèm Vector Embeddings.');
    }
    async getAllRegulations() {
        return this.regulationRepo.find({
            relations: ['requirements'],
            order: { id: 'ASC' },
        });
    }
    async getRegulationById(id) {
        const reg = await this.regulationRepo.findOne({
            where: { id },
            relations: ['requirements'],
        });
        if (!reg) {
            throw new NotFoundException(`Không tìm thấy văn bản luật với ID: ${id}`);
        }
        return reg;
    }
    async getAllRequirements(category) {
        const query = this.requirementRepo
            .createQueryBuilder('req')
            .leftJoinAndSelect('req.regulation', 'regulation')
            .select([
            'req.id',
            'req.requirement_code',
            'req.title',
            'req.description',
            'req.legal_reference',
            'req.severity',
            'req.cycle',
            'req.trigger_conditions',
            'req.penalty_summary',
            'req.action_guide',
            'req.required_evidence_type',
            'regulation.code',
            'regulation.title',
            'regulation.category',
        ]);
        if (category) {
            query.where('regulation.category = :category', { category });
        }
        return query.orderBy('req.id', 'ASC').getMany();
    }
    async searchSimilarRequirements(dto) {
        const queryEmbedding = await this.embeddingService.generateEmbedding(dto.query);
        const allRequirements = await this.requirementRepo.find({
            relations: ['regulation'],
        });
        const filtered = dto.category
            ? allRequirements.filter((r) => r.regulation?.category === dto.category)
            : allRequirements;
        const scored = filtered.map((req) => {
            let similarity = 0;
            if (req.embedding) {
                try {
                    const reqVec = JSON.parse(req.embedding);
                    similarity = this.embeddingService.calculateCosineSimilarity(queryEmbedding, reqVec);
                }
                catch {
                    similarity = 0;
                }
            }
            return {
                id: req.id,
                requirement_code: req.requirement_code,
                title: req.title,
                description: req.description,
                legal_reference: req.legal_reference,
                severity: req.severity,
                cycle: req.cycle,
                penalty_summary: req.penalty_summary,
                action_guide: req.action_guide,
                required_evidence_type: req.required_evidence_type,
                regulation: {
                    code: req.regulation?.code,
                    title: req.regulation?.title,
                    category: req.regulation?.category,
                },
                similarity_score: Math.round(similarity * 10000) / 10000,
            };
        });
        scored.sort((a, b) => b.similarity_score - a.similarity_score);
        return scored.slice(0, dto.limit || 5);
    }
    async createRequirement(dto) {
        const regulation = await this.regulationRepo.findOne({
            where: { id: dto.regulation_id },
        });
        if (!regulation) {
            throw new NotFoundException(`Không tìm thấy văn bản luật ID: ${dto.regulation_id}`);
        }
        const textToEmbed = `${dto.title}. ${dto.description}. Căn cứ: ${dto.legal_reference}. Hướng dẫn: ${dto.action_guide || ''}`;
        const embedding = await this.embeddingService.generateEmbedding(textToEmbed);
        const req = this.requirementRepo.create({
            ...dto,
            embedding: JSON.stringify(embedding),
        });
        return this.requirementRepo.save(req);
    }
};
LegalKnowledgeService = LegalKnowledgeService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(LegalRegulation)),
    __param(1, InjectRepository(LegalRequirement)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        EmbeddingService])
], LegalKnowledgeService);
export { LegalKnowledgeService };
//# sourceMappingURL=legal-knowledge.service.js.map