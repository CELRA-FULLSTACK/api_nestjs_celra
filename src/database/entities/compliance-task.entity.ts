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
import { SeverityLevel, TaskStatus } from '../../configs/constants.js';
import { Company } from './company.entity.js';
import { User } from './user.entity.js';
import { AssessmentItem } from './compliance-assessment.entity.js';
import { TaskEvidence } from './task-evidence.entity.js';

@Entity('compliance_tasks')
export class ComplianceTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'company_id' })
  company_id: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Relation<Company>;

  @Column({ type: 'integer', nullable: true, name: 'assessment_item_id' })
  assessment_item_id: number | null;

  @ManyToOne(() => AssessmentItem, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assessment_item_id' })
  assessment_item: Relation<AssessmentItem> | null;

  @Column({ type: 'varchar', length: 255, name: 'title' })
  title: string;

  @Column({ type: 'text', nullable: true, name: 'description' })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'legal_reference' })
  legal_reference: string | null;

  @Column({ type: 'text', nullable: true, name: 'action_guide' })
  action_guide: string | null;

  @Column({ type: 'enum', enum: SeverityLevel, default: SeverityLevel.STANDARD, name: 'severity' })
  severity: SeverityLevel;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO, name: 'status' })
  status: TaskStatus;

  @Column({ type: 'date', nullable: true, name: 'deadline' })
  deadline: string | null;

  @Column({ type: 'integer', nullable: true, name: 'assigned_to_user_id' })
  assigned_to_user_id: number | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_to_user_id' })
  assigned_to: Relation<User> | null;

  @Column({ type: 'text', nullable: true, name: 'completion_note' })
  completion_note: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completed_at: Date | null;

  @OneToMany(() => TaskEvidence, (evidence: TaskEvidence) => evidence.task, { cascade: true })
  evidences: Relation<TaskEvidence[]>;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
