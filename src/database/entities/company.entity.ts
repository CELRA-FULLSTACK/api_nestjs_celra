import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyStatus } from '../../configs/constants.js';
import { User } from './user.entity.js';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'tax_code' })
  tax_code: string;

  @Column({ type: 'varchar', length: 255, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'phone' })
  phone: string | null;

  @Column({ type: 'text', nullable: true, name: 'address' })
  address: string | null;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.ACTIVE,
    name: 'status',
  })
  status: CompanyStatus;
  @OneToMany(() => User, (user: User) => user.company)
  users: User[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
