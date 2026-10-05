import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity.js';

@Entity('compliance_profiles')
export class ComplianceProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', unique: true, name: 'company_id' })
  company_id: number;

  @OneToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Relation<Company>;

  // 1. Nhóm Lao động & Nhân sự
  @Column({ type: 'integer', default: 0, name: 'total_employees' })
  total_employees: number;

  @Column({ type: 'integer', default: 0, name: 'probation_employees' })
  probation_employees: number;

  @Column({ type: 'integer', default: 0, name: 'official_employees' })
  official_employees: number;

  @Column({ type: 'boolean', default: false, name: 'has_internal_labor_rules' })
  has_internal_labor_rules: boolean;

  @Column({ type: 'boolean', default: false, name: 'has_registered_labor_rules' })
  has_registered_labor_rules: boolean;

  @Column({ type: 'boolean', default: false, name: 'has_signed_all_labor_contracts' })
  has_signed_all_labor_contracts: boolean;

  @Column({ type: 'boolean', default: false, name: 'has_social_insurance_registration' })
  has_social_insurance_registration: boolean;

  // 2. Nhóm Thuế & Kế toán
  @Column({ type: 'varchar', length: 50, default: 'QUARTERLY', name: 'tax_declaration_cycle' })
  tax_declaration_cycle: string; // 'MONTHLY' | 'QUARTERLY'

  @Column({ type: 'varchar', length: 50, default: 'CIRCULAR_133', name: 'accounting_standard' })
  accounting_standard: string; // 'CIRCULAR_133' | 'CIRCULAR_200' | 'CIRCULAR_88'

  @Column({ type: 'boolean', default: true, name: 'has_electronic_invoices' })
  has_electronic_invoices: boolean;

  @Column({ type: 'boolean', default: false, name: 'has_digital_signature' })
  has_digital_signature: boolean;

  // 3. Giấy phép & Điều kiện kinh doanh
  @Column({ type: 'jsonb', nullable: true, name: 'business_licenses' })
  business_licenses: Array<{
    name: string;
    license_number?: string;
    issued_date?: string;
    expiry_date?: string;
    status: 'ACTIVE' | 'EXPIRED' | 'MISSING';
  }> | null;

  @Column({ type: 'integer', default: 0, name: 'completeness_score' })
  completeness_score: number; // 0 - 100%

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
