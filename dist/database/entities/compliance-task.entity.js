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
import { SeverityLevel, TaskStatus } from '../../configs/constants.js';
import { Company } from './company.entity.js';
import { User } from './user.entity.js';
import { AssessmentItem } from './compliance-assessment.entity.js';
import { TaskEvidence } from './task-evidence.entity.js';
let ComplianceTask = class ComplianceTask {
    id;
    company_id;
    company;
    assessment_item_id;
    assessment_item;
    title;
    description;
    legal_reference;
    action_guide;
    severity;
    status;
    deadline;
    assigned_to_user_id;
    assigned_to;
    completion_note;
    completed_at;
    evidences;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ComplianceTask.prototype, "id", void 0);
__decorate([
    Column({ type: 'integer', name: 'company_id' }),
    __metadata("design:type", Number)
], ComplianceTask.prototype, "company_id", void 0);
__decorate([
    ManyToOne(() => Company, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'company_id' }),
    __metadata("design:type", Object)
], ComplianceTask.prototype, "company", void 0);
__decorate([
    Column({ type: 'integer', nullable: true, name: 'assessment_item_id' }),
    __metadata("design:type", Object)
], ComplianceTask.prototype, "assessment_item_id", void 0);
__decorate([
    ManyToOne(() => AssessmentItem, { onDelete: 'SET NULL' }),
    JoinColumn({ name: 'assessment_item_id' }),
    __metadata("design:type", Object)
], ComplianceTask.prototype, "assessment_item", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'title' }),
    __metadata("design:type", String)
], ComplianceTask.prototype, "title", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'description' }),
    __metadata("design:type", Object)
], ComplianceTask.prototype, "description", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true, name: 'legal_reference' }),
    __metadata("design:type", Object)
], ComplianceTask.prototype, "legal_reference", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'action_guide' }),
    __metadata("design:type", Object)
], ComplianceTask.prototype, "action_guide", void 0);
__decorate([
    Column({ type: 'enum', enum: SeverityLevel, default: SeverityLevel.STANDARD, name: 'severity' }),
    __metadata("design:type", String)
], ComplianceTask.prototype, "severity", void 0);
__decorate([
    Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO, name: 'status' }),
    __metadata("design:type", String)
], ComplianceTask.prototype, "status", void 0);
__decorate([
    Column({ type: 'date', nullable: true, name: 'deadline' }),
    __metadata("design:type", Object)
], ComplianceTask.prototype, "deadline", void 0);
__decorate([
    Column({ type: 'integer', nullable: true, name: 'assigned_to_user_id' }),
    __metadata("design:type", Object)
], ComplianceTask.prototype, "assigned_to_user_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'SET NULL' }),
    JoinColumn({ name: 'assigned_to_user_id' }),
    __metadata("design:type", Object)
], ComplianceTask.prototype, "assigned_to", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'completion_note' }),
    __metadata("design:type", Object)
], ComplianceTask.prototype, "completion_note", void 0);
__decorate([
    Column({ type: 'timestamp', nullable: true, name: 'completed_at' }),
    __metadata("design:type", Object)
], ComplianceTask.prototype, "completed_at", void 0);
__decorate([
    OneToMany(() => TaskEvidence, (evidence) => evidence.task, { cascade: true }),
    __metadata("design:type", Object)
], ComplianceTask.prototype, "evidences", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], ComplianceTask.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ComplianceTask.prototype, "updated_at", void 0);
ComplianceTask = __decorate([
    Entity('compliance_tasks')
], ComplianceTask);
export { ComplianceTask };
//# sourceMappingURL=compliance-task.entity.js.map