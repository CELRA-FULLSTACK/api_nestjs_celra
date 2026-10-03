import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'phone' })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'email' })
  email: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'address' })
  address: string | null;

  @Column({ type: 'text', nullable: true, name: 'notes' })
  notes: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'ACTIVE',
    name: 'status',
  })
  status: string;

  @Column({ type: 'integer', nullable: true, name: 'created_by' })
  created_by: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
