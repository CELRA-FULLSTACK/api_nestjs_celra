import { describe, expect, it } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { EmbeddingService } from './embedding.service.js';

describe('EmbeddingService & Semantic Search Logic', () => {
  const configService = new ConfigService();
  const embeddingService = new EmbeddingService(configService);

  it('nên sinh vector embedding 1536 chiều ổn định', async () => {
    const text = 'Thời gian thử việc đối với lao động có trình độ đại học';
    const vec = await embeddingService.generateEmbedding(text);

    expect(Array.isArray(vec)).toBe(true);
    expect(vec.length).toBe(1536);
    expect(vec.some((v) => v !== 0)).toBe(true);
  });

  it('nên tính điểm tương đồng cao giữa 2 câu có ngữ nghĩa tương đồng', async () => {
    const query = 'hợp đồng thử việc cho nhân viên mới tốt nghiệp đại học';
    const targetDoc = 'Giới hạn thời gian thử việc theo trình độ chuyên môn tối đa 60 ngày cho đại học';
    const unrelatedDoc = 'Sử dụng hóa đơn điện tử bắt buộc và khai thuế GTGT hàng quý';

    const vecQuery = await embeddingService.generateEmbedding(query);
    const vecTarget = await embeddingService.generateEmbedding(targetDoc);
    const vecUnrelated = await embeddingService.generateEmbedding(unrelatedDoc);

    const simTarget = embeddingService.calculateCosineSimilarity(vecQuery, vecTarget);
    const simUnrelated = embeddingService.calculateCosineSimilarity(vecQuery, vecUnrelated);

    expect(simTarget).toBeGreaterThan(simUnrelated);
  });
});
