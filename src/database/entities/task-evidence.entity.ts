import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { EvidenceVerificationStatus } from '../../configs/constants.js';
import { ComplianceTask } from './compliance-task.entity.js';
import { User } from './user.entity.js';

@Entity('task_evidences')
export class TaskEvidence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'task_id' })
  task_id: number;

  @ManyToOne(() => ComplianceTask, (task: ComplianceTask) => task.evidences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Relation<ComplianceTask>;

  @Column({ type: 'varchar', length: 255, name: 'file_name' })
  file_name: string;

  @Column({ type: 'varchar', length: 500, name: 'file_url' })
  file_url: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'file_type' })
  file_type: string | null;

  @Column({ type: 'bigint', nullable: true, name: 'file_size' })
  file_size: number | null;

  @Column({
    type: 'enum',
    enum: EvidenceVerificationStatus,
    default: EvidenceVerificationStatus.PENDING,
    name: 'verified_status',
  })
  verified_status: EvidenceVerificationStatus;

  @Column({ type: 'integer', nullable: true, name: 'uploaded_by_user_id' })
  uploaded_by_user_id: number | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploaded_by: Relation<User> | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
