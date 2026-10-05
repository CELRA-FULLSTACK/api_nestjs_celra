var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from './configs/env.config.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './core/auth/auth.module.js';
import { RbacModule } from './modules/rbac/rbac.module.js';
import { UserModule } from './modules/user/user.module.js';
import { LegalKnowledgeModule } from './modules/legal-knowledge/legal-knowledge.module.js';
import { ComplianceProfileModule } from './modules/compliance-profile/compliance-profile.module.js';
import { ComplianceAssessmentModule } from './modules/compliance-assessment/compliance-assessment.module.js';
import { ComplianceTaskModule } from './modules/compliance-task/compliance-task.module.js';
import { EvidenceVaultModule } from './modules/evidence-vault/evidence-vault.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [envConfig],
                envFilePath: ['.env.development', '.env'],
            }),
            TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: (configService) => ({
                    ...configService.get('app.database'),
                    autoLoadEntities: true,
                }),
                inject: [ConfigService],
            }),
            DatabaseModule,
            AuthModule,
            RbacModule,
            UserModule,
            LegalKnowledgeModule,
            ComplianceProfileModule,
            ComplianceAssessmentModule,
            ComplianceTaskModule,
            EvidenceVaultModule,
        ],
        controllers: [AppController],
        providers: [AppService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map