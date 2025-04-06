import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Re-import JwtModule
import { UserController } from '../infrastructure/controller/user.controller';
import { UserService } from '../application/service/user.service';
import { AuthService } from '../application/service/auth.service';
import { PrismaUserRepository } from '../infrastructure/persistence/repository/prisma-user.repository';
import { UserRepository } from '../application/ports/user.repository';
import { FilterModule } from './filter.module';
import { ProfileModule } from './profile.module';
import { AuthModule } from './auth.module';

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
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'defaultSecret',
      signOptions: { expiresIn: '2592000s' },
    }),
  ],
})
export class UserModule {}
