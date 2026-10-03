import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { RoleCode } from '../../configs/constants.js';
import { Role } from '../../database/entities/role.entity.js';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  /**
   * Lấy danh sách vai trò có thể gán cho nhân viên (loại trừ SYSTEM_ADMIN)
   */
  async getAssignableRoles() {
    return this.roleRepo.find({
      where: {
        code: Not(RoleCode.SYSTEM_ADMIN),
      },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
      },
      order: {
        id: 'ASC',
      },
    });
  }
}
