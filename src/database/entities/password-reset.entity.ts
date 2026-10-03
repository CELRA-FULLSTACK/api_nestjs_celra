import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('password_resets')
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'email' })
  email: string;

  @Index()
  @Column({ type: 'varchar', length: 255, name: 'token' })
  token: string;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expires_at: Date;

  @Column({ type: 'boolean', default: false, name: 'is_used' })
  is_used: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
