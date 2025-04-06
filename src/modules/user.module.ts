import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from '../infrastructure/controller/user.controller';
import { UserService } from '../application/service/user.service';
import { AuthService } from '../application/service/auth.service';
import { PrismaUserRepository } from '../infrastructure/persistence/repository/prisma-user.repository';
import { UserRepository } from '../application/ports/user.repository';
import { FilterModule } from './filter.module';
import { ProfileModule } from './profile.module';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    AuthService, // Ensure AuthService is listed here
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
  exports: [UserService, UserRepository, AuthService], // Ensure AuthService is exported
  imports: [
    FilterModule,
    ProfileModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'defaultSecret',
      signOptions: { expiresIn: '2592000s' },
    }),
  ],
})
export class UserModule {}
