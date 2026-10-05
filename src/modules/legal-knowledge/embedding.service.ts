import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly geminiApiKey: string | undefined;
  private readonly openaiApiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.geminiApiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  /**
   * Sinh vector embedding (1536 chiều) cho chuỗi văn bản
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!text || text.trim() === '') {
      return new Array(1536).fill(0);
    }

    // 1. Thử gọi OpenAI Embedding nếu có API Key
    if (this.openaiApiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: text,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data?.[0]?.embedding) {
            return result.data[0].embedding;
          }
        }
      } catch (err: any) {
        this.logger.warn(`OpenAI Embedding API call failed: ${err.message}. Using deterministic fallback.`);
      }
    }

    // 2. Thử gọi Gemini Embedding nếu có API Key
    if (this.geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${this.geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'models/text-embedding-004',
              content: { parts: [{ text }] },
            }),
          },
        );

        if (response.ok) {
          const result = await response.json();
          if (result.embedding?.values) {
            const values: number[] = result.embedding.values;
            // Pad hoặc normalize lên 1536 chiều nếu cần
            if (values.length === 1536) return values;
            if (values.length < 1536) {
              return [...values, ...new Array(1536 - values.length).fill(0)];
            }
            return values.slice(0, 1536);
          }
        }
      } catch (err: any) {
        this.logger.warn(`Gemini Embedding API call failed: ${err.message}. Using deterministic fallback.`);
      }
    }

    // 3. Fallback: Sinh deterministic pseudo-embedding dựa trên hashing ngữ nghĩa token để dev/test offline 100% ổn định
    return this.createDeterministicEmbedding(text, 1536);
  }

  /**
   * Sinh vector chuẩn hóa dựa trên hash các token từ vựng (cho môi trường offline/test)
   */
  private createDeterministicEmbedding(text: string, dimensions = 1536): number[] {
    const vector = new Array(dimensions).fill(0);
    const tokens = text.toLowerCase().split(/\s+/);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      let hash = 0;
      for (let j = 0; j < token.length; j++) {
        hash = (hash << 5) - hash + token.charCodeAt(j);
        hash |= 0;
      }
      const index = Math.abs(hash) % dimensions;
      vector[index] += 1.0 / Math.sqrt(tokens.length);
    }

    // Normalize vector (L2 norm)
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm > 0) {
      for (let i = 0; i < dimensions; i++) {
        vector[i] = vector[i] / norm;
      }
    }
    return vector;
  }

  /**
   * Tính Cosine Similarity giữa 2 vector
   */
  calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    const len = Math.min(vecA.length, vecB.length);
    for (let i = 0; i < len; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
