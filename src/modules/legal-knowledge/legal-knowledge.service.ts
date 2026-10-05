import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegalRegulation, LegalRequirement } from '../../database/entities/legal-knowledge.entity.js';
import { SEED_LEGAL_DATA } from '../../database/seeds/legal-knowledge.seed.js';
import { CreateRequirementDto } from './dto/create-requirement.dto.js';
import { LegalSearchDto } from './dto/legal-search.dto.js';
import { EmbeddingService } from './embedding.service.js';

@Injectable()
export class LegalKnowledgeService {
  private readonly logger = new Logger(LegalKnowledgeService.name);

  constructor(
    @InjectRepository(LegalRegulation)
    private readonly regulationRepo: Repository<LegalRegulation>,
    @InjectRepository(LegalRequirement)
    private readonly requirementRepo: Repository<LegalRequirement>,
    private readonly embeddingService: EmbeddingService,
  ) {}

  /**
   * Khởi tạo dữ liệu tri thức mẫu nếu cơ sở dữ liệu trống
   */
  async seedLegalData(): Promise<void> {
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
        // Sinh vector embedding kết hợp tiêu đề, mô tả và trích dẫn pháp lý
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

  /**
   * Lấy danh sách toàn bộ văn bản luật
   */
  async getAllRegulations() {
    return this.regulationRepo.find({
      relations: ['requirements'],
      order: { id: 'ASC' },
    });
  }

  /**
   * Lấy chi tiết văn bản luật theo ID
   */
  async getRegulationById(id: number) {
    const reg = await this.regulationRepo.findOne({
      where: { id },
      relations: ['requirements'],
    });
    if (!reg) {
      throw new NotFoundException(`Không tìm thấy văn bản luật với ID: ${id}`);
    }
    return reg;
  }

  /**
   * Lấy danh sách nghĩa vụ tuân thủ có lọc theo phân loại
   */
  async getAllRequirements(category?: string) {
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

  /**
   * Tìm kiếm ngữ nghĩa (Semantic Search RAG) theo câu truy vấn
   */
  async searchSimilarRequirements(dto: LegalSearchDto) {
    const queryEmbedding = await this.embeddingService.generateEmbedding(dto.query);
    const allRequirements = await this.requirementRepo.find({
      relations: ['regulation'],
    });

    // Lọc theo category nếu có
    const filtered = dto.category
      ? allRequirements.filter((r) => r.regulation?.category === dto.category)
      : allRequirements;

    // Tính độ tương đồng cosine
    const scored = filtered.map((req) => {
      let similarity = 0;
      if (req.embedding) {
        try {
          const reqVec = JSON.parse(req.embedding);
          similarity = this.embeddingService.calculateCosineSimilarity(queryEmbedding, reqVec);
        } catch {
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

    // Sắp xếp theo độ tương đồng giảm dần
    scored.sort((a, b) => b.similarity_score - a.similarity_score);

    return scored.slice(0, dto.limit || 5);
  }

  /**
   * Tạo mới điều khoản nghĩa vụ (Dành cho Quản trị viên hệ thống)
   */
  async createRequirement(dto: CreateRequirementDto) {
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
}
