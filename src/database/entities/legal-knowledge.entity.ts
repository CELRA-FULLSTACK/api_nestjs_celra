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
import { SeverityLevel } from '../../configs/constants.js';

@Entity('legal_regulations')
export class LegalRegulation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'code' })
  code: string; // VD: 'BLLD_2019', 'LQLT_2019'

  @Column({ type: 'varchar', length: 255, name: 'title' })
  title: string;

  @Column({ type: 'varchar', length: 100, name: 'category' })
  category: string; // 'LABOR', 'TAX', 'BUSINESS_LICENSE', 'FIRE_SAFETY'

  @Column({ type: 'text', nullable: true, name: 'description' })
  description: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'issuing_authority' })
  issuing_authority: string | null;

  @Column({ type: 'date', nullable: true, name: 'effective_date' })
  effective_date: string | null;

  @OneToMany(() => LegalRequirement, (req: LegalRequirement) => req.regulation, { cascade: true })
  requirements: Relation<LegalRequirement[]>;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

@Entity('legal_requirements')
export class LegalRequirement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'regulation_id' })
  regulation_id: number;

  @ManyToOne(() => LegalRegulation, (reg: LegalRegulation) => reg.requirements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'regulation_id' })
  regulation: Relation<LegalRegulation>;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'requirement_code' })
  requirement_code: string; // VD: 'REQ_LABOR_CONTRACT_SIGN', 'REQ_LABOR_RULES_REG'

  @Column({ type: 'varchar', length: 255, name: 'title' })
  title: string;

  @Column({ type: 'text', name: 'description' })
  description: string;

  @Column({ type: 'varchar', length: 255, name: 'legal_reference' })
  legal_reference: string; // Trích dẫn: 'Điều 13, 14 Bộ luật Lao động 2019'

  @Column({ type: 'enum', enum: SeverityLevel, default: SeverityLevel.STANDARD, name: 'severity' })
  severity: SeverityLevel;

  @Column({ type: 'varchar', length: 50, default: 'ONE_TIME', name: 'cycle' })
  cycle: string; // 'ONE_TIME', 'MONTHLY', 'QUARTERLY', 'ANNUAL'

  @Column({ type: 'jsonb', nullable: true, name: 'trigger_conditions' })
  trigger_conditions: {
    min_employees?: number;
    max_employees?: number;
    requires_tax_type?: string;
    has_flags?: string[];
  } | null;

  @Column({ type: 'text', nullable: true, name: 'penalty_summary' })
  penalty_summary: string | null;

  @Column({ type: 'text', nullable: true, name: 'action_guide' })
  action_guide: string | null;

  @Column({ type: 'text', nullable: true, name: 'required_evidence_type' })
  required_evidence_type: string | null; // VD: 'Hợp đồng lao động có chữ ký', 'Biên nhận nộp hồ sơ'

  // PostgreSQL vector embedding column (represented as string or float array in TypeORM)
  @Column({ type: 'text', nullable: true, name: 'embedding' })
  embedding: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
