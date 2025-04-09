import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { SwipeRepository } from '../../../application/ports/swipe.repository';

@Injectable()
export class PrismaSwipeRepository implements SwipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPotentialMatchesIds(
    userId: string,
    limit: number,
  ): Promise<string[]> {
    const views = await this.prisma.view.findMany({
      where: { userId },
      select: { viewedUser: true },
      take: limit,
    });
    return views.map((view) => view.viewedUser);
  }

  async registerView(userId: string, viewedUserId: string): Promise<void> {
    await this.prisma.view.create({
      data: {
        userId,
        viewedUser: viewedUserId,
      },
    });
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

  async checkIfMatch(userId: string, likedUserId: string): Promise<boolean> {
    const otherUserLike = await this.prisma.like.findFirst({
      where: {
        userId: likedUserId,
        likedUser: userId,
      },
    });

    return !!otherUserLike;
  }

  async registerMatch(userId: string, matchedUserId: string): Promise<void> {
    await this.prisma.match.createMany({
      data: [
        {
          userId,
          matchedUser: matchedUserId,
        },
        {
          userId: matchedUserId,
          matchedUser: userId,
        },
      ],
    });
  }

  async getMatches(userId: string): Promise<string[]> {
    const users = await this.prisma.match.findMany({
      where: {
        userId,
      },
      select: {
        matchedUser: true,
      },
    });

    return users.map((user) => user.matchedUser);
  }

  async getLikedProfiles(userId: string): Promise<string[]> {
    const users = await this.prisma.like.findMany({
      where: {
        userId,
      },
      select: {
        likedUser: true,
      },
    });

    return users.map((user) => user.likedUser);
  }
}
