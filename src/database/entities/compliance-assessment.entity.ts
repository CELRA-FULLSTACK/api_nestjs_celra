import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { AssessmentStatus, ComplianceItemStatus, SeverityLevel } from '../../configs/constants.js';
import { Company } from './company.entity.js';
import { User } from './user.entity.js';
import { LegalRequirement } from './legal-knowledge.entity.js';

@Entity('compliance_assessments')
export class ComplianceAssessment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'company_id' })
  company_id: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Relation<Company>;

  @Column({ type: 'integer', name: 'created_by_user_id' })
  created_by_user_id: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by_user_id' })
  created_by: Relation<User>;

  @Column({ type: 'integer', default: 0, name: 'overall_score' })
  overall_score: number; // 0 - 100 điểm

  @Column({ type: 'enum', enum: AssessmentStatus, default: AssessmentStatus.IN_PROGRESS, name: 'status' })
  status: AssessmentStatus;

  @Column({ type: 'integer', default: 0, name: 'total_requirements_checked' })
  total_requirements_checked: number;

  @Column({ type: 'integer', default: 0, name: 'compliant_count' })
  compliant_count: number;

  @Column({ type: 'integer', default: 0, name: 'non_compliant_count' })
  non_compliant_count: number;

  @Column({ type: 'integer', default: 0, name: 'missing_evidence_count' })
  missing_evidence_count: number;

  @Column({ type: 'text', nullable: true, name: 'ai_summary' })
  ai_summary: string | null;

  @OneToMany(() => AssessmentItem, (item: AssessmentItem) => item.assessment, { cascade: true })
  items: Relation<AssessmentItem[]>;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

@Entity('assessment_items')
export class AssessmentItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'assessment_id' })
  assessment_id: number;

  @ManyToOne(() => ComplianceAssessment, (assessment: ComplianceAssessment) => assessment.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Relation<ComplianceAssessment>;

  @Column({ type: 'integer', nullable: true, name: 'requirement_id' })
  requirement_id: number | null;

  @ManyToOne(() => LegalRequirement, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'requirement_id' })
  requirement: Relation<LegalRequirement> | null;

  @Column({ type: 'varchar', length: 255, name: 'title' })
  title: string;

  @Column({ type: 'varchar', length: 255, name: 'legal_reference' })
  legal_reference: string;

  @Column({ type: 'enum', enum: SeverityLevel, default: SeverityLevel.STANDARD, name: 'severity' })
  severity: SeverityLevel;

  @Column({ type: 'enum', enum: ComplianceItemStatus, name: 'status' })
  status: ComplianceItemStatus;

  @Column({ type: 'text', nullable: true, name: 'gap_reason' })
  gap_reason: string | null;

  @Column({ type: 'text', nullable: true, name: 'recommended_action' })
  recommended_action: string | null;

  @Column({ type: 'integer', nullable: true, name: 'auto_generated_task_id' })
  auto_generated_task_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
