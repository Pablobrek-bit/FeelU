import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../infrastructure/config/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
