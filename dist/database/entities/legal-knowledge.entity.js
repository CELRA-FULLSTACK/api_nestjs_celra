var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { SeverityLevel } from '../../configs/constants.js';
let LegalRegulation = class LegalRegulation {
    id;
    code;
    title;
    category;
    description;
    issuing_authority;
    effective_date;
    requirements;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], LegalRegulation.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, unique: true, name: 'code' }),
    __metadata("design:type", String)
], LegalRegulation.prototype, "code", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'title' }),
    __metadata("design:type", String)
], LegalRegulation.prototype, "title", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, name: 'category' }),
    __metadata("design:type", String)
], LegalRegulation.prototype, "category", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'description' }),
    __metadata("design:type", Object)
], LegalRegulation.prototype, "description", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, nullable: true, name: 'issuing_authority' }),
    __metadata("design:type", Object)
], LegalRegulation.prototype, "issuing_authority", void 0);
__decorate([
    Column({ type: 'date', nullable: true, name: 'effective_date' }),
    __metadata("design:type", Object)
], LegalRegulation.prototype, "effective_date", void 0);
__decorate([
    OneToMany(() => LegalRequirement, (req) => req.regulation, { cascade: true }),
    __metadata("design:type", Object)
], LegalRegulation.prototype, "requirements", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], LegalRegulation.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], LegalRegulation.prototype, "updated_at", void 0);
LegalRegulation = __decorate([
    Entity('legal_regulations')
], LegalRegulation);
export { LegalRegulation };
let LegalRequirement = class LegalRequirement {
    id;
    regulation_id;
    regulation;
    requirement_code;
    title;
    description;
    legal_reference;
    severity;
    cycle;
    trigger_conditions;
    penalty_summary;
    action_guide;
    required_evidence_type;
    embedding;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], LegalRequirement.prototype, "id", void 0);
__decorate([
    Column({ type: 'integer', name: 'regulation_id' }),
    __metadata("design:type", Number)
], LegalRequirement.prototype, "regulation_id", void 0);
__decorate([
    ManyToOne(() => LegalRegulation, (reg) => reg.requirements, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'regulation_id' }),
    __metadata("design:type", Object)
], LegalRequirement.prototype, "regulation", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, unique: true, name: 'requirement_code' }),
    __metadata("design:type", String)
], LegalRequirement.prototype, "requirement_code", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'title' }),
    __metadata("design:type", String)
], LegalRequirement.prototype, "title", void 0);
__decorate([
    Column({ type: 'text', name: 'description' }),
    __metadata("design:type", String)
], LegalRequirement.prototype, "description", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'legal_reference' }),
    __metadata("design:type", String)
], LegalRequirement.prototype, "legal_reference", void 0);
__decorate([
    Column({ type: 'enum', enum: SeverityLevel, default: SeverityLevel.STANDARD, name: 'severity' }),
    __metadata("design:type", String)
], LegalRequirement.prototype, "severity", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'ONE_TIME', name: 'cycle' }),
    __metadata("design:type", String)
], LegalRequirement.prototype, "cycle", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true, name: 'trigger_conditions' }),
    __metadata("design:type", Object)
], LegalRequirement.prototype, "trigger_conditions", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'penalty_summary' }),
    __metadata("design:type", Object)
], LegalRequirement.prototype, "penalty_summary", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'action_guide' }),
    __metadata("design:type", Object)
], LegalRequirement.prototype, "action_guide", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'required_evidence_type' }),
    __metadata("design:type", Object)
], LegalRequirement.prototype, "required_evidence_type", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'embedding' }),
    __metadata("design:type", Object)
], LegalRequirement.prototype, "embedding", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], LegalRequirement.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], LegalRequirement.prototype, "updated_at", void 0);
LegalRequirement = __decorate([
    Entity('legal_requirements')
], LegalRequirement);
export { LegalRequirement };
//# sourceMappingURL=legal-knowledge.entity.js.map