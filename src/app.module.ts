import { Module } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { PrismaModule } from './modules/prisma.module';
import { AuthModule } from './modules/auth.module';
import { SwipeModule } from './modules/swipe.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, SwipeModule],
})
export class AppModule {}
