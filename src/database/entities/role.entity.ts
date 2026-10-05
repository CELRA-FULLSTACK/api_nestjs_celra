import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Permission } from './permission.entity.js';
import { User } from './user.entity.js';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'code' })
  code: string;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ type: 'text', nullable: true, name: 'description' })
  description: string | null;

  @Column({ type: 'boolean', default: true, name: 'is_system' })
  is_system: boolean;

  @ManyToMany(() => Permission, (permission: Permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Relation<Permission[]>;

  @Column({ type: 'jsonb', nullable: true, name: 'permission_matrix' })
  permission_matrix: RolePermission[] | null;

  @ManyToMany(() => User, (user: User) => user.roles)
  users: Relation<User[]>;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}

export interface RolePermission {
  resource: string;
  actions: string[];
}
