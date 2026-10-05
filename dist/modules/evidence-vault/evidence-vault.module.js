var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceTask } from '../../database/entities/compliance-task.entity.js';
import { TaskEvidence } from '../../database/entities/task-evidence.entity.js';
import { EvidenceVaultController } from './evidence-vault.controller.js';
import { EvidenceVaultService } from './evidence-vault.service.js';
let EvidenceVaultModule = class EvidenceVaultModule {
};
EvidenceVaultModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([TaskEvidence, ComplianceTask])],
        controllers: [EvidenceVaultController],
        providers: [EvidenceVaultService],
        exports: [EvidenceVaultService],
    })
], EvidenceVaultModule);
export { EvidenceVaultModule };
//# sourceMappingURL=evidence-vault.module.js.map