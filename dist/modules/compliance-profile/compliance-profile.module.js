var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../../database/entities/company.entity.js';
import { ComplianceProfile } from '../../database/entities/compliance-profile.entity.js';
import { ComplianceProfileController } from './compliance-profile.controller.js';
import { ComplianceProfileService } from './compliance-profile.service.js';
let ComplianceProfileModule = class ComplianceProfileModule {
};
ComplianceProfileModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([ComplianceProfile, Company])],
        controllers: [ComplianceProfileController],
        providers: [ComplianceProfileService],
        exports: [ComplianceProfileService],
    })
], ComplianceProfileModule);
export { ComplianceProfileModule };
//# sourceMappingURL=compliance-profile.module.js.map