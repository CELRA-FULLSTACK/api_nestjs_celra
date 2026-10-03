import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity.js';
import { User } from './entities/user.entity.js';
import { Role } from './entities/role.entity.js';
import { Permission } from './entities/permission.entity.js';
import { PasswordReset } from './entities/password-reset.entity.js';
import { SeedService } from './seeds/seed.service.js';

const entities = [Company, User, Role, Permission, PasswordReset];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [SeedService],
  exports: [TypeOrmModule, SeedService],
})
export class DatabaseModule {}
