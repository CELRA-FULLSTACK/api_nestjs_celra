var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmbeddingService_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
let EmbeddingService = EmbeddingService_1 = class EmbeddingService {
    configService;
    logger = new Logger(EmbeddingService_1.name);
    geminiApiKey;
    openaiApiKey;
    constructor(configService) {
        this.configService = configService;
        this.geminiApiKey = this.configService.get('GEMINI_API_KEY');
        this.openaiApiKey = this.configService.get('OPENAI_API_KEY');
    }
    async generateEmbedding(text) {
        if (!text || text.trim() === '') {
            return new Array(1536).fill(0);
        }
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
            }
            catch (err) {
                this.logger.warn(`OpenAI Embedding API call failed: ${err.message}. Using deterministic fallback.`);
            }
        }
        if (this.geminiApiKey) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${this.geminiApiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'models/text-embedding-004',
                        content: { parts: [{ text }] },
                    }),
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.embedding?.values) {
                        const values = result.embedding.values;
                        if (values.length === 1536)
                            return values;
                        if (values.length < 1536) {
                            return [...values, ...new Array(1536 - values.length).fill(0)];
                        }
                        return values.slice(0, 1536);
                    }
                }
            }
            catch (err) {
                this.logger.warn(`Gemini Embedding API call failed: ${err.message}. Using deterministic fallback.`);
            }
        }
        return this.createDeterministicEmbedding(text, 1536);
    }
    createDeterministicEmbedding(text, dimensions = 1536) {
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
        const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        if (norm > 0) {
            for (let i = 0; i < dimensions; i++) {
                vector[i] = vector[i] / norm;
            }
        }
        return vector;
    }
    calculateCosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        const len = Math.min(vecA.length, vecB.length);
        for (let i = 0; i < len; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0)
            return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
};
EmbeddingService = EmbeddingService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], EmbeddingService);
export { EmbeddingService };
//# sourceMappingURL=embedding.service.js.map