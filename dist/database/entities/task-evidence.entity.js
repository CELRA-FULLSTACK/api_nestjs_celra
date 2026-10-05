var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { EvidenceVerificationStatus } from '../../configs/constants.js';
import { ComplianceTask } from './compliance-task.entity.js';
import { User } from './user.entity.js';
let TaskEvidence = class TaskEvidence {
    id;
    task_id;
    task;
    file_name;
    file_url;
    file_type;
    file_size;
    verified_status;
    uploaded_by_user_id;
    uploaded_by;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], TaskEvidence.prototype, "id", void 0);
__decorate([
    Column({ type: 'integer', name: 'task_id' }),
    __metadata("design:type", Number)
], TaskEvidence.prototype, "task_id", void 0);
__decorate([
    ManyToOne(() => ComplianceTask, (task) => task.evidences, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'task_id' }),
    __metadata("design:type", Object)
], TaskEvidence.prototype, "task", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'file_name' }),
    __metadata("design:type", String)
], TaskEvidence.prototype, "file_name", void 0);
__decorate([
    Column({ type: 'varchar', length: 500, name: 'file_url' }),
    __metadata("design:type", String)
], TaskEvidence.prototype, "file_url", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, nullable: true, name: 'file_type' }),
    __metadata("design:type", Object)
], TaskEvidence.prototype, "file_type", void 0);
__decorate([
    Column({ type: 'bigint', nullable: true, name: 'file_size' }),
    __metadata("design:type", Object)
], TaskEvidence.prototype, "file_size", void 0);
__decorate([
    Column({
        type: 'enum',
        enum: EvidenceVerificationStatus,
        default: EvidenceVerificationStatus.PENDING,
        name: 'verified_status',
    }),
    __metadata("design:type", String)
], TaskEvidence.prototype, "verified_status", void 0);
__decorate([
    Column({ type: 'integer', nullable: true, name: 'uploaded_by_user_id' }),
    __metadata("design:type", Object)
], TaskEvidence.prototype, "uploaded_by_user_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'SET NULL' }),
    JoinColumn({ name: 'uploaded_by_user_id' }),
    __metadata("design:type", Object)
], TaskEvidence.prototype, "uploaded_by", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], TaskEvidence.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TaskEvidence.prototype, "updated_at", void 0);
TaskEvidence = __decorate([
    Entity('task_evidences')
], TaskEvidence);
export { TaskEvidence };
//# sourceMappingURL=task-evidence.entity.js.map