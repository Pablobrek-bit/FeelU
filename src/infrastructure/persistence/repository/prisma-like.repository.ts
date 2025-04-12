import { Injectable } from '@nestjs/common';
import { LikeRepository } from '../../../application/ports/like.repository';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class PrismaLikeRepository implements LikeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkIfMatch(userId: string, likedUserId: string): Promise<boolean> {
    const otherUserLike = await this.prisma.like.findFirst({
      where: {
        userId: likedUserId,
        likedUser: userId,
      },
    });

    return !!otherUserLike;
  }

  async registerLike(userId: string, likedUserId: string): Promise<boolean> {
    await this.prisma.like.create({
      data: {
        userId,
        likedUser: likedUserId,
      },
    });

    return this.checkIfMatch(userId, likedUserId);
  }

  async countLikesByUserId(userId: string): Promise<number> {
    const likesCount = await this.prisma.like.count({
      where: {
        likedUser: userId,
      },
    });

    return likesCount;
  }

  async getLikedProfiles(userId: string): Promise<string[]> {
    const users = await this.prisma.like.findMany({
      where: {
        likedUser: userId,
      },
    });

    return users.map((user) => user.userId);
  }
}
