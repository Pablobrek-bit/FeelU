import { Module } from '@nestjs/common';
import { UserController } from '../infrastructure/controller/user.controller';
import { UserService } from '../application/service/user.service';
import { PrismaUserRepository } from '../infrastructure/persistence/repository/prisma-user.repository';
import { UserRepository } from '../application/ports/user.repository';
import { FilterModule } from './filter.module';
import { ProfileModule } from './profile.module';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    // FilterService,
    // ProfileService,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
  exports: [UserService, UserRepository],
  imports: [FilterModule, ProfileModule],
})
export class UserModule {}
