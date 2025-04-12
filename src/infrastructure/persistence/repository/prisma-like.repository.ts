import { Injectable } from '@nestjs/common';
import { LikeRepository } from '../../../application/ports/like.repository';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class PrismaLikeRepository implements LikeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countLikesByUserId(userId: string): Promise<number> {
    const likesCount = await this.prisma.like.count({
      where: {
        likedUser: userId,
      },
    });

    return likesCount;
  }
}
