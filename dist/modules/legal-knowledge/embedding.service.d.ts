import { ConfigService } from '@nestjs/config';
export declare class EmbeddingService {
    private readonly configService;
    private readonly logger;
    private readonly geminiApiKey;
    private readonly openaiApiKey;
    constructor(configService: ConfigService);
    generateEmbedding(text: string): Promise<number[]>;
    private createDeterministicEmbedding;
    calculateCosineSimilarity(vecA: number[], vecB: number[]): number;
}
