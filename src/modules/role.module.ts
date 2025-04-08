import { Module } from '@nestjs/common';
import { RoleRepository } from '../application/ports/role.repository';
import { RoleService } from '../application/service/role.service';
import { PrismaRoleRepository } from '../infrastructure/persistence/repository/prisma-role.repository';

@Module({
  providers: [
    RoleService,
    { provide: RoleRepository, useClass: PrismaRoleRepository },
  ],
  exports: [RoleService, RoleRepository],
})
export class RoleModule {}
