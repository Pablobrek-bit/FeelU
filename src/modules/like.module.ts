import { Module } from '@nestjs/common';
import { LikeService } from '../application/service/like.service';
import { LikeRepository } from '../application/ports/like.repository';
import { PrismaLikeRepository } from '../infrastructure/persistence/repository/prisma-like.repository';

@Module({
  providers: [
    LikeService,
    { provide: LikeRepository, useClass: PrismaLikeRepository },
  ],
  exports: [LikeService, LikeRepository],
})
export class LikeModule {}
