import { Module } from '@nestjs/common';
import { UserController } from '../infrastructure/controller/user.controller';
import { UserService } from '../application/service/user.service';
import { AuthService } from '../application/service/auth.service';
import { PrismaUserRepository } from '../infrastructure/persistence/repository/prisma-user.repository';
import { UserRepository } from '../application/ports/user.repository';
import { FilterModule } from './filter.module';
import { ProfileModule } from './profile.module';
import { AuthModule } from './auth.module';
import { RoleModule } from './role.module';
import { EmailModule } from './email.module';
import { FirebaseStorageModule } from './firebase-storage.module';
import { LikeModule } from './like.module';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
  exports: [UserService, UserRepository, AuthService],
  imports: [
    FilterModule,
    ProfileModule,
    AuthModule,
    RoleModule,
    EmailModule,
    FirebaseStorageModule,
    LikeModule,
  ],
})
export class UserModule {}
