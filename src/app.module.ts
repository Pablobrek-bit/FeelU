import { Module } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { PrismaModule } from './modules/prisma.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule],
})
export class AppModule {}
