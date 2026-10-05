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
import { AssessmentStatus, ComplianceItemStatus, SeverityLevel } from '../../configs/constants.js';
import { Company } from './company.entity.js';
import { User } from './user.entity.js';
import { LegalRequirement } from './legal-knowledge.entity.js';
let ComplianceAssessment = class ComplianceAssessment {
    id;
    company_id;
    company;
    created_by_user_id;
    created_by;
    overall_score;
    status;
    total_requirements_checked;
    compliant_count;
    non_compliant_count;
    missing_evidence_count;
    ai_summary;
    items;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ComplianceAssessment.prototype, "id", void 0);
__decorate([
    Column({ type: 'integer', name: 'company_id' }),
    __metadata("design:type", Number)
], ComplianceAssessment.prototype, "company_id", void 0);
__decorate([
    ManyToOne(() => Company, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'company_id' }),
    __metadata("design:type", Object)
], ComplianceAssessment.prototype, "company", void 0);
__decorate([
    Column({ type: 'integer', name: 'created_by_user_id' }),
    __metadata("design:type", Number)
], ComplianceAssessment.prototype, "created_by_user_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'RESTRICT' }),
    JoinColumn({ name: 'created_by_user_id' }),
    __metadata("design:type", Object)
], ComplianceAssessment.prototype, "created_by", void 0);
__decorate([
    Column({ type: 'integer', default: 0, name: 'overall_score' }),
    __metadata("design:type", Number)
], ComplianceAssessment.prototype, "overall_score", void 0);
__decorate([
    Column({ type: 'enum', enum: AssessmentStatus, default: AssessmentStatus.IN_PROGRESS, name: 'status' }),
    __metadata("design:type", String)
], ComplianceAssessment.prototype, "status", void 0);
__decorate([
    Column({ type: 'integer', default: 0, name: 'total_requirements_checked' }),
    __metadata("design:type", Number)
], ComplianceAssessment.prototype, "total_requirements_checked", void 0);
__decorate([
    Column({ type: 'integer', default: 0, name: 'compliant_count' }),
    __metadata("design:type", Number)
], ComplianceAssessment.prototype, "compliant_count", void 0);
__decorate([
    Column({ type: 'integer', default: 0, name: 'non_compliant_count' }),
    __metadata("design:type", Number)
], ComplianceAssessment.prototype, "non_compliant_count", void 0);
__decorate([
    Column({ type: 'integer', default: 0, name: 'missing_evidence_count' }),
    __metadata("design:type", Number)
], ComplianceAssessment.prototype, "missing_evidence_count", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'ai_summary' }),
    __metadata("design:type", Object)
], ComplianceAssessment.prototype, "ai_summary", void 0);
__decorate([
    OneToMany(() => AssessmentItem, (item) => item.assessment, { cascade: true }),
    __metadata("design:type", Object)
], ComplianceAssessment.prototype, "items", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], ComplianceAssessment.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ComplianceAssessment.prototype, "updated_at", void 0);
ComplianceAssessment = __decorate([
    Entity('compliance_assessments')
], ComplianceAssessment);
export { ComplianceAssessment };
let AssessmentItem = class AssessmentItem {
    id;
    assessment_id;
    assessment;
    requirement_id;
    requirement;
    title;
    legal_reference;
    severity;
    status;
    gap_reason;
    recommended_action;
    auto_generated_task_id;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], AssessmentItem.prototype, "id", void 0);
__decorate([
    Column({ type: 'integer', name: 'assessment_id' }),
    __metadata("design:type", Number)
], AssessmentItem.prototype, "assessment_id", void 0);
__decorate([
    ManyToOne(() => ComplianceAssessment, (assessment) => assessment.items, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'assessment_id' }),
    __metadata("design:type", Object)
], AssessmentItem.prototype, "assessment", void 0);
__decorate([
    Column({ type: 'integer', nullable: true, name: 'requirement_id' }),
    __metadata("design:type", Object)
], AssessmentItem.prototype, "requirement_id", void 0);
__decorate([
    ManyToOne(() => LegalRequirement, { onDelete: 'SET NULL' }),
    JoinColumn({ name: 'requirement_id' }),
    __metadata("design:type", Object)
], AssessmentItem.prototype, "requirement", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'title' }),
    __metadata("design:type", String)
], AssessmentItem.prototype, "title", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'legal_reference' }),
    __metadata("design:type", String)
], AssessmentItem.prototype, "legal_reference", void 0);
__decorate([
    Column({ type: 'enum', enum: SeverityLevel, default: SeverityLevel.STANDARD, name: 'severity' }),
    __metadata("design:type", String)
], AssessmentItem.prototype, "severity", void 0);
__decorate([
    Column({ type: 'enum', enum: ComplianceItemStatus, name: 'status' }),
    __metadata("design:type", String)
], AssessmentItem.prototype, "status", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'gap_reason' }),
    __metadata("design:type", Object)
], AssessmentItem.prototype, "gap_reason", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'recommended_action' }),
    __metadata("design:type", Object)
], AssessmentItem.prototype, "recommended_action", void 0);
__decorate([
    Column({ type: 'integer', nullable: true, name: 'auto_generated_task_id' }),
    __metadata("design:type", Object)
], AssessmentItem.prototype, "auto_generated_task_id", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], AssessmentItem.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], AssessmentItem.prototype, "updated_at", void 0);
AssessmentItem = __decorate([
    Entity('assessment_items')
], AssessmentItem);
export { AssessmentItem };
//# sourceMappingURL=compliance-assessment.entity.js.map